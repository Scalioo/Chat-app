import { error } from "console";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from '../const'
 
export interface User {
    loggedIn : boolean | null ,
    name?: string | null ,
    token : string | null
}
interface Contextype {
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    user : User | null 
}
export const AccountContext = createContext<any>(undefined)

const UserContext =({children} : any ) =>{
    const navigate = useNavigate()
    const [user , setUser]  = useState<User | null>({loggedIn: null , name : null , token:localStorage.getItem('token')})
    useEffect(() => {
        fetch(`${baseURL}/auth/login`,{
            credentials: "include",
            mode: 'cors',
            headers:{
              authorization :`Bearer ${user?.token}`
            }
            

        })
        .catch((err : Error) => {
            setUser({loggedIn:false, name :null , token : null  })            
            return ;
        } )
        .then(res => {
            if (!res || !res.ok || res.status>= 400) {
                setUser({loggedIn:false, name :null , token : null  })
             return  ;
            }
            return res.json()
        })
        .then( (data : any) => {
            if (!data ) {
                setUser({loggedIn:false, name :null , token : null  })
                return ;
            } ; 
            setUser({...data})
            navigate('/home')
          })
    },[])
  
    return (
        <AccountContext.Provider value={{setUser,user}}>
            {children}
        </AccountContext.Provider>
    )
}
export default UserContext