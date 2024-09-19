export const InputsConfig = (formData, setFormData, isUpdate) => {
  return [
    {
      label: 'Date',
      value: formData.date,
      type: 'date',
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          date: e.target.value,
        })),
      required: !isUpdate, // Only required if it's not an update,
    },
    {
      label: 'Amount',
      value: formData.amount,
      type: 'number',
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          amount: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Description',
      value: formData.description,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          description: e.target.value,
        })),
      required: !isUpdate,
    },
    {
      label: 'Paid Amount',
      value: formData.paid_amount,
      type: 'number',
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          paid_amount: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Remaining Amount',
      value: formData.remaining_amount,
      type: 'number',
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          remaining_amount: e.target.value,
        })),
      required: true,
    },
  ]
}
export const headerConfig = [
  {
    title: 'Date',
    class: 'pb-3 text-start min-w-[20%]',
  },
  {
    title: 'Description',
    class: 'pb-3 text-start min-w-[20%]',
  },
  {
    title: 'Amount',
    class: 'pb-3 text-start min-w-[20%]',
  },
  {
    title: 'Paid Amount',
    class: 'pb-3 text-start min-w-[20%]',
  },
  {
    title: 'Remaining Amount',
    class: 'pb-3 text-start min-w-[20%]',
  },
  {
    title: 'Manage',
    class: 'pb-3 text-start min-w-[15%]',
  },
  {
    title: 'details',
    class: 'pb-3 pr-12 text-end min-w-[15%]',
  },
]
