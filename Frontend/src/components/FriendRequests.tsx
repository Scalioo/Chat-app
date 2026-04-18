import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Bell } from 'lucide-react'
import { Button } from './ui/button'
import { useContext } from "react"
import { Friends, SocketContext } from "@/Pages/Home"
import { ScrollArea } from "./ui/scroll-area"

const FriendRequests = () => {
  const { socket } = useContext(SocketContext)
  const { requests, setRequests } = useContext(Friends)

  const handleAccept = (name: string) => {
    socket.emit("accept_friend", name, (res: any) => {
      if (res.done) {
        setRequests((prev: string[]) => prev.filter(r => r !== name))
      }
    })
  }

  const handleDecline = (name: string) => {
    socket.emit("decline_friend", name, (res: any) => {
      if (res.done) {
        setRequests((prev: string[]) => prev.filter(r => r !== name))
      }
    })
  }

  return (
    <div className='flex items-center justify-end pr-2 rounded-md'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' size='icon' className="relative">
            <Bell className='w-5 h-5' />
            {requests.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {requests.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-80 min-h-40 h-fit bg-sidebg border-none shadow-[-2px_22px_64px_0px_rgba(0,174,121,0.25)] ml-5 text-white'>
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">Friend Requests</h3>
            <ScrollArea className="h-64">
              {requests.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No pending requests</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {requests.map((name: string) => (
                    <div key={name} className="flex items-center justify-between bg-black/20 p-2 rounded-lg">
                      <span className="font-semibold truncate max-w-[120px]">{name}</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 h-8 px-3"
                          onClick={() => handleAccept(name)}
                        >
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-3 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => handleDecline(name)}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default FriendRequests
