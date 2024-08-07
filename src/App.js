import React from 'react'
import Header from './components/Header'
import SideBar from './components/SideBar'
import MainContent from './components/MainContent'
const App = () => {
  return (
    <div className="app-container ">
      <Header />
      <div className="flex">
        <SideBar />
        <MainContent />
      </div>
    </div>
  )
}

export default App
