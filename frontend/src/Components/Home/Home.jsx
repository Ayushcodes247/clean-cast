import React from "react";
import Navigation from "../Navigation/Navigation";

const Home = () => {
   const title = "CleanCast | Home Page";
   document.title = title; 
  return <div className="h-screen w-screen flex  bg-black">
    <Navigation/>
    <div className="bg-amber-300 container mx-auto h-screen w-[40%]">

    </div>
  </div>;
};

export default Home;
