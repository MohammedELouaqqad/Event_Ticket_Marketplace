import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar"
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { IoTicketOutline } from "react-icons/io5";
import axios from '../../node_modules/axios/lib/axios';



function Acceuil(){
    const [showAddingPage, setShowAddingPage] = useState(false)
    
    

    const [formData, setFormData] = useState({"name":"","description":"","date":"","price":0,"available_tickets":"","fileName":""})

    const [allEvents, setAllEvents] = useState([])

    const [cardTickets, setCardTickets] = useState([])





    localStorage.setItem('events',JSON.stringify(cardTickets))

    function AddingEvent(e){
        e.preventDefault();
        const fetchAddingEvent = async()=>{
            try{
                const response = await axios.post("http://localhost:8085/api/AddEvent",formData)
                if(response.status==200){
                    setShowAddingPage(false)
                }
                console.log(response)
            }catch(error){
                console.log(error)
            }
            
        }
        fetchAddingEvent()
    }

    useEffect(()=>{
        const fetchAllEvents = async()=>{
            try{
                const response = await axios.get("http://localhost:8085/api/AllEvents")
                if(response.status==200){
                    setAllEvents(response.data)
                }
                console.log(response)
            }catch(error){
                console.log(error)
            }
            
        }
        fetchAllEvents()
    },[])

    console.log(cardTickets)


    return(
        <div>
            <Sidebar/>
            {!showAddingPage ? 
                <div className="p-34">
                    <div className="flex justify-between ">
                        <div className="flex flex-col mb-20">
                            <h1 className="font-mono text-2xl">Upcoming Events</h1>
                            <p>Discover & book tickets for amazing events</p>
                        </div>
                        <button onClick={()=>setShowAddingPage(true)} className="cursor-pointer rounded-lg bg-purple-600 h-16 hover:bg-purple-400 md:p-4">ADD EVENT</button>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-y-10 sm:grid-cols-2 gap-2">
                        {allEvents.map((event)=>{
                            return(
                                <div className="h-full rounded-lg flex flex-col p-4 w-80 border-1 border-gray-300">
                                    <img src="../../public/favicon.svg" className="w-full"/>
                                    <div className="flex justify-between mt-6 items-center">
                                        <h2 className="text-xl">{event.name}</h2>
                                        <p className="rounded-lg p-4 bg-green-200 text-green-900">{event.price}$</p>
                                    </div>
                                    <div className="flex items-center mt-6">
                                        <CiLocationOn/>
                                        <p className="font-serif ml-4">USA</p>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <CiCalendarDate/>
                                        <p className="font-serif ml-4">{event.date}</p>
                                    </div>
                                    <div className="flex items-center mt-2 mb-4">
                                        <IoTicketOutline/>
                                        <p className="font-serif ml-4">{event.available_tickets} available</p>
                                    </div>
                                    <p>{event.description}</p>
                                    <button onClick={()=> setCardTickets([...cardTickets,event])} className="p-4 bg-blue-600 rounded-lg text-white mt-8 hover:bg-blue-400">Add to Card</button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            :
                <div className="md:w-200 p-20">
                    <form onSubmit={AddingEvent} className="border-1 border-gray-200 rounded pb-10">
                        <div className="bg-blue-700 text-white p-10 h-30">
                            <h1>Create New Event</h1>
                            <p> List your event and start selling tickets</p>
                        </div>
                        <div className="mt-20 flex flex-col mt-6 pl-10 pr-10 pb-6">
                            <label>Event Name</label>
                            <input onChange={(e)=> setFormData({...formData,name:e.target.value})}  className="bg-gray-100 rounded-lg p-3" />
                        </div>  
                            <div className="flex flex-col pl-10 pr-10 pb-6">
                            <label>Description</label>
                            <input onChange={(e)=> setFormData({...formData,description:e.target.value})} className="bg-gray-100 rounded-lg p-3" />
                        </div>  
                        <div className="flex flex-col pl-10 pr-10 pb-6">
                            <label>Event Date</label>
                            <input onChange={(e)=> setFormData({...formData,date:e.target.value})} type='date' className="bg-gray-100 rounded-lg p-3" />
                        </div>
                        <div className="flex flex-col pl-10 pr-10 pb-6">
                            <label>Price par Ticket</label>
                            <input onChange={(e)=> setFormData({...formData,price:e.target.value})} type='number' className="bg-gray-100 rounded-lg p-3" />
                        </div>  
                        <div className="flex flex-col pl-10 pr-10 pb-6">
                            <label>Total Tickets Availables</label>
                            <input onChange={(e)=> setFormData({...formData,available_tickets:e.target.value})} type='number' className="bg-gray-100 rounded-lg p-3" />
                        </div>  
                        <div className="flex flex-col pl-10 pr-10 pb-6">
                            <label>Image de l'event</label>
                            <input onChange={(e)=> setFormData({...formData,fileName:e.target.value})} type='file' className="rounded-lg p-3" />
                        </div>  
                        <button className="text-white cursor-pointer bg-blue-700 rounded h-12 ml-10 mr-10 w-full">Create Event</button>
                    </form>

                </div>
            }
        </div>   
    )
}



export default Acceuil;