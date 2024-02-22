import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { UserRoundPlus } from 'lucide-react'
import { Button } from './ui/button'
import { ErrorMessage, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Input } from "./ui/input"
import { useContext, useEffect, useState } from "react"
import { Friends, SocketContext } from "@/Pages/Home"
interface instance {
  name : string , 
  userid : string , 
  connected : boolean
}
interface response_emit {
  errormessage : string , 
  done : boolean ,
  newfriend?:instance 
}
const validationSchema = Yup.object({
    username: Yup.string().max(8,"Username must be 8 characters or less").required('Username is required'),
  });


const AddFriend = () => {
  const { socket } = useContext(SocketContext)
  const [error , setError] = useState('')
  const { friends , setfriends} = useContext(Friends)
  useEffect(()=>{

  },[friends])
  return (
    <div className='flex items-center justify-end pr-4'>
    <Popover>
        <PopoverTrigger asChild>
           <Button variant='outline' size='icon'>
             <UserRoundPlus className='w-6 h-6'/>
           </Button>
        </PopoverTrigger>
        <PopoverContent className='w-80 min-h-40 h-fit bg-sidebg border-none shadow-[-2px_22px_64px_0px_rgba(0,174,121,0.25)] ml-5  text-white font-semibold text-lg  '>
           <Formik 
           initialValues={{
               username:""
           }}
           validationSchema={validationSchema}
           onSubmit={(values , actions)=>{
               actions.resetForm()   
               socket.emit("add_friend",
               values.username , 
               ({errormessage , done , newfriend }:response_emit ) =>{
                if(!done){ 
                  setError(errormessage)
                  setTimeout(()=>{
                    setError('')
                  },3000)
                  return ;
                }
                  setfriends((prevfriends:any) => [newfriend, ...prevfriends])
                  return ;
               }
               )
           }}
           >
            {({ values, setFieldValue }) => (

           <Form >
               <label htmlFor="username">Add A Friend </label>
               {error && <p className="error"> {error}</p>}
               <Input type='text' id="username" name='username' placeholder='Search for a friend' value={values.username} onChange={(e) => setFieldValue('username', e.target.value)}   />
               <Button variant='form' type='submit'>Search</Button>
               <ErrorMessage name='username' component="p" className='error pt-3' />
           </Form >
            )}
           </Formik>
        </PopoverContent>
    </Popover>
</div>
  )
}

export default AddFriend
