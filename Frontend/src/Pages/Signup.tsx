import { AccountContext } from '../Context';
import { Button } from '@/components/ui/button';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import  { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
import { baseURL } from '../../const'

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});
const Signup = () => {
  const { setUser } = useContext(AccountContext)
  const navigate = useNavigate();
  const [error , setError ] = useState('')

  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div className="Container" >
          <div className="grid w-full h-full grid-rows-[2fr_6fr_1fr] justify-center items-center">
              <div className="flex flex-col gap-2 justify-center items-center text-[2.5rem] font-semibold text-white"> 
                    Sign-Up
                    { error && 
                    <div className='error pl-10'>{error}</div>
              }
              </div>
             
              <Formik
                initialValues={{
                email:'',
                username:'',
                password:'',
      
              }}
              validationSchema={validationSchema}
              onSubmit={(values , actions ) => {
              const vals ={...values}
              actions.resetForm()
              fetch(`${baseURL}/auth/register`,{
                method: 'POST',
                credentials: 'include',
                headers:{
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(vals)
              }).catch(err => {
                return(err);
              })
              .then(res => {
                 if (!res || !res.ok || res.status>= 400) {
                  return ;
                 }
                 return res.json()
                
              }).then( data => {
                if (!data ) return ;
                if (data.status) {
                  setError(data.status)
                  return ;
                } 
                console.log(data);
                setUser({...data})
                localStorage.setItem("token",data.token)
                navigate("/home")   
              })
              }}
              >
                 <Form className="grid w-full h-full grid-rows-[2fr_2fr_1fr]">
                     
                     <div className="input-container">
                       <label htmlFor="username">Username:</label>
                       <Field type="text" id="username" name="username" placeholder='Enter your Username' />
                       <ErrorMessage name="username" component="p" className="error" />
                     </div>
                     <div className="input-container">
                       <label htmlFor="password">Password:</label>
                       <Field type="password" id="password" name="password" placeholder='Enter your password' />
                       <ErrorMessage name="password" component="p" className="error" />
                     </div>
                     <div className='w-full h-full pt-5'>
                     <Button variant='form' type="submit">Submit</Button>
                     </div>
                     
                 </Form>
              </Formik>
              <div className="w-full h-full">
                <Button variant='link'>
                  <NavLink to= '/login'>Login</NavLink>
                </Button>
              </div>
          </div>
  
    </div>
    </div>

  )
}

export default Signup
