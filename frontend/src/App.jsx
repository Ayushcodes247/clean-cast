import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import UserAuthentication from "./Components/UserAuthentication/User.authentication";
import Home from "./Components/Home/Home";
import Register from "./Components/Register/Register";
import Logout from "./Components/Logout/Logout";
import Profile from "./Components/Profile/Profile";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("CCToken");
    const expiry = localStorage.getItem("CCTokenExpirey");

    if (!token || !expiry) return;

    const timeLeft = Number(expiry) - new Date().getTime();

    if (timeLeft <= 0) {
      localStorage.removeItem("CCUser");
      localStorage.removeItem("CCToken");
      localStorage.removeItem("CCTokenExpirey");
      navigate("/");
    } else {
      const timeout = setTimeout(() => {
        localStorage.removeItem("CCUser");
        localStorage.removeItem("CCToken");
        localStorage.removeItem("CCTokenExpirey");
        navigate("/");
      }, timeLeft);

      return () => clearTimeout(timeout);
    }
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <UserAuthentication>
              <Home />
            </UserAuthentication>
          }
        />
        <Route
          path="/users/logout"
          element={
            <UserAuthentication>
              <Logout />
            </UserAuthentication>
          }
        />
        <Route path="/users/profile" element={
          <UserAuthentication>
            <Profile/>
          </UserAuthentication>
        }/>
      </Routes>
    </>
  );
};

export default App;
