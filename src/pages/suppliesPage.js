import React from 'react'
import HomeSideBar from '../components/HomeSideBar'
import SuppliesContent from '../components/suppliesContent/suppliesContent'

const SuppliesPage = () => {
  return (
    <div className="flex">
      <HomeSideBar />
      <SuppliesContent />
    </div>
  )
}
export default SuppliesPage;
