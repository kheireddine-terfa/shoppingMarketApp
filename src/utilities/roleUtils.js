// Filter roles searching :

export const filteredRoles = (roles, searchQuery) => {
  return roles.filter((role) => {
    const searchLower = searchQuery.toLowerCase()
    return role.name && role.name.toLowerCase().includes(searchLower)
  })
}

export const initialFormData = {
  date: '',
  amount: '',
  description: '',
}
