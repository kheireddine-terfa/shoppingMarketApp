import React from 'react'
// import SideBarItem from './SideBarItem'

const Sidebar = () => {
  return (
    <aside className="bg-[url('../images/main_pic.jpg')] bg-no-repeat bg-cover   text-white w-[65%] h-screen z-0 flex ">
      <div className="my-auto ml-[0%] bg-[#003248e3] p-10 pt-[30%] opacity-80 h-[100%] animate-slide-in-left">
        <h2 className="text-4xl  font-bold text-[#AFB300] animate-bounce">
          MARKET PRO!
        </h2>
        <p className="max-w-xl mt-3  text-2xl text-gray-300">
          The Easiest Way To Manage Your Market
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
