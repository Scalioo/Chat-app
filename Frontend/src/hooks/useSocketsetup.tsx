import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../Context'

const useSocketsetup = (
  setfriends: React.Dispatch<React.SetStateAction<any[]>>,
  setmessages: React.Dispatch<React.SetStateAction<any[]>>,
  setRequests: React.Dispatch<React.SetStateAction<string[]>>,
  socket: any
) => {
  const { setUser } = useContext(AccountContext)

  useEffect(() => {
    socket.connect()

    socket.on('connect_error', () => {
      setUser({ loggedIn: false })
    })

    socket.on("connected", (status: string, username: string) => {
      setfriends((prevfriends: any[]) => {
        return prevfriends.map((friend: any) => {
          if (friend.name === username) {
            return { ...friend, connected: status === 'true' };
          }
          return friend;
        });
      });
    });

    socket.on('friends', (friendslist: any[]) => {
      setfriends(friendslist)
    })

    socket.on('friend_requests', (requestsList: string[]) => {
      setRequests(requestsList)
    })

    socket.on('friend_request_received', (senderName: string) => {
      setRequests((prev) => [...new Set([senderName, ...prev])])
    })

    socket.on('friend_accepted', (newFriend: any) => {
      setfriends((prev) => [newFriend, ...prev])
      // Also remove from requests if it was there
      setRequests((prev) => prev.filter(r => r !== newFriend.name))
    })

    socket.on('friend_removed', (friendId: string) => {
      setfriends((prev) => prev.filter(f => f.userid !== friendId))
    })

    socket.on('messages', (messages: any[]) => {
      setmessages(messages)
    })

    socket.on('direct', (message: any) => {
      setmessages((prevmsg: any) => [message, ...prevmsg])
    })

    return () => {
      socket.off("connect_error")
      socket.off("connected")
      socket.off("friends")
      socket.off("friend_requests")
      socket.off("friend_request_received")
      socket.off("friend_accepted")
      socket.off("friend_removed")
      socket.off("messages")
      socket.off('direct')
    }
  }, [setUser, setfriends, setmessages, setRequests, socket])

  return null
}

export default useSocketsetup
