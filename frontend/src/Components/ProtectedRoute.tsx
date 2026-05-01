import { useContext, useEffect, type PropsWithChildren } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";


type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({children}: ProtectedRouteProps){

    const context= useContext(UserContext)
    const navigate = useNavigate()
    const {userConnected, setUserConnected}=context;  
    
    useEffect(()=>{
        if(!userConnected){
            navigate('/authenticate',{replace:true})
        }
 
        if(userConnected === null){
            throw new Error('useAuth must be used within an AuthProvider');
        }
    },[navigate,userConnected]);

    return children;
}