import Sidebar  from '../components/Sidebar'
import Chat from "../components/Chat"
import { createContext, useContext, useEffect, useState } from 'react'
import useSocketsetup from '../hooks/useSocketsetup'
import socketinit from "../socket"
import { AccountContext } from '@/Context'
import Hamburger from '@/components/Hamburger'

export const Friends = createContext<any>("")
export const messagesContext = createContext<any>('')
export const SocketContext = createContext<any>(undefined)
const Home = () => {
  const [ Mainuser , setMainuser] = useState<string | null>(null)
  const [friends , setfriends] = useState<string[]>([])
  const [messages , setmessages] = useState<string[]>([])
  const { user } = useContext(AccountContext)
  const [socket , setsocket] = useState<any>(()=>socketinit(user))
  useEffect(()=>{
    setsocket(()=> socketinit(user))
  },[user])
   useSocketsetup(setfriends,setmessages , socket)
  return (
    <Friends.Provider value={{Mainuser , setMainuser , friends , setfriends}}>
      <SocketContext.Provider value={{socket}}>
         <main className='grid lg:grid-cols-[2fr_9fr]  bg-formbg'>
            <Sidebar  />
            <Hamburger />
            <messagesContext.Provider value={{messages , setmessages}}>
            { Mainuser ? <Chat /> : <div className='flex  h-full justify-center items-center text-white text-2xl pb-20'>  Choose a Chat to start with  </div>}
            </messagesContext.Provider>
         </main>
         </SocketContext.Provider>
   </Friends.Provider>

  )
}

export default Home
