import React from 'react'
import SideBarItem from './SideBarItem'

const Sidebar = () => {
  return (
    <aside className="bg-[#003248e3] text-white w-64 min-h-screen p-4 z-30">
      <nav>
        <ul className="space-y-2">
          <SideBarItem text="Nouvelle vente" />
          <SideBarItem text="Produits" />
          <SideBarItem text="Fournisseurs" />
          <SideBarItem text="Dépenses" />
          <SideBarItem text="Ventes" />
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar