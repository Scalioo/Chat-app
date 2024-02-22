import React, { useContext, useState } from 'react'
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import AddFriend from './AddFriend';
import { AccountContext } from '@/Context';
import { Friends } from '@/Pages/Home';
import { ScrollArea } from './ui/scroll-area';
import Friend from './Friend';

const Hamburger = ( ) => {
    const [isOpen, setIsOpen] = useState(false);
    const {friends } : any = useContext(Friends)
    const { setUser } = useContext(AccountContext)
    
    const handlelogout = async() =>{
        setUser({loggedIn:false})
        localStorage.removeItem('token')
    
    }
    const handleClick = () => {
        setIsOpen(!isOpen);
    };
    return(
      <div className='absolute left-0 top-0 w-10 pl-5 pt-5 h-full z-30 lg:hidden'>
      { !isOpen &&
        <Button variant='outline' size='icon' onClick={handleClick}>
      <Menu  color='white' className='w-10 h-10'  />
      </Button> 
}
     { isOpen && 
      <main className=' relative h-full w-3/4 min-w-64 grid grid-rows-[1fr_7fr_1fr] gap-4 bg-sidebg rounded-r-2xl text-white shadow-[-2px_22px_64px_0px_rgba(0,174,121,0.25)]
      '>
              <div className='flex w-full h-full items-center '>
                <Button variant='outline' size='icon' className='bg-sidebg border-none' onClick={handleClick}>
              <X  className='w-6 h-6 absolute left-3 top-3 ' />
              </Button>
                  <div className='flex w-2/3 font-semibold text-2xl items-center pl-10'> 
                          Chats
                  </div>
                  <AddFriend/>
              </div>
              <ScrollArea>
              <section  className='flex flex-col gap-2 items-center ' onClick={handleClick}>
                  {friends?.map((friend: string, index: number) =>(                
                       <Friend props={friend}  key={index}/> 
                  ))}
      
              </section>
              </ScrollArea>
              <div className='flex place-items-center'>
                <Button  variant='logout' className='text-lg' onClick={handlelogout}> Logout</Button>
              </div>
          </main>
     }
      </div>
  )
}

export default Hamburger

