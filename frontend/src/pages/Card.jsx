import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar"
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { IoTicketOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";



function Card(){


    const [tickets, setTickets] = useState([])

    var obj = {"quantity":0}

    useEffect(()=>{
        setTickets(JSON.parse(localStorage.getItem('events')))
    },[])

    tickets.map((ticket)=>{
        Object.assign(ticket,obj)
    })    

     console.log(tickets)


    function handleAddQuantity(event){
        tickets.map((ticket)=>
            JSON.stringify(event) === JSON.stringify(event) 
            ?
                setTickets([...tickets,{...ticket,quantity: 5}])
            :
            event
        )
    }

    return(
        <div>
            <Sidebar/>
            <div className=" p-20">
                <h1 className="font-mono">Your Card</h1>
                <div className="mt-20 grid lg:grid-rows-3 gap-y-10 sm:grid-rows-2 gap-2">
                    {tickets && tickets.map((event)=>{
                        return(
                            <div className="bg-gray-200 w-200 h-full rounded-lg flex p-4 w-80 border-1 border-gray-300">
                                <img src="../../public/favicon.svg" className="w-30"/>
                                <div>
                                    <h2 className="text-xl ml-10">{event.name}</h2>
                                    <div className="flex items-center mt-1 ml-10">
                                        <CiLocationOn/>
                                        <p className="font-serif ml-4">USA</p>
                                    </div>
                                    <div className="flex items-center mb-4 ml-10">
                                        <IoTicketOutline/>
                                        <p className="font-serif ml-4">{event.available_tickets} available</p>
                                    </div>
                                    <div className="flex justify-between ml-10 p-2">
                                        <button className=" hover:bg-white cursor-pointer border-2  w-6 rounded-full">-</button>
                                        <p>{event.quantity}</p>
                                        <button onClick={()=>handleAddQuantity(event)} className="hover:bg-white cursor-pointer border-2  w-6 rounded-full">+</button>
                                    </div>
                                </div>
                                <div className="flex flex-col ml-10 mt-1">            
                                    <p className="rounded-lg text-black">{event.price}$</p>
                                    <button className="text-red-500 text-xl hover:bg-red-200 rounded-full p-2 cursor-pointer flex justify-center mt-2"><MdDeleteOutline /></button>
                                </div>

                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}



export default Card