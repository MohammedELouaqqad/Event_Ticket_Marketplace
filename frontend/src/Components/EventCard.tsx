import { useState } from "react"
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { IoTicketOutline } from "react-icons/io5";

function EventCard(name){

    const [cardTickets, setCardTickets] = useState({})
    const [event, setEvent] = useState(name.name)


//    var obj = {quantity:0}


    function addingToCart(eventToCard){

        
        setCardTickets(eventToCard)

        // Object.assign(cardTickets || {},obj || {})

        console.log(cardTickets)
  
        localStorage.setItem('events',JSON.stringify(cardTickets))
    }


   console.log(cardTickets)

    
    return(
        <div key={event.id} className="h-full rounded-lg flex flex-col p-4 w-80 border-1 border-gray-300">
            <img src="../../public/favicon.svg" className="w-full"/>
            <div className="flex justify-between mt-6 items-center">
                <h2 className="text-xl">{event.name}</h2>
                <p className="rounded-lg p-4 bg-green-200 text-green-900">{event.price}$</p>
            </div>
            <div className="flex items-center mt-6">
                <CiLocationOn/>
                <p className="font-serif ml-4">{event.location}</p>
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
            <button onClick={()=>addingToCart(event)} className="p-4 bg-blue-600 rounded-lg text-white mt-8 hover:bg-blue-400">Add to Card</button>
        </div>
    )
}

export default EventCard;