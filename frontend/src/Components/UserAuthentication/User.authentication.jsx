import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const UserAuthentication = ({ children }) => {
  const token = localStorage.getItem("CCToken") || null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.login);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}users/profile`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 && response.data.user) {
          const { password, version, ...safeUser } = response.data.user;

          dispatch({
            type: "USER_PROFILE_SUCCESS",
            payload: { user: safeUser, token },
          });

          localStorage.setItem("CCUser", JSON.stringify(safeUser));
          localStorage.setItem("CCToken", token);
        }
      } catch (err) {
        console.error("Profile fetch failed:", err.message);
        localStorage.removeItem("CCToken");
        localStorage.removeItem("CCUser");
        navigate("/");
      }
    };

    if (!user) fetchProfile();
  }, [token, user, navigate, dispatch]);

  if(loading) return <div>Loading...</div>;

  return <div>{children}</div>;
};

export default UserAuthentication;
