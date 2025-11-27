import React from 'react'
import video from "/video.mov"
import "./register.css"

const Register = () => {
  return (
    <div className='main h-screen w-screen flex flex-col relative'>
        <video src={video}   className="object-cover absolute top-0 left-0 h-full w-full"
        autoPlay
        loop
        muted></video>
        <div className='overlay container bg-amber-300 z-10 h-[90%] w-[40%]  mx-auto my-auto'>

        </div>
    </div>
  )
}

export default Register