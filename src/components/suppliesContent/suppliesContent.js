import React, { useState, useEffect } from 'react';
import Table from '../commonComponents/Table';
import AddModal from '../commonComponents/AddModal';
import ConfirmModal from '../commonComponents/ConfirmModal';
import UpdateModal from '../commonComponents/UpdateModal';

const SuppliesContent = () => {
  const [supplies, setSupplies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    amount: 0,
    description: '',
    paid_amount: 0,
    remaining_amount: 0,
  });

  useEffect(() => {
    fetchSupplies();
  }, []);

  const fetchSupplies = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/supplies');
      const data = await response.json();
      console.log('Fetched supplies:', data); // Check data
      setSupplies(
        data.map(supply => ({
          id: supply.id,
          date: new Date(supply.date).toLocaleDateString(),
          amount: supply.amount,
          description: supply.description,
          paid_amount: supply.paid_amount,
          remaining_amount: supply.remaining_amount,
          titleHref: `/supplies/${supply.id}`,
          title: supply.description,
          currentSupply: supply,
        }))
      );
    } catch (error) {
      console.error('Error fetching supplies:', error);
    }
  };
 
  console.log(supplies)

  const handleDeleteClick = (supply) => {
    setSelectedSupply(supply);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSupply) return;
    try {
      const response = await fetch(`http://localhost:3001/api/supplies/${selectedSupply.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSupplies(supplies.filter(s => s.id !== selectedSupply.id));
        setSelectedSupply(null);
        setShowConfirmModal(false);
      } else {
        console.error('Failed to delete supply');
      }
    } catch (error) {
      console.error('Error deleting supply:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/supplies', {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchSupplies();
        setShowConfirmModal(false);
      } else {
        console.error('Failed to delete all supplies');
      }
    } catch (error) {
      console.error('Error deleting all supplies:', error);
    }
  };

  const handleAddSupply = async (newSupply) => {
    try {
      const response = await fetch('http://localhost:3001/api/supplies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSupply),
      });
      if (response.ok) {
        const addedSupply = await response.json();
        setSupplies([...supplies, { ...addedSupply, titleHref: `/supplies/${addedSupply.id}`, title: addedSupply.description }]);
        setShowModal(false);
        setFormData({
          date: '',
          amount: 0,
          description: '',
          paid_amount: 0,
          remaining_amount: 0,
        });
      } else {
        console.error('Failed to add supply');
      }
    } catch (error) {
      console.error('Error adding supply:', error);
    }
  };

  const handleUpdate = async (updatedSupply) => {
    try {
      const response = await fetch(`http://localhost:3001/api/supplies/${updatedSupply.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSupply),
      });
      if (response.ok) {
        fetchSupplies();
        setShowUpdateModal(false);
        setFormData({
          date: '',
          amount: 0,
          description: '',
          paid_amount: 0,
          remaining_amount: 0,
        });
      } else {
        console.error('Failed to update supply');
      }
    } catch (error) {
      console.error('Error updating supply:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedSupply = {
      id: selectedSupply.id,
      ...formData,
    };
    handleUpdate(updatedSupply);
  };

  const handleUpdateSupply = (supply) => {
    setSelectedSupply(supply);
    setFormData({
      date: new Date(supply.date).toISOString().split('T')[0],
      amount: supply.amount,
      description: supply.description,
      paid_amount: supply.paid_amount,
      remaining_amount: supply.remaining_amount,
    });
    setShowUpdateModal(true);
  };

  const handleCancelUpdate = () => {
    setShowUpdateModal(false);
    setSelectedSupply(null);
  };

  const filteredSupplies = supplies.filter(supply => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (supply.title && supply.title.toLowerCase().includes(searchLower)) ||
      (supply.description && supply.description.toLowerCase().includes(searchLower)) ||
      (supply.amount.toString() && supply.amount.toString().toLowerCase().includes(searchLower)) ||
      (supply.paid_amount.toString() && supply.paid_amount.toString().toLowerCase().includes(searchLower)) ||
      (supply.remaining_amount.toString() && supply.remaining_amount.toString().toLowerCase().includes(searchLower))
    );
  });

  const actions = {
    onDelete: handleDeleteClick,
    onUpdate: handleUpdateSupply,
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    handleAddSupply(formData);
  };

  const InputsConfig = [
    {
      label: 'Date',
      type: 'date',
      value: formData.date,
      onChange: (e) => setFormData({ ...formData, date: e.target.value }),
      required: true,
    },
    {
      label: 'Amount',
      type: 'number',
      value: formData.amount,
      onChange: (e) => setFormData({ ...formData, amount: parseFloat(e.target.value) }),
      required: true,
    },
    {
      label: 'Description',
      value: formData.description,
      onChange: (e) => setFormData({ ...formData, description: e.target.value }),
      required: true,
    },
    {
      label: 'Paid Amount',
      type: 'number',
      value: formData.paid_amount,
      onChange: (e) => setFormData({ ...formData, paid_amount: parseFloat(e.target.value) }),
      required: true,
    },
    {
      label: 'Remaining Amount',
      type: 'number',
      value: formData.remaining_amount,
      onChange: (e) => setFormData({ ...formData, remaining_amount: parseFloat(e.target.value) }),
      required: true,
    },
  ];

  const headerConfig = [
    { title: 'Date', class: 'pb-3 text-start min-w-[20%]' },
    { title: 'Amount', class: 'pb-3 text-start min-w-[20%]' },
    { title: 'Description', class: 'pb-3 text-start min-w-[30%]' },
    { title: 'Paid Amount', class: 'pb-3 text-start min-w-[15%]' },
    { title: 'Remaining Amount', class: 'pb-3 text-start min-w-[15%]' },
    { title: 'Manage', class: 'pb-3 text-end min-w-[10%]' },
  ];

  return (
    <main className="container mx-auto p-4 mt-[52px] flex flex-wrap mb-5">
      <div className="w-full max-w-full px-3 mb-6 mx-auto">
        <div className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5">
          <div className="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
            <div className="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
              <h3 className="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
                <span className="mr-3 font-semibold text-dark">All Supplies</span>
              </h3>
              <div className="relative flex items-center my-2 border rounded-lg h-[40px] ml-auto min-w-[50%]">
                <input
                  type="text"
                  placeholder="Search supplies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full px-4 py-2 text-sm border-none rounded-lg focus:outline-none"
                />
              </div>
              <div className="relative flex items-center justify-between mt-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
          >
            Add Supply
          </button>
          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md shadow-md hover:bg-red-600"
          >
            Delete All Supplies
          </button>
        </div>
            </div>
            <Table
              items={filteredSupplies}
              actions={actions}
              headerConfig={headerConfig}
              tableType="supplies"
            />
          </div>
        </div>
      </div>

      {/* Add Supply Modal */}
      {showModal && (
        <AddModal
          title="Add Supply"
          inputsConfig={InputsConfig}
          onSubmit={handleAddSubmit}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Update Supply Modal */}
      {showUpdateModal && (
        <UpdateModal
          title="Update Supply"
          inputsConfig={InputsConfig}
          onSubmit={handleSubmit}
          onClose={handleCancelUpdate}
        />
      )}

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <ConfirmModal
          title="Confirm"
          message="Are you sure you want to delete this supply?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </main>
  );
};

export default SuppliesContent;
