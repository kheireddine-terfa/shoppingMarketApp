import React from 'react'
import HomeSideBar from '../components/HomeSideBar'
import UsersContent from '../components/usersContent/UsersContent'

const UsersPage = () => {
  return (
    <div className="flex">
      <HomeSideBar />
      <UsersContent />
    </div>
  )
}
export default UsersPage
