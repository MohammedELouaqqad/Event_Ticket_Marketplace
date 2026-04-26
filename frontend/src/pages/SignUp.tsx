



function SignUp(){
    return (
        <div className="flex items-center justify-center h-screen">
            <form className="p-10 bg-blue-400 w-full p-10 md:w-120 rounded-lg">
                <h1 className="text-center text-white text-2xl font-mono">SignUp</h1>
                <div className="flex flex-col mt-10">
                    <label>Username</label>
                    <input className="bg-gray-200 rounded-lg p-3" type='email' placeholder="example@gmail.com"/>
                </div>
                <div className="flex flex-col mt-10">
                    <label>Email</label>
                    <input className="bg-gray-200 rounded-lg p-3" type='email' placeholder="example@gmail.com"/>
                </div>
                <div className="flex flex-col mt-6">
                    <label>Password</label>
                    <input className="bg-gray-200 rounded-lg p-3" type='password' placeholder="*************"/>
                </div>   
                <button className="font-mono mt-10 bg-blue-800 text-white hover:bg-purple-800 w-full rounded-lg p-4">SignUp</button>             
                <a href="/" className="text-white mt-20">You have already an account?</a>
            </form>
        </div>
    )
}


export default SignUp;