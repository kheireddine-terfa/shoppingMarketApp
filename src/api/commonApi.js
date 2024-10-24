export const fetchAcions = async (
  setActions,
  setErrorMessage,
  setShowErrorPopup,
  pageName,
) => {
  try {
    const token = sessionStorage.getItem('token')
    const roleId = sessionStorage.getItem('roleId')
    const response = await fetch(`http://localhost:3001/api/roles/${roleId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token
      },
    })
    if (!response.ok) {
      setErrorMessage('Failed to fetch user pages.')
      setShowErrorPopup(true)
      return
    }
    const data = await response.json()
    const pages = data.pages
    const currentPage = pages.find((page) => page.name === pageName)
    if (currentPage) {
      const actions = currentPage.actions.actions.split(',')
      setActions(actions)
    }
  } catch (error) {
    console.error('Error fetching user pages:', error)
  }
}
export const fetchRoles = async (
  setRoles,
  setErrorMessage,
  setShowErrorPopup,
) => {
  try {
    const token = sessionStorage.getItem('token')
    const response = await fetch('http://localhost:3001/api/roles', {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token
      },
    })
    if (!response.ok) {
      setErrorMessage('Failed to fetch roles , please try again later.')
      setShowErrorPopup(true)
      return
    }
    const data = await response.json()
    setRoles(
      data.map((role) => {
        return {
          id: role.roleId,
          name: role.roleName,
          pages: role.pages,
        }
      }),
    )
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}
