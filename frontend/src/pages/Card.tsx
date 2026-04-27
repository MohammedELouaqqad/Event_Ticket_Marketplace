import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar"
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { IoTicketOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { type Event } from "../types/index"

import { type Order} from "../types/index"


function Card(){



    const [ticket, setTicket] = useState({})
    const [order, setOrder] =useState<Order>({event:{},user:{id:2},totalPrice:0,quantity:1})

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


    function handleAddingOrder(){
        const fetchAddingOrder = async()=>{
            try{
         
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

    const [filterEvents, setFilterEvents] = useState<Event[]>([])

    return(
        <div>
             <Sidebar setFilterEvents={setFilterEvents}/>
            <div className=" p-20">
                <h1 className="font-mono">Your Cart</h1>
                { order.event != {} && 
                    <div key={order.event.id}>
                        <div className="bg-gray-200 w-200 h-full rounded-lg flex p-4 w-80 border-1 border-gray-300">
                            <img src="../../public/favicon.svg" className="w-30"/>
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
                                    <button  onClick={()=>handleMinusQuantity(order.event.id)}  className=" hover:bg-white cursor-pointer border-2  w-6 rounded-full">-</button>
                                    <p>{order.quantity}</p>
                                    <button onClick={()=>handleAddQuantity(order.event.id)} className="hover:bg-white cursor-pointer border-2  w-6 rounded-full">+</button>
                                </div>
                            </div>
                            <div className="flex flex-col ml-10 mt-1">            
                                <p className="rounded-lg text-black">{order.event.price}$</p>
                                <button onClick={()=> handleRemoveTicket()} className="text-red-500 text-xl hover:bg-red-200 rounded-full p-2 cursor-pointer flex justify-center mt-2"><MdDeleteOutline /></button>
                            </div>
                            
                        </div>
                        <button onClick={handleAddingOrder} type='submit' className="bg-blue-800 hover:bg-blue-400 text-white font-bold text-center p-4 rounded-lg w-100">PASSE Commande</button>
                    </div>
                }   
                {
                    order ==={} && 
                    <div className="bg-red-400 rounded-lg text-center w-60 p-2 text-red-800 mt-10">No Order Available</div>
                }
                
               
            </div>
        </div>
    )
}



export default Card