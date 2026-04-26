import axios from "axios";
import { useState } from "react";



function AddingEvent(){

    const [event, setEvent] = useState({name:"",description:"",date:"",price:0,available_tickets:"",location:"",fileName:""})

    var token=localStorage.getItem('token')

    function createEvent(e){
        e.preventDefault();
    
        // const fetchAddingImage = async()=>{
        //     try{
        //         const file = new FormData();
        //         const image = formData.fileName;
                
        //         file.append('image', image)
                
        //         const response = await axios.post("http://localhost:8085/cloudinary/upload",file
        //             // ,{
        //             // headers: {
        //             //     "Content-Type": "multipart/form-data",
        //             // },
        //             // }
        //         );
        //         console.log(response)
        //     }catch(error){
        //         console.log(error);
        //     }
        // }
        // await fetchAddingImage()
        console.log(event.fileName)
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
                    //setShowAddingPage(false)
                }
                console.log(response)
            }catch(error){
                console.log(error)
            }
            
        }
        fetchAddingEvent()
    }

    return(
        <div className="md:w-200 p-20">
            <form onSubmit={createEvent} className="border-1 border-gray-200 rounded pb-10">
                <div className="bg-blue-700 text-white p-10 h-30">
                    <h1>Create New Event</h1>
                    <p> List your event and start selling tickets</p>
                </div>
                <div className="mt-20 flex flex-col mt-6 pl-10 pr-10 pb-6">
                    <label>Event Name</label>
                    <input onChange={(e)=> setEvent({...event,name:e.target.value})}  className="bg-gray-100 rounded-lg p-3" />
                </div>  
                    <div className="flex flex-col pl-10 pr-10 pb-6">
                    <label>Description</label>
                    <input onChange={(e)=> setEvent({...event,description:e.target.value})} className="bg-gray-100 rounded-lg p-3" />
                </div>  
                <div className="flex flex-col pl-10 pr-10 pb-6">
                    <label>Event Date</label>
                    <input onChange={(e)=> setEvent({...event,date:e.target.value})} type='date' className="bg-gray-100 rounded-lg p-3" />
                </div>
                <div className="flex flex-col pl-10 pr-10 pb-6">
                    <label>Price par Ticket</label>
                    <input onChange={(e)=> setEvent({...event,price:e.target.value})} type='number' className="bg-gray-100 rounded-lg p-3" />
                </div>  
                <div className="flex flex-col pl-10 pr-10 pb-6">
                    <label>Total Tickets Availables</label>
                    <input onChange={(e)=> setEvent({...event,available_tickets:e.target.value})} type='number' className="bg-gray-100 rounded-lg p-3" />
                </div> 
                <div className="flex flex-col pl-10 pr-10 pb-6">
                    <label>Location</label>
                    <input onChange={(e)=> setEvent({...event,location:e.target.value})} className="bg-gray-100 rounded-lg p-3" />
                </div>  
                <div className="flex flex-col pl-10 pr-10 pb-6">
                    <label>Image de l'event</label>
                    <input onChange={(e)=> setEvent({...event,fileName:e.target.files[0]})} type='file' className="rounded-lg p-3" />
                </div>  
                <button className="text-white cursor-pointer bg-blue-700 rounded h-12 ml-10 mr-10 w-full">Create Event</button>
            </form>

        </div>
    )
}

export default AddingEvent;