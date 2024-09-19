  // Filter suppliers searching :
  
  export const filteredSuppliers = (suppliers, searchQuery) => {
    return suppliers.filter((supplier) => {
        const searchLower = searchQuery.toLowerCase()
        return (
          (supplier.title && supplier.title.toLowerCase().includes(searchLower)) ||
          (supplier.address &&
            supplier.address.toLowerCase().includes(searchLower)) ||
          (supplier.phone_number.toString() &&
            supplier.phone_number.toString().toLowerCase().includes(searchLower))
        )
      })
  }
  
  export   const initialFormData = {
    name: '',
    address: '',
    phone_number: '',
  }
  