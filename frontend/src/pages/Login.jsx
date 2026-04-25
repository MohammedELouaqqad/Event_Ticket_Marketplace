import axios from "axios/unsafe/axios.js"
import { useState } from "react"
import { useNavigate } from 'react-router-dom';




function Login(){

    const [user, setUser] = useState({email:"",password:"",role:"USER"})
    var token;

    const navigate = useNavigate()

    function authenticate(e){
        e.preventDefault()
        console.log(user)
        const fetchAuthenticateUser = async()=>{
            try{
                const response = await axios.post("http://localhost:8085/api/v1/auth/authenticate",user)
                if(response.status === 200){
                    token=response.data.token;
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
                    <input onChange={(e)=> setUser({...user,email:e.target.value})} className="bg-gray-200 rounded-lg p-3" type='email' placeholder="example@gmail.com"/>
                </div>
                <div className="flex flex-col mt-6">
                    <label>Password</label>
                    <input onChange={(e)=> setUser({...user,password:e.target.value})}  className="bg-gray-200 rounded-lg p-3" type='password' placeholder="*************"/>
                </div>   
                <button className="font-mono mt-10 bg-blue-800 text-white hover:bg-purple-800 w-full rounded-lg p-4">LOGIN</button>             
                <a href="/SignUp" className="text-white mt-20">You don't have any account already?</a>
            </form>
        </div>
    )
}


export default Login;