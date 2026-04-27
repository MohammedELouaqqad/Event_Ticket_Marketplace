import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar"
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { IoTicketOutline } from "react-icons/io5";
import axios from 'axios';
import EventCard from "../Components/EventCard";
import AddingEvent from "../Components/AddingEvent";
import {type Event} from "../types/index"


function Acceuil(){
    
    const [showAddingPage, setShowAddingPage] = useState(false)    


    var token = localStorage.getItem('token') 


    const [filterEvents, setFilterEvents] = useState<Event[]>([])


    return(
        <div>
            <Sidebar setFilterEvents={setFilterEvents}/>
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
                        {filterEvents && filterEvents.map((event: Event)=>{
                            return(
                                <EventCard key={event.id} event={event}/>
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