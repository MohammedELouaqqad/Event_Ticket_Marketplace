import { useState } from "react";
import Sidebar from "../Components/Sidebar"
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { IoTicketOutline } from "react-icons/io5";



function Acceuil(){
    const [showAddingPage, setShowAddingPage] = useState(false)
    return(
        <div>
            <Sidebar/>
            {showAddingPage ? 
                <div className="p-34">
                    <div className="flex justify-between ">
                        <div className="flex flex-col mb-20">
                            <h1 className="font-mono text-2xl">Upcoming Events</h1>
                            <p>Discover & book tickets for amazing events</p>
                        </div>
                        <button className="rounded-lg bg-purple-400 h-16 hover:bg-purple-300 md:p-4">ADD EVENT</button>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-y-10 sm:grid-cols-2 gap-2">
                        <div className="h-full rounded-lg flex flex-col p-4 w-80 border-1 border-gray-300">
                            <img src="../../public/favicon.svg" className="w-full"/>
                            <div className="flex justify-between mt-6 items-center">
                                <h2 className="text-xl">Enrique Iglesas Concert</h2>
                                <p className="rounded-lg p-4 bg-green-200 text-green-900">40$</p>
                            </div>
                            <div className="flex items-center mt-6">
                                <CiLocationOn/>
                                <p className="font-serif ml-4">USA</p>
                            </div>
                            <div className="flex items-center mt-2">
                                <CiCalendarDate/>
                                <p className="font-serif ml-4">01/12/2024</p>
                            </div>
                            <div className="flex items-center mt-2 mb-4">
                                <IoTicketOutline/>
                                <p className="font-serif ml-4">1/1 available</p>
                            </div>
                            <p>frffff rfffffffffffj frr rfc jddkkd keke</p>
                            <button className="p-4 bg-blue-600 rounded-lg text-white mt-8 hover:bg-blue-400">Add to Card</button>
                        </div>
                    </div>
                </div>
            :
            <div className="md:w-200 p-20">
                <form className="border-1 border-gray-200 rounded pb-10">
                    <div className="bg-blue-700 text-white p-10 h-30">
                        <h1>Create New Event</h1>
                        <p> List your event and start selling tickets</p>
                    </div>
                    <div className="mt-20 flex flex-col mt-6 pl-10 pr-10 pb-6">
                        <label>Event Name</label>
                        <input className="bg-gray-100 rounded-lg p-3" />
                    </div>  
                        <div className="flex flex-col pl-10 pr-10 pb-6">
                        <label>Description</label>
                        <input className="bg-gray-100 rounded-lg p-3" />
                    </div>  
                    <div className="flex flex-col pl-10 pr-10 pb-6">
                        <label>Event Date</label>
                        <input type='date' className="bg-gray-100 rounded-lg p-3" />
                    </div>
                    <div className="flex flex-col pl-10 pr-10 pb-6">
                        <label>Piece par Ticket</label>
                        <input type='number' className="bg-gray-100 rounded-lg p-3" />
                    </div>  
                    <div className="flex flex-col pl-10 pr-10 pb-6">
                        <label>Total Tickets Availables</label>
                        <input type='number' className="bg-gray-100 rounded-lg p-3" />
                    </div>  
                    <div className="flex flex-col pl-10 pr-10 pb-6">
                        <label>Image de l'event</label>
                        <input type='file' className="rounded-lg p-3" />
                    </div>  
                    <button className="text-white cursor-pointer bg-blue-700 rounded h-12 ml-10 mr-10 w-full">Create Event</button>
                </form>

            </div>

            }
        </div>   
    )
}



export default Acceuil;