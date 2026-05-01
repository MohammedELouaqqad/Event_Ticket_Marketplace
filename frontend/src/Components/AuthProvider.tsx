import { createContext, useContext, useState, type PropsWithChildren } from "react";
import { UserContext } from "../context/UserContext";
import { type UserRegister } from "../types";



const AuthContext = createContext<UserRegister | null>(null)

type AuthProviderProps=PropsWithChildren & {
    isAuthenticated?: boolean;
};



export default function AuthProvider({
  children,
  isAuthenticated,  
}: AuthProviderProps){

    const context= useContext(UserContext)
    if(!context){
        return;
    }
    const {userConnected, setUserConnected}=context;  

    const [user] = useState<UserRegister | null>(isAuthenticated ? {id:userConnected?.id} : null)

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export const useAuth = ()=>{
    const context = useContext(AuthContext);

    if(context === undefined){
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}