import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("CCToken");

  useEffect(() => {
    const logoutUser = async () => {
      console.log(token);
      try {
        const { data, status } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}users/logout`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (status === 200 && data.message) {
          localStorage.removeItem("CCToken");
          localStorage.removeItem("CCUser");

          alert(data.message);
          navigate("/");
        } else {
          alert("Error while loging out.");
        }
      } catch (error) {
        console.error(
          "Error while logging out:",
          error.response?.status,
          error
        );
      }
    };

    logoutUser();
  }, [navigate]);

  return <div>Logging out..</div>;
};

export default Logout;
