import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../Context'

  const useSocketsetup = (setfriends : React.Dispatch<React.SetStateAction<string[]>> , setmessages: React.Dispatch<React.SetStateAction<string[]>> , socket:any )  => {
    const { setUser } = useContext(AccountContext)
    useEffect(()=>{
        socket.connect()
        socket.on('connect_error',() => {
             setUser({loggedIn:false})
        })
        socket.on("connected" , (status :boolean , username : string) =>{
          setfriends( (prevfriends : any ) => {
            return [...prevfriends].map((friend : any)=>{
              if (friend.name === username){
                friend.connected = status
              }
            return friend
            })
          })
        })  
        socket.on('friends', (friendslist : string[])=>{
          setfriends(friendslist)
        } )
        socket.on('messages', (messages : any)=>{
          setmessages(messages)
        } )
        socket.on('direct' , (messages : any)=>{
          setmessages((prevmsg: any) => [messages , ...prevmsg])
        })
        return ()=>{
            socket.off("connect_error")
            socket.off("connected")
            socket.off("friends")
            socket.off("messages")
            socket.off('direct')

        }
    }, [setUser , setfriends , setmessages , socket])
  return (
    <div>
      
    </div>
  )
}

export default useSocketsetup
