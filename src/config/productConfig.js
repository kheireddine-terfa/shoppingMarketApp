export const InputsConfig = (formData, setFormData, categories) => {
  // Get current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split('T')[0]
  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      productImage: e.target.files[0],
    }))
  }
  return [
    {
      label: 'Product Name',
      value: formData.productName,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          productName: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Balanced Product',
      type: 'checkbox',
      checked: formData.isBalanced,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          isBalanced: e.target.checked,
        })),
    },
    {
      label: 'Has Barcode',
      type: 'checkbox',
      checked: formData.hasBarCode,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          hasBarCode: e.target.checked,
        })),
    },
    {
      label: 'Category',
      type: 'select',
      value: formData.selectedCategory,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          selectedCategory: e.target.value,
        })),
      options: categories,
      disabled: formData.hasBarCode,
    },
    {
      label: 'Product Bare Code',
      value: formData.barCode,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          barCode: e.target.value,
        })),
      disabled: !formData.hasBarCode,
      required: formData.hasBarCode,
    },
    {
      label: 'Price',
      type: 'number',
      min: 1,
      value: formData.productPrice,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          productPrice: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Purchase Price',
      type: 'number',
      min: 1,
      value: formData.productPurchasePrice,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          productPurchasePrice: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Quantity',
      type: 'number',
      min: 1,
      value: formData.productQuantity,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          productQuantity: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Minimum Quantity',
      type: 'number',
      min: 1,
      value: formData.minQuantity,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          minQuantity: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Expiration Date',
      type: 'date',
      min: currentDate, // Prevent selection of past dates
      value: formData.expirationDate,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          expirationDate: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Alert Interval (days)',
      type: 'number',
      min: 1,
      value: formData.alertInterval,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          alertInterval: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Product Image',
      type: 'file',
      onChange: handleImageChange,
      accept: 'image/*',
      required: true,
    },
  ]
}
export const headerConfig = [
  {
    title: 'Title',
    class: 'pb-3 text-start min-w-[175px]',
  },
  {
    title: 'Price',
    class: 'pb-3 text-start min-w-[100px]',
  },
  {
    title: 'Expiration Alert',
    class: 'pb-3 text-start min-w-[100px]',
  },
  {
    title: 'Inventory State',
    class: 'pb-3 text-start min-w-[175px]',
  },
  {
    title: 'Manage',
    class: 'pb-3 pr-12 text-start min-w-[175px]',
  },
  {
    title: 'Details',
    class: 'pb-3 text-end min-w-[50px]',
  },
]
