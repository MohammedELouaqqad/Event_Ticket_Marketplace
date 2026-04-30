import React, { useContext, useEffect, useState } from "react";
import NavBar from "../Components/NavBar"
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { IoTicketOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { type Event } from "../types/index"

import { type Order} from "../types/index"
import { UserContext } from "../context/UserContext";


function Card(){



    const [ticket, setTicket] = useState(null)

    const context= useContext(UserContext)

    const {userConnected, setUserConnected}=context;   
        
    if(!context){
        return;
    }


    const [order, setOrder] =useState<Order>({event:{},user:{id:userConnected?.id},totalPrice:0,quantity:1})

    const navigate = useNavigate()


    useEffect(()=>{
        setTicket(JSON.parse(localStorage.getItem('events')));
    },[])
   

    useEffect(()=>{
        if(ticket){
            console.log(ticket)
            setOrder({...order,event:ticket})
        
        }
    },[ticket])
 
     console.log(order)
  



    function handleAddQuantity(eventId: number){
        setOrder((t: Order) => {
        
            console.log(t)
            if(t.event.id === eventId){
                return { ...t, quantity: t.quantity+1 };
            }else{
                return t;
            }
        })
        
        localStorage.setItem('orders',JSON.stringify(order))
    }

    function handleMinusQuantity(eventId: number){
        setOrder(t => {
        
            if(t.event.id === eventId){
                return { ...t, quantity: t.quantity-1 };
            }else{
                return t;
            }
        })
        
        localStorage.setItem('orders',JSON.stringify(order))
    }

    function handleRemoveTicket(){
        setTicket({})
        setOrder({})
        localStorage.setItem('events',JSON.stringify({}))
        localStorage.setItem('orders',JSON.stringify({}))
    }

    var token=localStorage.getItem('token')

    useEffect(()=>{
        console.log(userConnected)
    },[userConnected])


    function handleAddingOrder(){
        const fetchAddingOrder = async()=>{
            try{
                console.log(userConnected.id)
                const response = await axios.post("http://localhost:8085/api/orders",order,
                    {
                        headers:{
                            "Authorization":`Bearer ${token}`
                        }
                    }
                )
                if(response.status==200){
                    localStorage.removeItem('events')
                    navigate("/Acceuil")
                }
                console.log(response)
            }catch(error){
                console.log(error)
            }
        }
        fetchAddingOrder()
    } 



    return(
        <div>
             <NavBar/>
            <div className=" p-20">
                <h1 className="font-mono">Your Cart</h1>
                { ticket !== null ?
                    <div key={order.event.id} className="flex gap-8 flex-col lg:flex-row">
                        <div className="w-full">
                            <div className=" bg-gray-200 w-full h-full rounded-lg flex p-4 border-1 border-gray-300">
                                <img src="../../public/favicon.svg" className="rounded-lg object-cover w-24 h-24 md:w-32 md:h-32"/>
                                <div>
                                    <h2 className="text-xl ml-10">{order.event.name}</h2>
                                    <div className="flex items-center mt-1 ml-10">
                                        <CiLocationOn/>
                                        <p className="font-serif ml-4">{order.event.location}</p>
                                    </div>
                                    <div className="flex items-center mb-4 ml-10">
                                        <IoTicketOutline/>
                                        <p className="font-serif ml-4">{order.event.available_tickets} available</p>
                                    </div>
                                    <div className="flex justify-between ml-10 p-2">
                                        <button  onClick={()=>handleMinusQuantity(order.event.id)}  className=" hover:bg-white cursor-pointer border-2  w-8 h-8 flex items-center justify-center">-</button>
                                        <p>{order.quantity}</p>
                                        <button onClick={()=>handleAddQuantity(order.event.id)} className="hover:bg-white cursor-pointer border-2  w-8 h-8 flex items-center justify-center">+</button>
                                    </div>
                                </div>
                                <div className="flex flex-col ml-10 mt-1">            
                                    <p className="rounded-lg text-2xl font-bold text-ind">{order.event.price}$</p>
                                    <button onClick={()=> handleRemoveTicket()} className="text-red-500 text-xl hover:bg-red-200 rounded-full p-2 cursor-pointer flex justify-center mt-2"><MdDeleteOutline /></button>
                                </div>
                                
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6  w-full lg:min-w-64 lg:w-auto">
                            <h1>Summary</h1>
                            <h2>Subtotal</h2>
                            <h2>Taxes</h2>
                            <p>Total </p>
                            <button onClick={handleAddingOrder} type='submit' className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center p-4 rounded-lg w-full">Get Order</button>
                        </div>
                    </div>
                :
                    <div className="bg-red-400 rounded-lg text-center w-60 p-2 text-red-800 mt-10">No Order Available</div>
                }                 
            </div>
        </div>
    )
}



export default Card