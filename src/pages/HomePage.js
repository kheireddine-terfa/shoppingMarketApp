import React from 'react'
import HomeSideBar from '../components/HomeSideBar'
import HomeMainContent from '../components/HomeMainContent'
const HomePage = () => {
  return (
    <div className="flex">
      <HomeSideBar />
      <HomeMainContent />
    </div>
  )
}
export default HomePage
