import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from "framer-motion";
import { CiHome, CiSearch, CiUser, CiVideoOn } from "react-icons/ci";
import { LuMessageCircleDashed } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";
import { RiMenu5Line } from "react-icons/ri";

const Navigation = () => {
  return (
    <>
      {/* ---------- Desktop Sidebar (hidden on mobile) ---------- */}
      <div className='container hidden md:flex w-[18%] lg:w-[15%] h-screen border-r nav flex-col bg-black/30 backdrop-blur-xl'>
        <div className='py-7 pt-9 pl-8 text-left'>
          <h1 className='brand text-4xl cursor-pointer text-white'>CleanCast</h1>
        </div>

        <div className='py-6 px-5'>

          {/* Home */}
          <motion.div
            whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            className="w-full rounded-lg"
          >
            <Link to="/home" className='text-white text-xl flex gap-3 my-3 items-center px-3 py-3'>
              <CiHome className='text-3xl' />
              <h3>Home</h3>
            </Link>
          </motion.div>

          {/* Search */}
          <motion.div
            whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            className="w-full rounded-lg"
          >
            <Link to="/search" className='text-white text-xl gap-3 my-3 flex items-center px-3 py-3'>
              <CiSearch className='text-3xl' />
              <h3>Search</h3>
            </Link>
          </motion.div>

          {/* Reels */}
          <motion.div
            whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            className="w-full rounded-lg"
          >
            <Link to="/reels" className='text-white text-xl gap-3 my-3 flex items-center px-3 py-3'>
              <CiVideoOn className='text-3xl' />
              <h3>Reels</h3>
            </Link>
          </motion.div>

          {/* Chats */}
          <motion.div
            whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            className="w-full rounded-lg"
          >
            <Link to="/chats" className='text-white text-xl gap-3 my-3 flex items-center px-3 py-3'>
              <LuMessageCircleDashed className='text-3xl' />
              <h3>Chats</h3>
            </Link>
          </motion.div>

          {/* Profile */}
          <motion.div
            whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            className="w-full rounded-lg"
          >
            <Link to="/user/profile" className='text-white text-xl gap-3 my-3 flex items-center px-3 py-3'>
              <CiUser className='text-3xl' />
              <h3>Profile</h3>
            </Link>
          </motion.div>

          {/* Create */}
          <motion.div
            whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            className="w-full rounded-lg"
          >
            <Link to="/upload" className='text-white text-xl gap-3 my-3 flex items-center px-3 py-3'>
              <FiPlus className='text-3xl' />
              <h3>Create</h3>
            </Link>
          </motion.div>

        </div>

        {/* More */}
        <motion.div
          whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          className='flex text-white gap-4 items-center px-9 cursor-pointer py-7 mt-auto w-full rounded-lg'
        >
          <RiMenu5Line className='text-4xl' />
          <h3 className='text-xl'>More</h3>
        </motion.div>
      </div>

      {/* ---------- Mobile Bottom Navigation ---------- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t border-gray-700 py-2 z-50">
        <div className="flex justify-around items-center text-white text-3xl">

          <Link to="/home">
            <CiHome />
          </Link>

          <Link to="/search">
            <CiSearch />
          </Link>

          <Link to="/upload" className="p-2 rounded-full bg-white text-black text-3xl">
            <FiPlus />
          </Link>

          <Link to="/reels">
            <CiVideoOn />
          </Link>

          <Link to="/user/profile">
            <CiUser />
          </Link>

        </div>
      </div>
    </>
  )
}

export default Navigation
