import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar"
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { IoTicketOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios/unsafe/axios.js"




function Card(){


    const [ticket, setTicket] = useState({})
    const [order, setOrder] =useState({event:0,quantity:0})


    useEffect(()=>{
        setTicket(JSON.parse(localStorage.getItem('events')));
        
    },[])
 




    function handleAddQuantity(eventId){
        setTicket(t => {
        
            if(t.Id === eventId){
                return { ...t, quantity: t.quantity+1 };
            }else{
                return t;
            }
        })
        
        localStorage.setItem('events',JSON.stringify(ticket))
    }

    function handleMinusQuantity(eventId){
        setTicket(t => {
        
            if(t.Id === eventId){
                return { ...t, quantity: t.quantity-1 };
            }else{
                return t;
            }
        })
        
        localStorage.setItem('events',JSON.stringify(ticket))
    }

    function handleRemoveTicket(eventId){
        setTicket({})
        localStorage.setItem('events',JSON.stringify(ticket))
    }

    var token=localStorage.getItem('token')

    function handleAddingOrder(){
        const fetchAddingOrder = async()=>{
            try{
                setOrder({event:ticket.Id,quantity:ticket.quantity})
                console.log(order)
                const response = await axios.post("http://localhost:8085/api/orders",order,
                    {
                        headers:{
                            "Authorization":`Bearer ${token}`
                        }
                    }
                )
                if(response.status==200){
                    localStorage.removeItem('events')
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
            <Sidebar/>
            <div className=" p-20">
                <h1 className="font-mono">Your Cart</h1>
                { ticket && 
                    <div key={ticket.Id} className="bg-gray-200 w-200 h-full rounded-lg flex p-4 w-80 border-1 border-gray-300">
                        <img src="../../public/favicon.svg" className="w-30"/>
                        <div>
                            <h2 className="text-xl ml-10">{ticket.name}</h2>
                            <div className="flex items-center mt-1 ml-10">
                                <CiLocationOn/>
                                <p className="font-serif ml-4">{ticket.location}</p>
                            </div>
                            <div className="flex items-center mb-4 ml-10">
                                <IoTicketOutline/>
                                <p className="font-serif ml-4">{ticket.available_ticket} available</p>
                            </div>
                            <div className="flex justify-between ml-10 p-2">
                                <button  onClick={()=>handleMinusQuantity(ticket.Id)}  className=" hover:bg-white cursor-pointer border-2  w-6 rounded-full">-</button>
                                <p>{ticket.quantity}</p>
                                <button onClick={()=>handleAddQuantity(ticket.Id)} className="hover:bg-white cursor-pointer border-2  w-6 rounded-full">+</button>
                            </div>
                        </div>
                        <div className="flex flex-col ml-10 mt-1">            
                            <p className="rounded-lg text-black">{ticket.price}$</p>
                            <button onClick={()=> handleRemoveTicket(ticket.Id)} className="text-red-500 text-xl hover:bg-red-200 rounded-full p-2 cursor-pointer flex justify-center mt-2"><MdDeleteOutline /></button>
                        </div>

                    </div>
                }   
                
                <button onClick={handleAddingOrder} type='submit' className="bg-blue-800 hover:bg-blue-400 text-white font-bold text-center p-4 rounded-lg w-100">PASSE Commande</button>
            </div>
        </div>
    )
}



export default Card