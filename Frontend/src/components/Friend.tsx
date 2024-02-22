import  { useContext } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Circle } from 'lucide-react'
import { Friends } from '@/Pages/Home'


const Friend = ({props}: any) => { 
    const { setMainuser } = useContext(Friends)
    const status : string = props.connected ? 'green' : "red"
    
  return (
                 <div  className='grid grid-cols-[3fr_5fr] w-3/4 gap-3 items-center h-[100px] pr-10 hover:cursor-pointer hover:rounded-2xl hover:bg-formbg ' onClick={()=>setMainuser(props)}>
                    <div className='flex justify-center items-center'>
                    <Avatar className='z-1 overflow-visible '>
                        <AvatarImage src="fge" alt="@shadcn" className='rounded-full' />
                        <AvatarFallback className='bg-formbg'>{props.name.slice(0,1)}</AvatarFallback>
                        <Circle fill={status} color={status} className=' absolute top-6 left-6 w-4 h-4 pt-1'/> 
                    </Avatar>
                    </div>
                    <div className='flex justify-center items-center text-xl pt-1 font-semibold'>{props.name}</div>

                </div>
                
     
  )
}
export default Friend
