import React, { useEffect, useState } from 'react'
import ErrorPopup from '../commonComponents/ErrorPopup'
import RoleCard from './RoleCard'
import { filteredRoles } from '../../utilities/roleUtils'
import {
  handleAddSubmit,
  fetchRoles,
  handleConfirmDelete,
  handleDeleteAll,
  handleSubmit,
} from '../../api/roleApi'
import AddRoleModal from './AddRoleModal'
import ConfirmModal from '../commonComponents/ConfirmModal'
import UpdateRoleModal from './UpdateRoleModal'
// check the controller :
const RolesContent = () => {
  //----------- States:
  const [roles, setRoles] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showErrorPopup, setShowErrorPopup] = useState(false)

  // Fetch roles from the backend

  useEffect(() => {
    fetchRoles(setRoles, setErrorMessage, setShowErrorPopup)
  }, [])
  const handleDeleteClick = (role) => {
    setSelectedRole(role) // Ensure the correct role object is set
    setShowDeleteModal(true)
  }
  const handleUpdateRole = (role) => {
    console.log('role   ', role)
    setSelectedRole(role)
    setShowUpdateModal(true)
  }

  const handleCancelUpdate = () => {
    setShowUpdateModal(false)
    setSelectedRole(null)
  }

  const actions = {
    onDelete: handleDeleteClick,
    onUpdate: handleUpdateRole,
  }

  return (
    <main className="container mx-auto p-4 mt-[52px] flex flex-wrap mb-5">
      <div className="w-full max-w-full px-3 mb-6 mx-auto">
        <div className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5">
          <div className="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
            <div className="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
              <h3 className="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
                <span className="mr-3 font-semibold text-dark">
                  Tous Les Roles
                </span>
              </h3>
              <div className="relative flex items-center my-2 border rounded-lg h-[40px] ml-auto min-w-[50%]">
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full px-4 py-2 text-sm border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35m2.7-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="relative flex flex-wrap justify-end items-center my-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  Add New role
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)} // Show the confirmation modal
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Delete All
                </button>
              </div>
            </div>
            <div className="flex flex-wrap">
              {filteredRoles(roles, searchQuery).map((roleData, index) => (
                <RoleCard
                  key={index}
                  role={roleData.name}
                  pages={roleData.pages}
                  onDelete={() => actions.onDelete(roleData.id)}
                  onUpdate={() => actions.onUpdate(roleData)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <AddRoleModal
          onSubmit={(roleData) =>
            handleAddSubmit(
              roleData,
              setErrorMessage,
              setShowErrorPopup,
              setRoles,
              setShowModal,
            )
          }
          onCancel={() => setShowModal(false)}
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          title="Delete role"
          message={`Are you sure you want to delete this role?`}
          onConfirm={() =>
            handleConfirmDelete(
              selectedRole,
              setRoles,
              roles,
              setSelectedRole,
              setShowDeleteModal,
              setErrorMessage,
              setShowErrorPopup,
            )
          }
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete all roles?"
          onConfirm={() =>
            handleDeleteAll(
              setRoles,
              setShowConfirmModal,
              setErrorMessage,
              setShowErrorPopup,
            )
          }
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      {showUpdateModal && selectedRole && (
        <UpdateRoleModal
          selectedRole={selectedRole}
          onSubmit={(roleData) =>
            handleSubmit(
              roleData,
              setRoles,
              setShowUpdateModal,
              setErrorMessage,
              setShowErrorPopup,
            )
          }
          onCancel={handleCancelUpdate}
        />
      )}
      {showErrorPopup && (
        <ErrorPopup
          message={errorMessage}
          onClose={() => setShowErrorPopup(false)}
        />
      )}
    </main>
  )
}

export default RolesContent
