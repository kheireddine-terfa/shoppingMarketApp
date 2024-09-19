export const InputsConfig = (formData, setFormData, isUpdate) => {
  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }))
  }
  return [
    {
      label: 'Category Name',
      value: formData.name,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          name: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Category Image',
      type: 'file',
      onChange: handleImageChange,
      accept: 'image/*',
      required: !isUpdate, // Only required if it's not an update,
    },
  ]
}
export const headerConfig = [
  {
    title: 'Title',
    class: 'pb-3 text-start min-w-[50%]',
  },
  {
    title: 'Manage',
    class: 'pb-3 pr-12 text-end min-w-[50%]',
  },
]
