import React from "react";
import video from "/video.mov";
import "./register.css";

const Register = () => {
  return (
    <div className="main min-h-screen w-screen flex flex-col relative">
      <video
        src={video}
        className="object-cover absolute top-0 left-0 h-full w-full"
        autoPlay
        loop
        muted
      ></video>

      <div
        className="
          overlay container 
          backdrop-blur-sm z-10
          mx-auto my-auto
          border border-t-[#8e98a8ce] border-l-[#8e98a8c5] border-r-[#ffffffc0] border-b-[#ffffffc0]
          rounded-xl 
          w-[92%] 
          max-w-md 
          sm:max-w-lg 
          md:max-w-xl 
          lg:max-w-lg 
          xl:max-w-md
          px-4 py-6
          relative
        "
      >
        <div className="headings">
          <h2 className="text-white text-center text-3xl sm:text-4xl font-[dmmedium]">
            Register
          </h2>
          <h3 className="text-white text-center mt-1 text-lg sm:text-xl font-[dmlight]">
            And start connecting securly
          </h3>
        </div>

        <div className="text-white px-2 py-4">
          <form className="flex flex-col items-center w-full mt-4 gap-4">
            <input
              type="text"
              className="inp w-full sm:w-4/5 px-6 py-3 rounded outline-none font-[dmlight] text-white"
              placeholder="Enter username."
            />

            <input
              type="email"
              className="inp w-full sm:w-4/5 px-6 py-3 rounded outline-none font-[dmlight] text-white"
              placeholder="Enter email."
            />

            <input
              type="password"
              className="inp w-full sm:w-4/5 px-6 py-3 rounded outline-none font-[dmlight] text-white"
              placeholder="Enter password."
            />

            <div className="flex flex-col gap-4 w-full items-center">
              {/* Gender */}
              <div className="inp w-full sm:w-4/5 px-6 py-3 rounded outline-none font-[dmlight] text-white flex flex-col gap-2">
                <label htmlFor="gender">Select Gender:</label>
                <select
                  id="gender"
                  className="bg-transparent border border-white/30 rounded px-2 py-2 focus:outline-none"
                >
                  <option value="male" className="text-black">
                    Male
                  </option>
                  <option value="female" className="text-black">
                    Female
                  </option>
                </select>
              </div>

              {/* Account Type */}
              <div className="inp w-full sm:w-4/5 px-6 py-3 rounded outline-none font-[dmlight] text-white flex flex-col gap-2">
                <label htmlFor="accountType">Select Account Type:</label>
                <select
                  id="accountType"
                  className="bg-transparent border border-white/30 rounded px-2 py-2 focus:outline-none"
                >
                  <option value="private" className="text-black">
                    Private
                  </option>
                  <option value="public" className="text-black">
                    Public
                  </option>
                </select>
              </div>
            </div>

            <input
              type="number"
              className="inp w-full sm:w-4/5 px-6 py-3 rounded outline-none font-[dmlight] text-white"
              placeholder="Enter age."
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
