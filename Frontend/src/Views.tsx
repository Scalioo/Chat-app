import './App.css'
import {Route, Routes} from 'react-router-dom'
import  Login  from './Pages/Login'
import Signup from './Pages/Signup'
import Home  from './Pages/Home'
import PrivateRoutes from './components/PrivateRoutes'
import { useContext } from 'react'
import { AccountContext } from './Context'
const Views =() => {
  const { user } = useContext(AccountContext)
  return  user.loggedIn === null ? (""):(
   <Routes>
     <Route element={<PrivateRoutes/>}>
        <Route path='/home' element={<Home/>} />
      </Route>
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/*' element={<Login/>} />
   </Routes> 
  )
}

export default Views ;