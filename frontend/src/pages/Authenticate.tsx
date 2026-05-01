import axios from "axios"
import React, { useContext, useState } from "react"
import { Link, useNavigate } from 'react-router-dom';
import { type UserRegister, type UserAuthenticate, type UserContextType} from "../types/index"
import { UserContext } from "../context/UserContext";



function Authenticate(){



    const [userAuthenticate, setUserAuthenticate] = useState<UserAuthenticate>({email:"",password:"",role:"USER"})
    let token;
    

    const context= useContext(UserContext)


    if(!context){
        return;
    }

    const {userConnected, setUserConnected}=context;   
    // const {currentUser, setCurrentUser}=context;  
    // const {isAuthenticated, setIsAuthenticated} =



    const navigate = useNavigate()
    

    function authenticate(e: React.ChangeEvent<HTMLFormElement>){
        e.preventDefault()

        const fetchAuthenticateUser = async()=>{
            try{
                const response = await axios.post("http://localhost:8085/api/v1/auth/authenticate",userAuthenticate)
                if(response.status === 200){
                    token=response.data.token;
                    setUserConnected(response.data.user);
                    localStorage.setItem('token',token)
                    navigate('/events')
                }
                console.log(response)
            }catch(error){
                console.log(error)
            }
        }
        fetchAuthenticateUser()
    }

    return (
        <div className="flex items-center justify-center h-screen w-full from-slate-950 bg-gradient-to-br to-indigo-950 via-slate-900">
            <form onSubmit={authenticate} className="p-10 bg-white/5 w-full max-w-md backdrop-blur-md border border-white/10 p-10 rounded-lg">
                <h1 className="text-center text-white text-2xl font-mono">LOGIN</h1>
                <div className="flex flex-col mt-10">
                    <label className="text-sm font-medium text-white/80">Email</label>
                    <input onChange={(e)=> setUserAuthenticate({...userAuthenticate,email:e.target.value})} className=" rounded-lg p-3 placeholder:text-white/40 bg-white/10 border border-white/20 text-white" type='email' placeholder="example@gmail.com"/>
                </div>
                <div className="flex flex-col mt-6">
                    <label className="text-sm font-medium text-white/80">Password</label>
                    <input onChange={(e)=> setUserAuthenticate({...userAuthenticate,password:e.target.value})}  className=" rounded-lg p-3 placeholder:text-white/40 bg-white/10 border border-white/20 text-white" type='password' placeholder="*************"/>
                </div>   
                <button className="font-mono mt-10 bg-indigo-600 text-white hover:bg-indigo-500 w-full rounded-lg p-4">LOGIN</button>             
                <Link to="/Register" className="text-center mt-6 block">You don't have any account already?</Link>
            </form>
        </div>
    )
}


export default Authenticate;