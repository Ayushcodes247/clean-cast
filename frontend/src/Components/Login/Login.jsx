import React from 'react'
import "./Login.css"
import video from "/video.mov"

const Login = () => {

  const title = "CleanClean | Login Page";
  document.title = title;

  return (
    <div className='h-dvh main relative bg-[#dbd9d9] w-screen flex justify-between flex-col'>
      <video src={video} className='object-cover absolute top-0 left-0 h-full w-full mx-auto' autoPlay loop muted/>
      <div className='overlay container h-[80%] w-[90%] backdrop-blur-sm z-1 mx-auto my-auto border border-t-[#8e98a8ce] border-l-[#8e98a8c5] border-r-[#ffffffc0] border-b-[#ffffffc0] rounded-xl'>
        
      </div>
    </div>
  )
}

export default Login