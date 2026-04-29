import axios from "axios"
import React, { useContext, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { type UserRegister, type UserAuthenticate, type UserContextType} from "../types/index"
import { UserContext } from "../context/UserContext";



function Authenticate(){



    const [userAuthenticate, setUserAuthenticate] = useState<UserAuthenticate>({email:"",password:"",role:"USER"})
    var token;
    

    const context= useContext(UserContext)


    if(!context){
        return;
    }

    const {userConnected, setUserConnected}=context;   
    



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
                    navigate('/Acceuil')
                }
                console.log(response)
            }catch(error){
                console.log(error)
            }
        }
        fetchAuthenticateUser()
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={authenticate} className="p-10 bg-blue-400 w-full p-10 md:w-120 rounded-lg">
                <h1 className="text-center text-white text-2xl font-mono">LOGIN</h1>
                <div className="flex flex-col mt-10">
                    <label>Email</label>
                    <input onChange={(e)=> setUserAuthenticate({...userAuthenticate,email:e.target.value})} className="bg-gray-200 rounded-lg p-3" type='email' placeholder="example@gmail.com"/>
                </div>
                <div className="flex flex-col mt-6">
                    <label>Password</label>
                    <input onChange={(e)=> setUserAuthenticate({...userAuthenticate,password:e.target.value})}  className="bg-gray-200 rounded-lg p-3" type='password' placeholder="*************"/>
                </div>   
                <button className="font-mono mt-10 bg-blue-800 text-white hover:bg-purple-800 w-full rounded-lg p-4">LOGIN</button>             
                <a href="/Register" className="text-white mt-20">You don't have any account already?</a>
            </form>
        </div>
    )
}


export default Authenticate;