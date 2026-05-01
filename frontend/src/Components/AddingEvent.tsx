import axios from "axios";
import { useState } from "react";
import { type Event } from "../types/index"


function AddingEvent(){



    const [event, setEvent] = useState<Event>({name:"",description:"",date:"",price:0,available_tickets:0,location:"",fileName:""})

    var token=localStorage.getItem('token')

    async function createEvent(e: React.ChangeEvent<HTMLFormElement>){
        e.preventDefault();
        const fetchAddingImage = async()=>{
            try{
                const file = new FormData();
                const image = event.fileName;
                
                file.append('image', image)
                
                const response = await axios.post("http://localhost:8085/api/cloudinary/upload",file
                    ,{
                        headers: {
                            "Authorization":`Bearer ${token}`
                    },
                    }
                );
                if(response.status===200){
                    setEvent({...event,fileName:response.data.url})
                }
                console.log(response)
            }catch(error){
                console.log(error);
            }
        }
        await fetchAddingImage()
        console.log(event)
        const fetchAddingEvent = async()=>{
            try{
                const response = await axios.post("http://localhost:8085/api/events",event,
                    {
                        headers:{
                            "Authorization":`Bearer ${token}`
                        }
                    }
                )
                if(response.status==200){
                    alert("Event Added with Success")
                }
                console.log(response)
            }catch(error){
                console.log(error)
            }
            
        }
        fetchAddingEvent()
    }

    return(
        <div className="w-full max-w-2xl mx-auto px-4">
            <form onSubmit={createEvent} className="w-full bg-white shadow-lg rounded-xl ">
                <div className="bg-indigo-600 py-8 px-10 ">
                    <h1>Create New Event</h1>
                    <p> List your event and start selling tickets</p>
                </div>
                <div className="flex flex-col mt-6 pl-10 pr-10 pb-6">
                    <label className="text-sm font-medium text-gray-700 mb-1 ">Event Name</label>
                    <input onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setEvent({...event,name:e.target.value})}  className="bg-gray-100 border border-gray-200 text-gray-900  rounded-lg p-3 w-full " />
                </div>  
                    <div className="flex flex-col pl-10 pr-10 pb-6">
                    <label className="text-sm font-medium text-gray-700 mb-1 ">Description</label>
                    <textarea onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=> setEvent({...event,description:e.target.value})} className="bg-gray-100 border border-gray-200 text-gray-900  rounded-lg p-3 w-full " />
                </div>  
                <div className="flex flex-col pl-10 pr-10 pb-6">
                    <label className="text-sm font-medium text-gray-700 mb-1 ">Event Date</label>
                    <input onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setEvent({...event,date:e.target.value})} type='date' className="bg-gray-100 border border-gray-200 text-gray-900  rounded-lg p-3 w-full " />
                </div>
                <div className="flex flex-col pl-10 pr-10 pb-6">
                    <label className="text-sm font-medium text-gray-700 mb-1 ">Price par Ticket</label>
                    <input onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setEvent({...event,price:e.target.value})} type='number' className="bg-gray-100 border border-gray-200 text-gray-900  rounded-lg p-3 w-full " />
                </div>  
                <div className="flex flex-col pl-10 pr-10 pb-6">
                    <label className="text-sm font-medium text-gray-700 mb-1 ">Total Tickets Availables</label>
                    <input onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setEvent({...event,available_tickets:e.target.value})} type='number' className="bg-gray-100 border border-gray-200 text-gray-900  rounded-lg p-3 w-full " />
                </div> 
                <div className="flex flex-col pl-10 pr-10 pb-6">
                    <label className="text-sm font-medium text-gray-700 mb-1 ">Location</label>
                    <input onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setEvent({...event,location:e.target.value})} className="bg-gray-100 border border-gray-200 text-gray-900  rounded-lg p-3 w-full " />
                </div>  
                <div className="flex flex-col pl-10 pr-10 pb-6">
                    <label className="text-sm font-medium text-gray-700 mb-1 ">Image de l'event</label>
                    <input onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setEvent({...event,fileName:e.target.files[0]})} type='file' className="rounded-lg p-3 w-full " />
                </div>  
                <button className="text-white cursor-pointer bg-indigo-600 hover:bg-indigo-500 rounded h-12 w-full ">Create Event</button>
            </form>

        </div>
    )
}

export default AddingEvent;