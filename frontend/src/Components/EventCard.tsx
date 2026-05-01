import { useState } from "react"
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { IoTicketOutline } from "react-icons/io5";
import {type Event} from "../types/index"


type EventCardProps={
    event: Event
}

function EventCard({event}: EventCardProps){

    const [cardTickets, setCardTickets] = useState({})
    const [oneEvent, setOneEvent] = useState(event)


//    var obj = {quantity:0}


    function addingToCart(eventToCard: Event){
        setCardTickets(eventToCard)
        console.log(cardTickets)
  
        localStorage.setItem('events',JSON.stringify(cardTickets))
    }


   console.log(cardTickets)

    
    return(
        <div key={oneEvent.id} className="h-full rounded-lg flex flex-col p-4 w-full border border-gray-300">
            <img src={oneEvent.fileName} loading="lazy" alt="No Image available" className="bg-gray-900 object-contain aspect-video w-full"/>
            <div className="flex justify-between mt-6 items-center">
                <h2 className="text-xl">{oneEvent.name}</h2>
                <p className="rounded-lg p-4 bg-green-200 text-green-900 text-sm font-bold">{oneEvent.price}$</p>
            </div>
            <div className="flex items-center mt-6">
                <CiLocationOn className="text-indigo-400"/>
                <p className="font-serif ml-4">{oneEvent.location}</p>
            </div>
            <div className="flex items-center mt-2">
                <CiCalendarDate className="text-indigo-400"/>
                <p className="font-serif ml-4">{oneEvent.date}</p>
            </div>
            <div className="flex items-center mt-2 mb-4">
                <IoTicketOutline className="text-indigo-400"/>
                <p className="font-serif ml-4">{oneEvent.available_tickets} available</p>
            </div>
            <p>{oneEvent.description}</p>
            <button onClick={()=>addingToCart(oneEvent)} className="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white mt-auto ">Add to Card</button>
        </div>
    )
}

export default EventCard;