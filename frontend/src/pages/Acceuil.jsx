import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar"
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { IoTicketOutline } from "react-icons/io5";
import axios from '../../node_modules/axios/lib/axios';
import EventCard from "../Components/EventCard";
import AddingEvent from "../Components/AddingEvent";



function Acceuil(){
    
    const [showAddingPage, setShowAddingPage] = useState(false)    
    const [allEvents, setAllEvents] = useState([])

    var token = localStorage.getItem('token') 




    useEffect(()=>{
        const fetchAllEvents = async()=>{
            try{
                const response = await axios.get("http://localhost:8085/api/events",
                    {
                        headers:{
                            "Authorization":`Bearer ${token}`
                        }
                    }
                )
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
                        {allEvents && allEvents.map((event)=>{
                            return(
                                <EventCard key={event.id} name={event}/>
                            )
                        })}
                    </div>
                </div>
            :
                <AddingEvent />
            }
        </div>   
    )
}



export default Acceuil;