import React from 'react'

const SideBarItem = ({ text }) => {
  return (
    <li className="opcion-con-desplegable">
      <div className="flex items-center justify-between p-2 hover:bg-[#00ADA3]">
        <span>{text}</span>
      </div>
    </li>
  )
}

export default SideBarItem
