  // Filter expenses searching :
  
  export const filteredExpenses = (expenses, searchQuery) => {
    return expenses.filter((expense) => {
        const searchLower = searchQuery.toLowerCase()
        return (
            (expense.date && expense.date.toLowerCase().includes(searchLower)) ||
            (expense.amount &&
              expense.amount.toString().toLowerCase().includes(searchLower)) ||
            (expense.description &&
              expense.description.toString().toLowerCase().includes(searchLower))
              )
      })
  }
  
  export   const initialFormData = {
    date: '',
    amount: '',
    description: '',
  }
  