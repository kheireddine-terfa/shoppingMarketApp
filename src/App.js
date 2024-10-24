import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import SalesPage from './pages/SalesPage'
import SuppliersPage from './pages/SuppliersPage'
import StatisticsPage from './pages/StatisticsPage'
import CategoriesPage from './pages/CategoriesPage'
import OSalesPage from './pages/OSalesPage'
import ExpensesPage from './pages/ExpensesPage'
import RolesPage from './pages/RolesPage'
import SuppliesPage from './pages/suppliesPage'
import LogoutPage from './pages/LogoutPage'
import UsersPage from './pages/UsersPage'
const App = () => {
  // eslint-disable-next-line
  const [roleId, setRoleId] = useState(sessionStorage.getItem('roleId'))
  const [pages, setPages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const allRoutes = [
    { path: '/sales', element: <SalesPage />, name: 'new-sale' },
    { path: '/products', element: <ProductsPage />, name: 'products' },
    { path: '/product-sales', element: <OSalesPage />, name: 'sales' },
    { path: '/suppliers', element: <SuppliersPage />, name: 'suppliers' },
    { path: '/statistics', element: <StatisticsPage />, name: 'statistics' },
    { path: '/categories', element: <CategoriesPage />, name: 'categories' },
    { path: '/expenses', element: <ExpensesPage />, name: 'expenses' },
    { path: '/supplies', element: <SuppliesPage />, name: 'supplies' },
    { path: '/roles', element: <RolesPage />, name: 'roles' },
    { path: '/users', element: <UsersPage />, name: 'users' },
  ]
  useEffect(() => {
    if (!roleId) {
      // Redirect to login if roleId is not found (user not logged in)
      setIsLoading(false)
      return
    }

    const fetchPages = async () => {
      try {
        const token = sessionStorage.getItem('token')
        const response = await fetch(
          `http://localhost:3001/api/roles/${roleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token
            },
          },
        )
        const data = await response.json()
        setPages(data.pages) // Assuming API returns an object with `pages`
      } catch (error) {
        console.error('Failed to fetch pages:', error)
      } finally {
        setIsLoading(false) // Loading completed
      }
    }

    // Fetch pages initially and then every 1 hour
    fetchPages()
    const intervalId = setInterval(fetchPages, 3600000) // 1h interval

    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [roleId])

  if (isLoading) {
    return <div>Loading...</div> // Show loading indicator while fetching data
  }

  return (
    <div className="app-container bg-zinc-100">
      <Header />
      <BrowserRouter>
        <Routes>
          {!roleId && <Route path="*" element={<Navigate to="/" replace />} />}
          <Route index element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          {allRoutes.map(
            (route) =>
              pages.some((page) => page.name === route.name) && (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ),
          )}
          <Route path="/logout" element={<LogoutPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
