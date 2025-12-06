import React from "react";
import "./Profile.css";
import Navigation from "../Navigation/Navigation";

const Profile = () => {
  document.title = "CleanCast | Profile";

  return (
    <div className="h-screen w-screen main relative bg-[#0C1014]">
      <Navigation />
    </div>
  );
};

export default Profile;
