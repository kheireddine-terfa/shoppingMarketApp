export const InputsConfig = (formData, setFormData, roles, isUpdate) => {
  return [
    {
      label: 'User Name',
      value: formData.username,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          username: e.target.value,
        })),
      required: true,
    },
    {
      label: 'Password',
      value: formData.password,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          password: e.target.value,
        })),
      required: true,
      disabled: isUpdate,
    },
    {
      label: 'Password Confirm',
      value: formData.passwordConfirm,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          passwordConfirm: e.target.value,
        })),
      required: true,
      disabled: isUpdate,
    },
    {
      label: 'Role',
      type: 'select',
      value: formData.selectedRole,
      onChange: (e) =>
        setFormData((prevData) => ({
          ...prevData,
          role_id: e.target.value,
        })),
      options: roles,
    },
  ]
}
export const headerConfig = [
  {
    title: 'User Name',
    class: 'pb-3 text-start min-w-[35%]',
  },
  {
    title: 'Role Name',
    class: 'pb-3 text-start min-w-[35%]',
  },
  {
    title: 'Manage',
    class: 'pb-3 pr-12 text-end min-w-[30%]',
  },
]
