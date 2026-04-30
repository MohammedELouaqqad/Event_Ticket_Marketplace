
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import axios from "axios";
import {type Event} from "../types/index"
import { UserContext } from "../context/UserContext";




function NavBar(){

    const context= useContext(UserContext)


    if(!context){
        return;
    }


    const {userConnected, setUserConnected}=context;  

    const navigate = useNavigate()

    function handleLogout(){
        localStorage.removeItem("token")
        navigate("/")
    }


    

    return(
        <div className="bg-slate-900 border-b border-white/10 flex justify-between h-20 p-6 items-center">
            <h1 className="text-indigo-400 text-xl font-bold mr-4 md:mr-14">TRICKER</h1>
            <button onClick={()=> navigate("/Card")} className="text-slate-300 hover:text-white hover:bg-white/10 rounded-lg px-4 py-2 ">My Orders</button>
            <button onClick={()=> navigate("/events")} className="text-slate-300 hover:text-white hover:bg-white/10 rounded-lg px-4 py-2 ">Events</button>
            <span className="text-slate-300 hover:text-white hover:bg-white/10 rounded-lg px-4 py-2 ">{userConnected?.name}</span>
            <button onClick={()=> handleLogout()} className="text-slate-300 hover:text-red-400 hover:bg-white/10 rounded-lg px-4 py-2 ">Logout</button>
        </div>
    )
}



export default NavBar