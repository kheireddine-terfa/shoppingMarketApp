import React from 'react'
import HomeSideBar from '../components/HomeSideBar'
import StatisticsContent from '../components/statisticsContent/statisticsContent';

const StatisticsPage = () => {
  return (
    <div className="flex">
      <HomeSideBar />
      <StatisticsContent />
    </div>
  )
}
export default StatisticsPage;
