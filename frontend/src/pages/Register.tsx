import axios from "axios"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { type UserRegister} from "../types/index"


function Register(){





    const [user, setUser] = useState<UserRegister>({name:"",email:"",password:"",role:"USER"})
   

    const navigate = useNavigate()

    function register(e: React.ChangeEvent<HTMLFormElement>){
        alert("HIII")
        e.preventDefault()
        console.log(user)
        const fetchRegisterUser = async()=>{
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
        fetchRegisterUser()
    }

    return (
        <div className="flex items-center justify-center h-screen w-full from-slate-950 bg-gradient-to-br to-indigo-950 via-slate-900">
            <form onSubmit={register} className="p-10 bg-white/5 w-full max-w-md backdrop-blur-md border border-white/10 p-10 rounded-lg">
                <h1 className="text-center text-white text-2xl font-mono">LOGIN</h1>
                <div className="flex flex-col mt-10">
                    <label className="text-sm font-medium text-white/80">Name</label>
                    <input onChange={(e)=> setUser({...user,name:e.target.value})} className=" rounded-lg p-3 placeholder:text-white/40 bg-white/10 border border-white/20 text-white" type='email' placeholder="example@gmail.com"/>
                </div>
                <div className="flex flex-col mt-10">
                    <label className="text-sm font-medium text-white/80">Email</label>
                    <input onChange={(e)=> setUser({...user,email:e.target.value})} className=" rounded-lg p-3 placeholder:text-white/40 bg-white/10 border border-white/20 text-white" type='email' placeholder="example@gmail.com"/>
                </div>
                <div className="flex flex-col mt-6">
                    <label className="text-sm font-medium text-white/80">Password</label>
                    <input onChange={(e)=> setUser({...user,password:e.target.value})}  className=" rounded-lg p-3 placeholder:text-white/40 bg-white/10 border border-white/20 text-white" type='password' placeholder="*************"/>
                </div>   
                <button className="font-mono mt-10 bg-indigo-600 text-white hover:bg-indigo-500 w-full rounded-lg p-4">LOGIN</button>             
                <Link to="/" className="text-center mt-6 block">You have already an account?</Link>
            </form>
        </div>
    )
}


export default Register