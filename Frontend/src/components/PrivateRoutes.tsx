import { AccountContext } from "@/Context";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
    const { user } = useContext(AccountContext)
    console.log(user);
    
    return user && user.loggedIn ;
}


const PrivateRoutes =() => {
    const isAuth  = useAuth();
    console.log(isAuth);
    return isAuth ? <Outlet/> : <Navigate to ="/login" />
}

export default PrivateRoutes