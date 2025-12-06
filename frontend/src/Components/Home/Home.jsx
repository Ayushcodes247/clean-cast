import React from "react";
import Navigation from "../Navigation/Navigation";

const Home = () => {
   const title = "CleanCast | Home Page";
   document.title = title; 
  return <div className="h-screen w-screen bg-black">
    <Navigation/>
  </div>;
};

export default Home;
