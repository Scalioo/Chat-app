import { useContext } from 'react'
import Friend from './Friend'
import AddFriend from './AddFriend'
import FriendRequests from './FriendRequests'
import { Friends } from '@/Pages/Home'
import { Button } from './ui/button'
import { AccountContext } from '@/Context'
import { ScrollArea } from './ui/scroll-area'
import { Avatar, AvatarFallback } from './ui/avatar'

const Sidebar = () => {
    const { friends }: any = useContext(Friends)
    const { setUser, user } = useContext(AccountContext)
    
    const handlelogout = () => {
        setUser({ loggedIn: false })
        localStorage.removeItem('token')
    }

  return (
    <aside className='hidden h-full w-full min-w-[300px] lg:flex flex-col bg-sidebg rounded-r-3xl text-white shadow-2xl relative overflow-hidden'>
        {/* Header Section - Added Space at Top */}
        <div className='h-28 flex flex-shrink-0 items-end justify-center px-6 relative border-b border-white/5'>
            <div className='font-black text-xl uppercase pt-7 text-white/90'> 
                    Messages
            </div>
            <div className='flex items-center gap-2'>
              <FriendRequests />
              <AddFriend/>
            </div>
        </div>

        {/* Contacts List */}
        <div className='flex-1 overflow-hidden'>
            <ScrollArea className='h-full w-full'>
                <section className='flex flex-col gap-1 items-center py-4'>
                    {friends?.map((friend: any, index: number) => (                
                        <Friend props={friend} key={index}/> 
                    ))}
                </section>
            </ScrollArea>
        </div>

        {/* User Profile / Footer */}
        <div className='h-20 flex-shrink-0 flex items-center justify-between px-8 bg-black/10 rounded-br-2xl border-t border-white/5'>
          <div className='flex items-center gap-3'>
            <Avatar className='h-10 w-10 border border-button'>
              <AvatarFallback className='bg-button text-white uppercase font-bold text-sm'>
                {user?.username?.slice(0, 1) || user?.name?.slice(0, 1) || "?"}
              </AvatarFallback>
            </Avatar>
            <span className='font-bold text-base pt-6 truncate max-w-[120px]'>
              {user?.username || user?.name || "User"}
            </span>
          </div>
          <Button variant='logout' className='text-xs font-bold' onClick={handlelogout}>Logout</Button>
        </div>
    </aside>
  )
}

export default Sidebar
