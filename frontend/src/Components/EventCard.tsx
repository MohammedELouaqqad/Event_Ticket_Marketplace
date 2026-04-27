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

        // Object.assign(cardTickets || {},obj || {})

        console.log(cardTickets)
  
        localStorage.setItem('events',JSON.stringify(cardTickets))
    }


   console.log(cardTickets)

    
    return(
        <div key={oneEvent.id} className="h-full rounded-lg flex flex-col p-4 w-80 border-1 border-gray-300">
            <img src="../../public/favicon.svg" className="w-full"/>
            <div className="flex justify-between mt-6 items-center">
                <h2 className="text-xl">{oneEvent.name}</h2>
                <p className="rounded-lg p-4 bg-green-200 text-green-900">{oneEvent.price}$</p>
            </div>
            <div className="flex items-center mt-6">
                <CiLocationOn/>
                <p className="font-serif ml-4">{oneEvent.location}</p>
            </div>
            <div className="flex items-center mt-2">
                <CiCalendarDate/>
                <p className="font-serif ml-4">{oneEvent.date}</p>
            </div>
            <div className="flex items-center mt-2 mb-4">
                <IoTicketOutline/>
                <p className="font-serif ml-4">{oneEvent.available_tickets} available</p>
            </div>
            <p>{oneEvent.description}</p>
            <button onClick={()=>addingToCart(oneEvent)} className="p-4 bg-blue-600 rounded-lg text-white mt-8 hover:bg-blue-400">Add to Card</button>
        </div>
    )
}

export default EventCard;