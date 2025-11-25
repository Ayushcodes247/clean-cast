import React from "react";
import { Routes , Route , useNavigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import UserAuthentication from "./Components/UserAuthentication/User.authentication";
import Home from "./Components/Home/Home";
import Loading from "./Components/Loading/Loading";

const App = () => {
 return <>
 <Routes>
   <Route path="/loading" element={<Loading/>}/>
    <Route path="/" element={<Login/>}/>
    <Route path="/home" element={<UserAuthentication>
      <Home/>
    </UserAuthentication>}/>
 </Routes>
 </>
};

export default App;
