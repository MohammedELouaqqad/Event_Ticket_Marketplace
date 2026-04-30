import { useContext, useEffect, useState } from "react";
import NavBar from "../Components/NavBar"
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { IoTicketOutline } from "react-icons/io5";
import axios from 'axios';
import EventCard from "../Components/EventCard";
import AddingEvent from "../Components/AddingEvent";
import {type Event} from "../types/index"
import { UserContext } from "../context/UserContext";
import { CiSearch } from "react-icons/ci";



function Events(){
    
    const [showAddingPage, setShowAddingPage] = useState(false)    


    var token = localStorage.getItem('token') 


    const [filterEvents, setFilterEvents] = useState<Event[]>([])



    const context= useContext(UserContext)


    if(!context){
        return;
    }


    const {userConnected, setUserConnected}=context;  


        const [allEvents, setAllEvents] = useState([])

    const [query, setQuery] = useState("")


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



    type getFilterEventsProps={
        query: string,
        allEvents: Event[]
    }

    useEffect(()=>{
        const getFilterEvents = ({query, allEvents}: getFilterEventsProps)=>{
            if(!query){
                return allEvents;
            }
            return allEvents.filter((event : Event)=> event.name.includes(query))
        }



        setFilterEvents(getFilterEvents({ query, allEvents}))
    })



 

    return(
        <div>
            <NavBar/>
            {!showAddingPage ? 
                <div className="p-10 mt-6">
                    <div className="flex justify-between ">
                        <div className="flex flex-col mb-6">
                            <h1 className="font-mono text-2xl">Upcoming Events</h1>
                            <p>{userConnected?.name} Discover & book tickets for amazing events</p>
                        </div>
                        <button onClick={()=>setShowAddingPage(true)} className="cursor-pointer rounded-lg md:p-4 px-6 bg-indigo-600 text-white hover:bg-indigo-500">+ ADD EVENT</button>
                    </div>
                    <div className=" mt-6 h-full focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 flex bg-white border border-gray-400 items-center rounded-lg px-4 py-2">
                        <CiSearch className="text-gray-400 text-xl" />
                        <input onChange={(e)=> setQuery(e.target.value)} placeholder="Search for events" className="ml-1 md:ml-4 outline-none  h-10 w-full" type="text"/>
                    </div>

                    <div className="mt-6 grid lg:grid-cols-3 gap-y-10 sm:grid-cols-2 gap-2">
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



export default Events;