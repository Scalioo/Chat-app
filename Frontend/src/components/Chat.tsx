import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Circle , Send } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, Formik } from 'formik';
import { useContext, useEffect, useRef } from 'react';
import { Friends, SocketContext, messagesContext } from '@/Pages/Home';
import { ScrollArea } from './ui/scroll-area';
import * as Yup from 'yup'

const Chat = () => {
  const { Mainuser } = useContext(Friends)
  console.log(Mainuser);
  const { socket } = useContext(SocketContext)
  const status : string = Mainuser.connected? "green" : "red"
  const { messages , setmessages } = useContext(messagesContext)
  const filteredMessages : any = messages.filter((msg : any) => msg.to === Mainuser.userid || msg.from === Mainuser.userid);  
  const bottomdiv = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    bottomdiv.current?.scrollIntoView();
  })
  return (
    <div className='grid grid-rows-[1fr_10fr_1fr] text-white h-screen '>
            <div className=' flex w-full h-full justify-start items-center pl-16 pt-4 lg:p-0'>
                    <div className='flex justify-center items-center w-1/12 '>
                    <Avatar className='z-1 overflow-visible '>
                        <AvatarImage src="fge" alt="avatar" className='rounded-full' />
                        <AvatarFallback className='bg-sidebg'>{Mainuser.name.slice(0,1)}</AvatarFallback>
                        <Circle fill={status} color={status} className=' absolute top-6 left-6 w-4 h-4 pt-1'/> 
                    </Avatar>
                    </div>
                    <div className='flex justify-start items-center text-md font-semibold'>{Mainuser.name}</div>
            </div>
          <ScrollArea className=''>
            <div className='w-full h-full flex flex-col-reverse justify-start gap-2 px-[3rem]'>
              <div ref={bottomdiv}  className='  hidden'/>
               { filteredMessages.length > 0 &&
               filteredMessages
                .map((message : any , index : any) => (
                  <div className={`w-full h-fit flex  ${message.to === Mainuser.userid ? 'justify-end':'justify-start'}`}  key={index}>
               <div  className={`flex h-fit p-1 w-fit max-w-[50rem] justify-center items-center ${
                    message.to === Mainuser.userid ? 'bg-button rounded-b-2xl rounded-tl-2xl ' : 'bg-[#1F2928] rounded-b-2xl rounded-tr-2xl'
                }` } >     
                      <div className=" flex place-items-center text-md font-normal py-1 px-1 pr-2 text-white dark:text-white my-auto "> 
                            {message.content}
                      </div>                             
                </div> 
                </div>
                )
                )}
            </div> 
          </ScrollArea>
          <Formik 
          initialValues={{
            message:''
          }}
          validationSchema={Yup.object({
            message : Yup.string().min(1).max(255)
          })}
          onSubmit={(values , actions)=>{
            console.log(values ,Mainuser.name);
            const message = { to:Mainuser.userid , from : null , content : values.message} 
            socket.emit('direct', message)
            setmessages((prevMsgs : any) => [message, ...prevMsgs])

            actions.resetForm()            
          }}
          >
        {({ values, setFieldValue }) => (

          <Form className='grid grid-cols-[9fr_1fr] '>
            <div className=' flex w-full justify-center  items-center '>
                <Input type="text" placeholder="Type a message " value={values.message} onChange={(e) => setFieldValue('message', e.target.value)}/>
            </div>
            <div className='flex justify-center items-center h-full pt-[0.15rem]'>
            <Button variant="outline" size="icon" className='bg-sidebg' type='submit' >
                <Send color='#00AE79'  className='w-8 h-6' />
            </Button>
            </div>
          </Form>
        )}
          </Formik>
      </div>
  )
}

export default Chat
