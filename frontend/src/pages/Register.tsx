import axios from "axios"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { type UserRegister} from "../types/index"


function Register(){





    const [user, setUser] = useState<UserRegister>({username:"",email:"",password:"",role:"USER"})
   

    const navigate = useNavigate()

    function authenticate(e: React.ChangeEvent<HTMLInputElement>){
        e.preventDefault()
        console.log(user)
        const fetchAuthenticateUser = async()=>{
            try{
                const response = await axios.post("http://localhost:8085/api/v1/auth/register",user)
                if(response.status === 200){
                    navigate('/')
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
            <form onSubmit={()=>authenticate} className="p-10 bg-blue-400 w-full p-10 md:w-120 rounded-lg">
                <h1 className="text-center text-white text-2xl font-mono">Register</h1>
                <div className="flex flex-col mt-10">
                    <label>Username</label>
                    <input onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setUser({...user,username:e.target.value})} className="bg-gray-200 rounded-lg p-3" type='text' placeholder="Enter your Username"/>
                </div>
                <div className="flex flex-col mt-10">
                    <label>Email</label>
                    <input onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setUser({...user,email:e.target.value})} className="bg-gray-200 rounded-lg p-3" type='email' placeholder="example@gmail.com"/>
                </div>
                <div className="flex flex-col mt-6">
                    <label>Password</label>
                    <input onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setUser({...user,password:e.target.value})}  className="bg-gray-200 rounded-lg p-3" type='password' placeholder="*************"/>
                </div>   
                <button className="font-mono mt-10 bg-blue-800 text-white hover:bg-purple-800 w-full rounded-lg p-4">Register</button>             
                <a href="/" className="text-white mt-20">You have already an account ?</a>
            </form>
        </div>
    )
}


export default Register