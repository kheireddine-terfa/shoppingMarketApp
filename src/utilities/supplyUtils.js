
export const initialFormData = {
    date: '',
    amount: '',
    description: '',
    paid_amount: '',
    remaining_amount: '',
    supplierId:''
  }

  export const filteredSupplies = (supplies, searchQuery) => {
    const searchLower = searchQuery.toLowerCase();
    return supplies.filter((supply) => {
      return (
        (supply.date && supply.date.toString().includes(searchLower)) ||
        (supply.amount && supply.amount.toString().toLowerCase().includes(searchLower)) ||
        (supply.description && supply.description.toLowerCase().includes(searchLower))
      );
    });
  };

 export const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };