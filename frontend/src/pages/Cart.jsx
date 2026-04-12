import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar"
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { IoTicketOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";



function Card(){


    const [tickets, setTickets] = useState([])


    useEffect(()=>{
        setTickets(JSON.parse(localStorage.getItem('events')));
        
    },[])
 




    function handleAddQuantity(eventId){
        setTickets(tickets.map(t => {
        
            if(t.Id === eventId){
                return { ...t, quantity: t.quantity+1 };
            }else{
                return t;
            }
        }))
        
        localStorage.setItem('events',JSON.stringify(tickets))
    }

    function handleMinusQuantity(eventId){
        setTickets(tickets.map(t => {
        
            if(t.Id === eventId){
                return { ...t, quantity: t.quantity-1 };
            }else{
                return t;
            }
        }))
        
        localStorage.setItem('events',JSON.stringify(tickets))
    }

    function handleRemoveTicket(eventId){
        const newTickets = tickets.filter((t)=> t.Id!==eventId)
        setTickets(newTickets)
        localStorage.setItem('events',JSON.stringify(newTickets))
    }

    function handleAddingOrder(){
        const fetchAddingOrder = async()=>{
            try{
                const response = await axios.post("http://localhost:8085/api/AddOrder",tickets)
                if(response.status==200){
                    localStorage.removeItem('events')
                }
                console.log(response)
            }catch(error){
                console.log(error)
            }
        }
    } 

    return(
        <div>
            <Sidebar/>
            <div className=" p-20">
                <h1 className="font-mono">Your Cart</h1>
                <div className="mt-20 grid lg:grid-rows-3 gap-y-10 sm:grid-rows-2 gap-2">
                    {tickets && tickets.map((event)=>{
                        return(
                            
                            <div key={event.id} className="bg-gray-200 w-200 h-full rounded-lg flex p-4 w-80 border-1 border-gray-300">
                                {console.log(event)}
                                <img src="../../public/favicon.svg" className="w-30"/>
                                <div>
                                    <h2 className="text-xl ml-10">{event.name}</h2>
                                    <div className="flex items-center mt-1 ml-10">
                                        <CiLocationOn/>
                                        <p className="font-serif ml-4">{event.location}</p>
                                    </div>
                                    <div className="flex items-center mb-4 ml-10">
                                        <IoTicketOutline/>
                                        <p className="font-serif ml-4">{event.available_tickets} available</p>
                                    </div>
                                    <div className="flex justify-between ml-10 p-2">
                                        <button  onClick={()=>handleMinusQuantity(event.Id)}  className=" hover:bg-white cursor-pointer border-2  w-6 rounded-full">-</button>
                                        <p>{event.quantity}</p>
                                        <button onClick={()=>handleAddQuantity(event.Id)} className="hover:bg-white cursor-pointer border-2  w-6 rounded-full">+</button>
                                    </div>
                                </div>
                                <div className="flex flex-col ml-10 mt-1">            
                                    <p className="rounded-lg text-black">{event.price}$</p>
                                    <button onClick={()=> handleRemoveTicket(event.Id)} className="text-red-500 text-xl hover:bg-red-200 rounded-full p-2 cursor-pointer flex justify-center mt-2"><MdDeleteOutline /></button>
                                </div>

                            </div>
                        )
                    })}
                </div>
                <button onClick={handleAddingOrder} className="bg-blue-800 hover:bg-blue-400 text-white font-bold text-center p-4 rounded-lg w-100">PASSE Commande</button>
            </div>
        </div>
    )
}



export default Card