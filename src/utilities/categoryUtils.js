// Filter categories searching :

export const filteredCategories = (categories, searchQuery) => {
  return categories.filter((category) => {
    const searchLower = searchQuery.toLowerCase()
    return category.title && category.title.toLowerCase().includes(searchLower)
  })
}

export const initialFormData = {
  name: '',
  image: null,
}
