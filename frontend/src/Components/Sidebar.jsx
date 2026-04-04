
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";



function Sidebar(){

    const navigate = useNavigate()

    return(
        <div className="bg-gray-100 flex h-20 p-6 items-center">
            <h1 className="text-blue-700 font-mono mr-4 md:mr-14">TRICKER</h1>
            <div className="md:w-140 h-full flex bg-white border-1 border-gray-400 items-center rounded-lg p-6">
                <CiSearch />
                <input placeholder="Search for events" className="ml-1 md:ml-4 md:w-100"/>
                <button className="hover:bg-blue-300 bg-blue-400 text-white rounded-lg p-1 md:p-2 md:w-20">Search</button>
            </div>
            <button onClick={()=> navigate("/Card")} className="bg-gray-300 md:p-4 hover:bg-blue-200 rounded-lg ml-2 md:ml-6">My Card</button>
        </div>
    )
}



export default Sidebar