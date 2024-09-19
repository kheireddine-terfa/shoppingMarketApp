export const InputsConfig = (formData, setFormData) => {
  return [
    {
      label: 'Supplier Name',
      value: formData.name,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          name: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Supplier Address',
      value: formData.address,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          address: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Supplier Phone Number',
      value: formData.phone_number,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          phone_number: e.target.value,
        })),
      required: true,
    },
  ]
}
export const headerConfig = [
  {
    title: 'Supplier Name',
    class: 'pb-3 text-start min-w-[25%]',
  },
  {
    title: 'Address',
    class: 'pb-3 text-start min-w-[25%]',
  },
  {
    title: 'Phone Number',
    class: 'pb-3 text-start min-w-[25%]',
  },
  {
    title: 'Manage',
    class: 'pb-3 pr-12 text-end min-w-[25%]',
  },
]
