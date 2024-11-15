

export const InputsConfig = (formData,setFormData,suppliers) => {
    return ([
        {
          type : 'number',
          label: 'Supply Amount',
          value: formData.amount,
          min: 0,
          onChange: (e) =>
            setFormData((prevData) => ({
              ...prevData,
              amount: e.target.value,
            })),
          required: true,
        },
        {
          label: 'Supply Description',
          value: formData.description,
          onChange: (e) =>
            setFormData((prevData) => ({
              ...prevData,
              description: e.target.value,
            })),
          required: false,
          maxLength : "30"
        },
        {
          type : 'number',
          label: 'Paid Amount',
          min: 0,
          value: formData.paid_amount,
          onChange: (e) =>
            setFormData((prevData) => ({
              ...prevData,
              paid_amount: e.target.value,
            })),
          required: true,
        },
        {
          type : 'number',
          label: 'Remaining Amount',
          min: 0,
          value: formData.remaining_amount,
          onChange: (e) =>
            setFormData((prevData) => ({
              ...prevData,
              remaining_amount: e.target.value,
            })),
          required: true,
        },
        {
          label: 'Supplier',
          type: 'select',
          value: formData.supplierId,
          onChange: (e) =>
            setFormData((prevData) => ({
              ...prevData,
              supplierId: e.target.value,
            })),
          options: suppliers,
          required: true,
          name: suppliers.find((supplier) => supplier.id === formData.supplierId)?.name || '',
        }
        
      ])
}

export const modalData = (selectedSupply, selectedSupplier, formatDate) => {
    return selectedSupply && selectedSupply.currentSupply
      ? [
          {
            label: 'Date',
            value: `${formatDate(selectedSupply.currentSupply.date)}`,
          },
          {
            label: 'Amount',
            value: `${selectedSupply.currentSupply.amount} DA`,
          },
          { 
            label: 'Remaining amount', 
            value: `${selectedSupply.currentSupply.remaining_amount} DA`,
          },
          {
            label: 'Paid amount',
            value: `${selectedSupply.currentSupply.paid_amount} DA`,
          },
          {
            label: 'Description',
            value: selectedSupply.currentSupply.description,
          },
          {
            label: 'Supplier',
            value: selectedSupplier,
          },
        ]
      : [];
  };
  

export const headerConfig = [
    {
      title: 'Supply Date',
      class: 'pb-3 text-start min-w-[20%]',
    },
    {
      title: 'amount',
      class: 'pb-3 text-start min-w-[20%]',
    },
    {
      title: 'Description',
      class: 'pb-3 text-start min-w-[20%]',
    },
    {
      title: 'Paid Amount',
      class: 'pb-3 text-start min-w-[20%]',
    },
    {
      title: 'Remaining Amount',
      class: 'pb-3 text-start min-w-[20%]',
    },
    {
      title: 'Manage',
      class: 'pb-3 pr-12 text-end min-w-[20%]',
    },
    {
      title: 'Details',
      class: 'pb-3 pr-12 text-end min-w-[20%]',
    },
  ]