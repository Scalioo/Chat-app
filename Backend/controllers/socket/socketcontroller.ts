const redisclient  = require('../../redis')

interface instance {
    name : string , 
    userid : string , 
    connected : boolean
}
export interface message {
    to : string , 
    from : string , 
    content : string
}
const parsedfriendlist : any = async ( friendlist : any )  =>{
    const newfriendlist :instance[] = []    
    for ( let friend of friendlist){
        const parsedfriend = friend.split('.')
        const friendconnected = await redisclient.hget(`userid:${parsedfriend[0]}` , "connected"  )        
        newfriendlist.push({
            name :parsedfriend[0] ,
            userid : parsedfriend[1] ,
            connected : friendconnected === 'true'
        })
    }
    return newfriendlist
}

module.exports.initializeUser = async (socket : any) => {
    socket.join(socket.user.userid)  
    await redisclient.hset(
      `userid:${socket.user.name}`,
      "userid",
      socket.user.userid ,
       "connected",
       true
    );
    const friendList = await redisclient.lrange(
      `friends:${socket.user.name}`,
      0,
      -1
    );
    
    const parsedfriendlist1 : any =  await parsedfriendlist(friendList)        
    const friendRooms  = parsedfriendlist1.map((friend:any) => friend.userid)
    if (friendRooms ){
    socket.to(friendRooms).emit("connected" , true , socket.user.name)}
    socket.emit("friends", parsedfriendlist1);    
    const messagequery = await redisclient.lrange(
        `chat:${socket.user.userid}` ,
        0 ,
        -1 
        )        
    const messages : any = messagequery.map((msg : any) => {
        return {to : msg.split('.')[0] , from : msg.split('.')[1] , content : msg.split('.')[2]}
    })
    if ( messages ){
        socket.emit("messages" , messages)
    }
  };
module.exports.addfriend = async(socket:any ,friendname: string , cb : any) => {
    if (friendname === socket.user.name){
        cb({data: false , errormessage:"cant add self  "})
        return ;
    }
    const currenfriendlist : any = await redisclient.lrange(
        `friends:${socket.user.name}` , 
        0 ,
        -1
    )
    const friend : any = await redisclient.hgetall(
        `userid:${friendname.split('.')[0]}` , 
    )
    if ( !friend ){
        cb({data: false , errormessage:"user not found "})
        return ;
    }
    if ( currenfriendlist && currenfriendlist.indexOf(friendname) !== -1 ) {
        cb({data: false , errormessage:" Can't be friends with ur friend  "})

    }
    await redisclient.lpush(`friends:${socket.user.name}`, [friendname , friend.userid].join(".")   )
    const newfriend : instance ={
        name: friendname ,
        userid: friend.userid ,
        connected: friend.connected
    }   
    cb({done : true , newfriend})
    
}

module.exports.onDisconnect = async (socket : any) => {
    await redisclient.hset(
        `userid:${socket.user.name}` ,
        "connected" ,
        false
    ) 
    const friendList = await redisclient.lrange(`friends:${socket.user.name}` , 0 , -1)
    const friendRooms = await parsedfriendlist(friendList).then((friends:any) => 
        friends?.map((friend:any) => friend.userid)
    )
    socket.to(friendRooms).emit("connected" , false , socket.user.name)
}

module.exports.dm = async (socket : any, message : message ) => {
    message.from = socket.user.userid    
    const messageString = [message.to , message.from , message.content].join('.')
    
    await redisclient.lpush(
        `chat:${message.to}` , messageString
    )
    await redisclient.lpush(
        `chat:${message.from}` , messageString
    )
    
    socket.to(message.to).emit('direct',message)
}