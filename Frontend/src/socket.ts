import { io } from 'socket.io-client'
import { User }from './Context'
import { baseURL } from '../const'


const socket  = ( user : User) => new (io as any)(`${baseURL}`,{
    autoConnect:false ,
    withCredentials: true , 
    auth :{
        token : user.token
    }
})

export default socket