// Filter users searching :

export const filteredUsers = (users, searchQuery) => {
  return users.filter((user) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      (user.username && user.username.toLowerCase().includes(searchLower)) ||
      (user.role && user.role.toLowerCase().includes(searchLower))
    )
  })
}

export const initialFormData = {
  username: '',
  password: '',
  passwordConfirm: '',
  role_id: '',
}
