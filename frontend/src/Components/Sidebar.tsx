
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { useEffect, useState } from "react";
import axios from "axios";

function Sidebar({setFilterEvents}){

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

    const getFilterEvents = (query, allEvents)=>{
        if(!query){
            return allEvents;
        }
        return allEvents.filter((event)=> event.name.includes(query))
    }



    setFilterEvents(getFilterEvents(query, allEvents))



    const navigate = useNavigate()

    return(
        <div className="bg-gray-100 flex h-30 p-6 items-center">
            <h1 className="text-blue-700 font-mono mr-4 md:mr-14">TRICKER</h1>
            <div className="h-full  md:w-140 flex bg-white border-1 border-gray-400 items-center rounded-lg p-6">
                <CiSearch />
                <input onChange={(e)=> setQuery(e.target.value)} placeholder="Search for events" className="ml-1 md:ml-4 md:w-100 h-10 w-full" type="text"/>
            </div>
            <button onClick={()=> navigate("/Card")} className="bg-gray-300 md:p-4 hover:bg-blue-200 rounded-lg ml-2 md:ml-6">My Card</button>
            <button onClick={()=> navigate("/Acceuil")} className="bg-gray-300 md:p-4 hover:bg-blue-200 rounded-lg ml-2 md:ml-6">Events</button>
        </div>
    )
}



export default Sidebar