import React from 'react'
import SideBarItem from './SideBarItem'

const HomeSideBar = () => {
  return (
    <aside className="bg-[#003248e3] text-white w-72 min-h-screen p-4 z-0 pt-20">
      <nav>
        <ul className="space-y-2">
          <SideBarItem text="Nouvelle vente" url="/sales" />
          <SideBarItem text="Produits" url="/products" />
          <SideBarItem text="Ventes" url="/product-sales" />
          <SideBarItem text="Fournisseurs" url="/suppliers" />
          <SideBarItem text="Statistiques" url="/statistics" />
          <SideBarItem text="Categories" url="/categories" />
          <SideBarItem text="Dépenses" url="/expenses" />
          <SideBarItem text="Roles" url="/roles" />
          <SideBarItem text="Réapprovisionnements" url="/supplies" />

          {/* <SideBarItem text="Ventes" /> */}
        </ul>
      </nav>
    </aside>
  )
}

export default HomeSideBar
