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
const App = () => {
  return (
    <div className="app-container ">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginPage />}></Route>
          <Route path="/home" element={<HomePage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App
