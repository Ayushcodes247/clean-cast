// Login.jsx
import React, { useState } from "react";
import "./Login.css";
import video from "/video.mov";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUserAction } from "../../actions/login.action";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import FacebookLogin from "@greatsumini/react-facebook-login"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessPop, setShowSuccessPop] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  document.title = "CleanClean | Login Page";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur", defaultValues: { email: "", password: "" } });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      const response = await dispatch(
        loginUserAction({ email: data.email, password: data.password })
      );

      const msg = response?.message || "Logged in";
      setSuccessMsg(msg);

      if (response?.token) {
        setShowSuccessPop(true);

        setTimeout(() => {
          setShowSuccessPop(false);
          setTimeout(() => {
            navigate("/home");
          }, 250);
        }, 1100);
      } else {
        console.error("User Login Failed.");
      }

      reset();
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("User Login Failed:", error.message || error);
      alert(`User Login Failed: ${error.message || error}`);
    }
  };

  const popVariants = {
    hidden: { scale: 0.2, opacity: 0 },
    visible: {
      scale: [0.8, 1.12, 0.96, 1],
      opacity: 1,
      transition: { duration: 0.9, times: [0, 0.5, 0.8, 1], ease: "easeOut" },
    },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.18 } },
  };

  const faceBookLoginHandler = (response) => {
    if (response?.status === "unknown") {
        console.error('Sorry!', 'Something went wrong with facebook Login.');
     return;
    }
    console.log(response);
  }
  return (
    <div className="h-dvh main relative bg-[#dbd9d9] w-screen flex flex-col justify-between">
      <video
        src={video}
        className="object-cover absolute top-0 left-0 h-full w-full"
        autoPlay
        loop
        muted
      />

      <div
        className="
        overlay container 
        backdrop-blur-sm z-10
        mx-auto my-auto
        border border-t-[#8e98a8ce] border-l-[#8e98a8c5] border-r-[#ffffffc0] border-b-[#ffffffc0]
        rounded-xl 
        w-[92%] max-w-md 
        sm:max-w-lg 
        md:max-w-xl 
        lg:max-w-lg 
        xl:max-w-md
        px-4 py-6
      "
      >
        <div className="headings">
          <h2 className="text-white text-center text-3xl sm:text-4xl font-[dmmedium]">
            Welcome,
          </h2>
          <h3 className="text-white text-center mt-1 text-lg sm:text-xl font-[dmlight]">
            Glad to see you!
          </h3>
        </div>

        <div className="text-white px-2 py-4">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col items-center w-full mt-4"
          >
            <input
              type="email"
              placeholder="Enter email"
              className="inp w-full sm:w-4/5 px-6 py-3 rounded outline-none font-[dmlight] text-white"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Invalid email format",
                },
              })}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}

            <input
              type="password"
              placeholder="Enter password"
              className="inp w-full sm:w-4/5 px-6 py-3 rounded outline-none mt-4 font-[dmlight] text-white"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Min 8 characters" },
              })}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}

            <p className="text-white mt-4 text-center font-[dmlight]">
              Don’t have an account?{" "}
              <Link to="/users/register" className="reg underline">
                Register
              </Link>
            </p>

            <button
              type="submit"
              className="mt-5 btn cursor-pointer bg-white text-black font-semibold py-3 w-full sm:w-4/5 rounded-xl transition"
            >
              Login
            </button>
          </form>

          <div className="flex items-center gap-2 mt-6 mb-4 px-4 sm:px-10">
            <hr className="flex-grow border-black" />
            <span className="text-black font-[dmlight]">OR</span>
            <hr className="flex-grow border-black" />
          </div>

          <div className="flex justify-center">
            {/* <button
              onClick={faceBookLoginHandler}
              className="btn-2 bg-blue-600 text-white rounded-lg text-xl px-10 py-3 font-[dmlight]"
            >
              Facebook
            </button> */}
            <FacebookLogin appId={import.meta.env.VITE_FB_APP_ID} onSuccess={(response) => {
              console.log("Login success!", response);
            }} onFail={(error) => {
              console.error("Login Failed!", error);
            }} onProfileSuccess={(response) => {
              console.log("Get profile Success!", response)
            }} className="btn-2 bg-blue-600 text-white rounded-lg text-xl px-10 py-3 font-[dmlight]"/>
          </div>
          {/*  */}
          {/* Success Pop (Framer Motion) */}
          <AnimatePresence>
            {showSuccessPop && (
              <motion.div
                className="fixed left-1/2 top-24 z-50 -translate-x-1/2"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={popVariants}
                style={{ pointerEvents: "none" }}
              >
                <div className="flex items-center gap-3 bg-white rounded-full px-5 py-2 shadow-xl">
                  {/* you can replace emoji with an icon */}
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-700 font-bold">
                    ✓
                  </div>
                  <div className="text-black font-medium">{successMsg}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;
