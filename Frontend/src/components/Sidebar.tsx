import { useContext, useState } from 'react'
import Friend from './Friend'
import AddFriend from './AddFriend'
import { Friends } from '@/Pages/Home'
import { Button } from './ui/button'
import { AccountContext } from '@/Context'
import { ScrollArea } from '@radix-ui/react-scroll-area'

const Sidebar = () => {
    const {friends } : any = useContext(Friends)
    const { setUser } = useContext(AccountContext)
    
    const handlelogout = async() =>{
        setUser({loggedIn:false})
        localStorage.removeItem('token')
    
    }
  return (
    <>
    {/* <Hamburger setIsOpen={setIsOpen} isOpen={isOpen} /> */}
    <main className='hidden h-full w-full min-w-64 lg:grid grid-rows-[1fr_7fr_1fr] gap-4 bg-sidebg rounded-r-2xl text-white shadow-[-2px_22px_64px_0px_rgba(0,174,121,0.25)]
'>
        <div className='flex w-full h-full items-center '>
            <div className='flex w-2/3 font-semibold text-2xl items-center pl-10'> 
                    Chats
            </div>
            <AddFriend/>
        </div>
        <ScrollArea>
        <section  className='flex flex-col gap-2 items-center '>
            {friends?.map((friend: string, index: number) =>(                
                 <Friend props={friend}  key={index}/> 
            ))}

        </section>
        </ScrollArea>
        <div className='flex place-items-center'>
          <Button  variant='logout' className='text-lg' onClick={handlelogout}> Logout</Button>
        </div>
    </main>
    </>
  )
}

export default Sidebar
