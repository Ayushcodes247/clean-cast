import React from "react";
import { Routes , Route , useNavigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import UserAuthentication from "./Components/UserAuthentication/User.authentication";
import Home from "./Components/Home/Home";
import FacebookRedirect from "./Components/Facebook/Facebook";
import Register from "./Components/Register/Register";

const App = () => {
 return <>
 <Routes>
    <Route path="/" element={<Login/>}/>
    <Route path="/oauth/facebook/callback" element={<FacebookRedirect/>}/>
    <Route path="/users/register" element={<Register/>}/>
    <Route path="/home" element={<UserAuthentication>
      <Home/>
    </UserAuthentication>}/>
 </Routes>
 </>
};

export default App;
