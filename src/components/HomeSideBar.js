import React, { useEffect, useState } from 'react'
import SideBarItem from './SideBarItem'

const HomeSideBar = () => {
  // eslint-disable-next-line
  const [roleId, setRoleId] = useState(sessionStorage.getItem('roleId'))
  const [pages, setPages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const allSideBarItems = [
    { text: 'Nouvelle vente', url: '/sales', name: 'new-sale' },
    { text: 'Produits', url: '/products', name: 'products' },
    { text: 'Ventes', url: '/product-sales', name: 'sales' },
    { text: 'Fournisseurs', url: '/suppliers', name: 'suppliers' },
    { text: 'Statistiques', url: '/statistics', name: 'statistics' },
    { text: 'Categories', url: '/categories', name: 'categories' },
    { text: 'Dépenses', url: '/expenses', name: 'expenses' },
    { text: 'Roles', url: '/roles', name: 'roles' },
    { text: 'Users', url: '/users', name: 'users' },
    { text: 'Réapprovisionnements', url: '/supplies', name: 'supplies' },
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
    <aside className="bg-[#003248e3] text-white w-72 min-h-screen p-4 z-0 pt-20">
      <nav>
        <ul className="space-y-2">
          {allSideBarItems.map(
            (item) =>
              pages.some((page) => page.name === item.name) && (
                <SideBarItem key={item.url} text={item.text} url={item.url} />
              ),
          )}
          <SideBarItem key="/logout" text="logout" url="/logout" />
        </ul>
      </nav>
    </aside>
  )
}

export default HomeSideBar
