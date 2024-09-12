import React from 'react'
import HomeSideBar from '../components/HomeSideBar'
import ExpensesContent from '../components/expensesContent/ExpensesContent'
const CategoriesPage = () => {
  return (
    <div className="flex">
      <HomeSideBar />
      <ExpensesContent />
    </div>
  )
}
export default CategoriesPage
