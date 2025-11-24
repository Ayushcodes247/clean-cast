import React from "react";
import "./Login.css";
import video from "/video.mov";
import { Link } from "react-router-dom";

const Login = () => {
  const title = "CleanClean | Login Page";
  document.title = title;

  return (
    <div className="h-dvh main relative bg-[#dbd9d9] w-screen flex justify-between flex-col">
      <video
        src={video}
        className="object-cover absolute top-0 left-0 h-full w-full mx-auto"
        autoPlay
        loop
        muted
      />
      <div className="overlay container h-[85%] w-[90%] backdrop-blur-sm z-1 mx-auto my-auto border border-t-[#8e98a8ce] border-l-[#8e98a8c5] border-r-[#ffffffc0] border-b-[#ffffffc0] rounded-xl">
        <div className="headings ">
          <h2 className="text-white text-center px-10 pt-4 mt-2 text-4xl font-[dmmedium]">
            Welcome,
          </h2>
          <h3 className="text-white text-center px-10 py-2 text-xl tracking-wide font-[dmlight]">
            Glad to see you!
          </h3>
        </div>

        <div className="text-white px-2 py-3">
          <form action="" className="flex flex-col items-center mt-4">
            <input
              type="email"
              name=""
              placeholder="Enter email"
              className="inp px-12 py-3 rounded text-color font-[dmlight] outline-none font-light"
            />
            <input
              type="password"
              name=""
              placeholder="Enter password"
              className="inp px-12 py-3 rounded text-color font-[dmlight] outline-none mt-4 font-light"
            />
            <p className="text-white mt-4 text-center link font-[dmlight]">
              Don’t have an account?{" "}
              <Link to="/users/register" className="reg">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
