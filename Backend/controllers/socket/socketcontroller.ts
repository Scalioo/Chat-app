import redisclient from "../../redis";
import { AuthenticatedSocket, ChatMessage, FriendInfo } from "../../types";

const parseFriendList = async (friendList: string[]): Promise<FriendInfo[]> => {
  const newFriendList: FriendInfo[] = [];
  for (const friendStr of friendList) {
    try {
      let friendObj;
      if (friendStr.includes('{')) {
        friendObj = JSON.parse(friendStr);
      } else {
        const parts = friendStr.split('.');
        friendObj = { name: parts[0], userid: parts[1] };
      }
      
      const friendConnected = await redisclient.hget(`userid:${friendObj.name}`, "connected");
      newFriendList.push({
        name: friendObj.name,
        userid: friendObj.userid,
        connected: friendConnected === 'true'
      });
    } catch (e) {
      console.error("Error parsing friend string:", friendStr, e);
    }
  }
  return newFriendList;
};

export const initializeUser = async (socket: AuthenticatedSocket) => {
  socket.join(socket.user.userid);
  await redisclient.hset(
    `userid:${socket.user.name}`,
    "userid",
    socket.user.userid,
    "connected",
    "true"
  );

  // Fetch Friends
  const friendListRaw = await redisclient.lrange(`friends:${socket.user.name}`, 0, -1);
  const friends = await parseFriendList(friendListRaw);
  const friendRooms = friends.map((f) => f.userid);

  if (friendRooms.length > 0) {
    socket.to(friendRooms).emit("connected", "true", socket.user.name);
  }
  socket.emit("friends", friends);

  // Fetch Pending Requests
  const requests = await redisclient.smembers(`friend_requests:${socket.user.name}`);
  socket.emit("friend_requests", requests);

  // Fetch Messages
  const messageQuery = await redisclient.lrange(`chat:${socket.user.userid}`, 0, -1);
  const messages: ChatMessage[] = messageQuery.map((msgStr: string) => {
    try {
      return msgStr.includes('{') ? JSON.parse(msgStr) : null;
    } catch (e) {
      return null;
    }
  }).filter(Boolean);

  if (messages.length > 0) {
    socket.emit("messages", messages);
  }
};

export const handleFriendRequest = async (socket: AuthenticatedSocket, friendName: string, cb: any) => {
  if (friendName === socket.user.name) {
    return cb({ done: false, errormessage: "Can't add yourself" });
  }

  const friendData = await redisclient.hgetall(`userid:${friendName}`);
  if (!friendData || !friendData.userid) {
    return cb({ done: false, errormessage: "User not found" });
  }

  // Check if they are already friends
  const currentFriends = await redisclient.lrange(`friends:${socket.user.name}`, 0, -1);
  const alreadyFriends = currentFriends.some(f => f.includes(friendName));
  if (alreadyFriends) {
    return cb({ done: false, errormessage: "Already friends" });
  }

  // Store the request
  await redisclient.sadd(`friend_requests:${friendName}`, socket.user.name);
  
  // Notify recipient if online (using their userid as room)
  socket.to(friendData.userid).emit("friend_request_received", socket.user.name);

  cb({ done: true, message: "Invitation Sent!" });
};

export const acceptFriendRequest = async (socket: AuthenticatedSocket, requesterName: string, cb: any) => {
  // Verify request exists
  const isRequestValid = await redisclient.sismember(`friend_requests:${socket.user.name}`, requesterName);
  if (!isRequestValid) {
    return cb({ done: false, errormessage: "Invalid or expired request" });
  }

  const requesterData = await redisclient.hgetall(`userid:${requesterName}`);
  if (!requesterData || !requesterData.userid) {
    return cb({ done: false, errormessage: "User no longer exists" });
  }

  // Remove request
  await redisclient.srem(`friend_requests:${socket.user.name}`, requesterName);

  // Establish Mutual Friendship
  const requesterInfo = { name: requesterName, userid: requesterData.userid };
  const selfInfo = { name: socket.user.name, userid: socket.user.userid };

  await redisclient.lpush(`friends:${socket.user.name}`, JSON.stringify(requesterInfo));
  await redisclient.lpush(`friends:${requesterName}`, JSON.stringify(selfInfo));

  // Notify both
  const requesterResult = { ...requesterInfo, connected: requesterData.connected === 'true' };
  const selfResult = { ...selfInfo, connected: true };

  // Update recipient (self)
  socket.emit("friend_accepted", requesterResult);
  
  // Update requester (if online)
  socket.to(requesterData.userid).emit("friend_accepted", selfResult);

  cb({ done: true });
};

export const declineFriendRequest = async (socket: AuthenticatedSocket, requesterName: string, cb: any) => {
  await redisclient.srem(`friend_requests:${socket.user.name}`, requesterName);
  cb({ done: true });
};

export const removeFriend = async (socket: AuthenticatedSocket, friendId: string, cb: any) => {
  // Find the friend's name from their ID (we might need to search the friends list or check a mapping)
  const currentFriendsRaw = await redisclient.lrange(`friends:${socket.user.name}`, 0, -1);
  let friendName = "";
  let friendStrToRemove = "";

  for (const f of currentFriendsRaw) {
    const parsed = JSON.parse(f);
    if (parsed.userid === friendId) {
      friendName = parsed.name;
      friendStrToRemove = f;
      break;
    }
  }

  if (!friendName) {
    return cb({ done: false, errormessage: "Friend not found in list" });
  }

  // 1. Remove from my list
  await redisclient.lrem(`friends:${socket.user.name}`, 0, friendStrToRemove);

  // 2. Remove me from their list
  const selfStrToRemove = JSON.stringify({ name: socket.user.name, userid: socket.user.userid });
  await redisclient.lrem(`friends:${friendName}`, 0, selfStrToRemove);

  // 3. Notify both
  socket.emit("friend_removed", friendId);
  socket.to(friendId).emit("friend_removed", socket.user.userid);

  cb({ done: true });
};

export const onDisconnect = async (socket: AuthenticatedSocket) => {
  await redisclient.hset(`userid:${socket.user.name}`, "connected", "false");
  const friendListRaw = await redisclient.lrange(`friends:${socket.user.name}`, 0, -1);
  const friends = await parseFriendList(friendListRaw);
  const friendRooms = friends.map((f) => f.userid);
  if (friendRooms.length > 0) {
    socket.to(friendRooms).emit("connected", "false", socket.user.name);
  }
};

export const dm = async (socket: AuthenticatedSocket, message: ChatMessage) => {
  message.from = socket.user.userid;
  const messageString = JSON.stringify(message);
  await redisclient.lpush(`chat:${message.to}`, messageString);
  await redisclient.lpush(`chat:${message.from}`, messageString);
  socket.to(message.to).emit('direct', message);
};