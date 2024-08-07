import React from 'react'
// here i need to give access to the app only if the user is loggedIn
const Header = () => {
  return (
    <nav className="bg-[#003248] p-4 flex items-center justify-between shadow-[0px_4px_4px_0px_#000000] z-20">
      <div>
        <h1 className="text-[#AFB300] text-xl font-semibold ml-4">
          <a href="/home">MARKET PRO </a>
        </h1>
      </div>
    </nav>
  )
}

export default Header
