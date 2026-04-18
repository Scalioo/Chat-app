import { useContext } from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Circle, Trash2 } from 'lucide-react'
import { Friends, SocketContext } from '@/Pages/Home'

const Friend = ({ props }: any) => {
  const { setMainuser } = useContext(Friends)
  const { socket } = useContext(SocketContext)
  const status: string = props.connected ? 'green' : "red"

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Remove ${props.name} from friends?`)) {
      socket.emit("remove_friend", props.userid, (res: any) => {
        if (!res.done) {
          alert(res.errormessage);
        }
      });
    }
  }

  return (
    <div 
        className='grid grid-cols-[2fr_5fr_1fr] w-[85%] items-center h-[80px] px-4 rounded-2xl hover:cursor-pointer hover:bg-white/5 transition-all text-white' 
        onClick={() => setMainuser(props)}
    >
        <div className='flex justify-center items-center relative h-full'>
            <Avatar className='h-12 w-12 border border-white/10'>
                <AvatarFallback className='bg-button font-bold text-white'>{props.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <Circle fill={status} color={status} className='absolute bottom-3 right-3 w-3 h-3 border border-sidebg rounded-full'/> 
        </div>
        <div className='flex items-center text-xl font-bold pl-2 truncate'>
            {props.name}
        </div>
        <div className='flex justify-center items-center'>
            <button 
                onClick={handleRemove}
                className='p-2 text-white/20 hover:text-red-500 transition-colors'
                title="Remove Member"
            >
                <Trash2 size={18} />
            </button>
        </div>
    </div>
  )
}

export default Friend
