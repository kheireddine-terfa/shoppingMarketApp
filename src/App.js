import React from 'react'
import Header from './components/Header'
// import SideBar from './components/SideBar'
// import MainContent from './components/MainContent'
// const App = () => {
//   return (
//     <div className="app-container ">
//       <Header />
//       <div className="flex">
//         <SideBar />
//         <MainContent />
//       </div>
//     </div>
//   )
// }
import LoginPage from './pages/LoginPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import SalesPage from './pages/SalesPage'
import SuppliersPage from './pages/SuppliersPage'
import StatisticsPage from './pages/StatisticsPage'
import CategoriesPage from './pages/CategoriesPage'
import OSalesPage from './pages/OSalesPage'
import ExpensesPage from './pages/ExpensesPage'
const App = () => {
  return (
    <div className=" app-container bg-zinc-100">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginPage />}></Route>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/sales" element={<SalesPage />}></Route>
          <Route path="/products" element={<ProductsPage />}></Route>
          <Route path="/product-sales" element={<OSalesPage />}></Route>
          <Route path="/suppliers" element={<SuppliersPage />}></Route>
          <Route path="/statistics" element={<StatisticsPage />}></Route>
          <Route path="/categories" element={<CategoriesPage />}></Route>
          <Route path="/expenses" element={<ExpensesPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App
