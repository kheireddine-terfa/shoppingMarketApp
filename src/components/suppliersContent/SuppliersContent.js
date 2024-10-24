import React, { useEffect, useState } from 'react'
import Table from '../commonComponents/Table'
import ErrorPopup from '../commonComponents/ErrorPopup'

import {
  filteredSuppliers,
  initialFormData,
} from '../../utilities/supplierUtils'
import { InputsConfig, headerConfig } from '../../config/supplierConfig'
import {
  fetchSuppliers,
  handleAddSubmit,
  handleDeleteAll,
  handleConfirmDelete,
  handleSubmit,
} from '../../api/supplierApi'
import { fetchAcions } from '../../api/commonApi'
import AddModal from '../commonComponents/AddModal'
import ConfirmModal from '../commonComponents/ConfirmModal'
import UpdateModal from '../commonComponents/UpdateModal'
// check the controller :
const SuppliersContent = () => {
  //----------- States:
  const [suppliers, setSuppliers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [pageActions, setActions] = useState([])
  const [canAdd, setCanAdd] = useState(false)
  const [canDelete, setCanDelete] = useState(false)
  const [canUpdate, setCanUpdate] = useState(false)

  // Fetch suppliers from the backend
  useEffect(() => {
    fetchSuppliers(setSuppliers, setErrorMessage, setShowErrorPopup)
    fetchAcions(setActions, setErrorMessage, setShowErrorPopup, 'suppliers')
  }, [])
  useEffect(() => {
    setCanAdd(pageActions.includes('add'))
    setCanDelete(pageActions.includes('delete'))
    setCanUpdate(pageActions.includes('update'))
  }, [pageActions]) // Run this effect only when `actions` changes
  const allowedActions = {
    canAdd,
    canDelete,
    canUpdate,
  }
  const handleDeleteClick = (supplier) => {
    setSelectedSupplier(supplier) // Ensure the correct supplier object is set
    setShowDeleteModal(true)
  }
  const handleUpdateSupplier = (supplier) => {
    setSelectedSupplier(supplier)
    console.log('supplier :', supplier)
    setFormData({
      name: supplier.name,
      address: supplier.address,
      phone_number: supplier.phone_number,
    })
    setShowUpdateModal(true)
  }

  const handleCancelUpdate = () => {
    setShowUpdateModal(false)
    setSelectedSupplier(null)
  }
  const actions = {
    onDelete: handleDeleteClick,
    onUpdate: handleUpdateSupplier,
  }
  return (
    <main className="container mx-auto p-4 mt-[52px] flex flex-wrap mb-5">
      <div className="w-full max-w-full px-3 mb-6 mx-auto">
        <div className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5">
          <div className="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
            <div className="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
              <h3 className="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
                <span className="mr-3 font-semibold text-dark">
                  Tous Les Fournisseur
                </span>
              </h3>
              <div className="relative flex items-center my-2 border rounded-lg h-[40px] ml-auto min-w-[50%]">
                <input
                  type="text"
                  placeholder="Search suppliers..."
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
                {allowedActions.canAdd && (
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    Add New Supplier
                  </button>
                )}
                {allowedActions.canDelete && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(true)} // Show the confirmation modal
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    Delete All
                  </button>
                )}
              </div>
            </div>
            <Table
              data={filteredSuppliers(suppliers, searchQuery)}
              actions={actions}
              headerConfig={headerConfig}
              tableTitle={'suppliers'}
              allowedActions={allowedActions}
            />
          </div>
        </div>
      </div>
      {showModal && (
        <AddModal
          onSubmit={(e) =>
            handleAddSubmit(
              e,
              formData,
              setSuppliers,
              setShowModal,
              setFormData,
              setErrorMessage,
              setShowErrorPopup,
            )
          }
          onCancel={() => setShowModal(false)}
          InputsConfig={InputsConfig(formData, setFormData)}
          title={'Supplier'}
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          title="Delete Supplier"
          message={`Are you sure you want to delete this Supplier?`}
          onConfirm={() =>
            handleConfirmDelete(
              selectedSupplier,
              setSuppliers,
              suppliers,
              setSelectedSupplier,
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
          message="Are you sure you want to delete all suppliers?"
          onConfirm={() =>
            handleDeleteAll(
              setSuppliers,
              setShowConfirmModal,
              setErrorMessage,
              setShowErrorPopup,
            )
          }
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      {showUpdateModal && selectedSupplier && (
        <UpdateModal
          title="Supplier"
          InputsConfig={InputsConfig(formData, setFormData)}
          onSubmit={(e) =>
            handleSubmit(
              e,
              formData,
              setSuppliers,
              setShowUpdateModal,
              setFormData,
              selectedSupplier,
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

export default SuppliersContent
