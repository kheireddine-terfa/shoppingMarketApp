// Filter suppliers searching :

export const filteredSales = (sales, searchQuery) => {
  return sales.filter((sale) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      (sale.date && sale.date.toLowerCase().includes(searchLower)) ||
      (sale.amount &&
        sale.amount.toString().toLowerCase().includes(searchLower)) ||
      (sale.description &&
        sale.description.toString().toLowerCase().includes(searchLower)) ||
      (sale.paid_amount &&
        sale.paid_amount.toString().toLowerCase().includes(searchLower)) ||
      (sale.remaining_amount &&
        sale.remaining_amount.toString().toLowerCase().includes(searchLower))
    )
  })
}

export const initialFormData = {
  date: '',
  amount: '',
  description: '',
  paid_amount: '',
  remaining_amount: '',
}
export const modalData = (selectedSale) => {
  return selectedSale && selectedSale.currentSale
    ? [
        {
          label: 'Date',
          value: `${new Date(
            selectedSale.currentSale.date,
          ).toLocaleDateString()}`,
        },
        {
          label: 'Amount',
          value: `${selectedSale.currentSale.amount} DA`,
        },
        { label: 'Description', value: selectedSale.currentSale.description },
        {
          label: 'Paid Amount',
          value: selectedSale.currentSale.paid_amount,
        },

        {
          label: 'Remaining Amount',
          value: selectedSale.remaining_amount,
        },
      ]
    : []
}
