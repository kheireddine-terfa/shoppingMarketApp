import React from 'react'
import ProductImage from '../ProductContent/relatedComponents/ProductImage'
import ProductTitle from '../ProductContent/relatedComponents/ProductTitle'

const TableRow = ({ actions, dataItem, tableTitle }) => {
  return (
    <tr className="border-b border-dashed last:border-b-0 hover:bg-sky-100">
      {dataItem.imageSrc || dataItem.title ? (
        <td className="p-3 pl-0">
          <div className="flex items-center">
            {dataItem.imageSrc && (
              <ProductImage src={dataItem.imageSrc} alt={dataItem.imageAlt} />
            )}
            {dataItem.title && (
              <ProductTitle href={dataItem.titleHref} title={dataItem.title} />
            )}
          </div>
        </td>
      ) : dataItem.date ? (
        <td className="p-3 pl-0 text-start">
          <span className="font-semibold text-light-inverse text-md/normal">
            {new Date(dataItem.date).toLocaleDateString()}
          </span>
        </td>
      ) : (
        ''
      )}

      {dataItem.price ? (
        <td className="p-3 pl-0 text-start ">
          <span className="font-semibold text-light-inverse text-md/normal">
            {dataItem.price}
          </span>
        </td>
      ) : dataItem.address ? (
        <td className="p-3 pl-0 text-start ">
          <span className="font-semibold text-light-inverse text-md/normal">
            {dataItem.address}
          </span>
        </td>
      ) : dataItem.amount ? (
        <td className="p-3 pl-0 text-start">
          <span className="font-semibold text-light-inverse text-md/normal">
            {dataItem.amount}
          </span>
        </td>
      ) : (
        ''
      )}
      {dataItem.sales ? (
        <td className="p-3 pl-0 text-start">
          <span className="text-center align-baseline inline-flex px-2 py-1 mr-auto items-center font-semibold text-base/none text-success bg-success-light rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
              />
            </svg>
            {dataItem.sales}
          </span>
        </td>
      ) : dataItem.phone_number ? (
        <td className="p-3 pl-0 text-start">
          <span className="font-semibold text-light-inverse text-md/normal">
            {dataItem.phone_number}
          </span>
        </td>
      ) : dataItem.description ? (
        <td className="p-3 pl-0 text-start">
          <span className="font-semibold text-light-inverse text-md/normal">
            {dataItem.description}
          </span>
        </td>
      ) : (
        ''
      )}
      {dataItem.paid_amount ? (
        <td className="p-3 pl-0 text-start">
          <span className="font-semibold text-light-inverse text-md/normal">
            {dataItem.paid_amount}
          </span>
        </td>
      ) : (
        ''
      )}
      {dataItem.remaining_amount ? (
        <td className="p-3 pl-0 text-start">
          <span className="font-semibold text-light-inverse text-md/normal">
            {dataItem.remaining_amount}
          </span>
        </td>
      ) : (
        ''
      )}
      {dataItem.expAlert ? (
        <td className="p-3 pl-10 text-start">
          <span className="font-semibold text-red-700 text-md/normal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="text-red-700"
            >
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>{' '}
          </span>
        </td>
      ) : dataItem.expAlert === null ? (
        <td className="p-3  pl-10 text-start">
          <span className="font-semibold  text-md/normal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="text-green-700"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l7.59-7.59L19 7.5l-9 9z" />
            </svg>
          </span>
        </td>
      ) : (
        ''
      )}
      {dataItem.inventoryState && (
        <td className="p-3 pl-0 text-start">
          <span
            className={`text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none rounded-lg ${dataItem.inventoryStateClass}`}
          >
            {dataItem.inventoryState}
          </span>
        </td>
      )}
      {tableTitle === 'categories' ? (
        <td className="p-3 pr-11 text-start ">
          <div className="flex justify-end gap-3">
            <button
              onClick={() => actions.onDelete(dataItem.currentCategory.id)}
              className="text-danger"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
            <button
              onClick={() => actions.onUpdate(dataItem.currentCategory)}
              className="text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </button>
          </div>
        </td>
      ) : tableTitle === '' ? (
        <td className="p-3 pr-11  text-start ">
          <div className="flex justify-end gap-3">
            <button
              onClick={() => actions.onDelete(dataItem.currentSupplier.id)}
              className="text-danger"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
            <button
              onClick={() => actions.onUpdate(dataItem.currentSupplier)}
              className="text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </button>
          </div>
        </td>
      ) : tableTitle === 'supplies' ? (
        <td className="p-3 pr-11  text-start ">
          <div className="flex justify-end gap-3">
            <button
              onClick={() => actions.onDelete(dataItem.currentSupply.id)}
              className="text-danger"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
            <button
              onClick={() => actions.onUpdate(dataItem.currentSupply)}
              className="text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </button>
          </div>
        </td>
      ) : (
        <td className="p-3 pl-0 text-start ">
          <div className="flex justify-start gap-3">
            <button
              onClick={() => actions.onDelete(dataItem.currentProduct.id)}
              className="text-danger"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
            <button
              onClick={() => actions.onUpdate(dataItem.currentProduct)}
              className="text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </button>
          </div>
        </td>
      )}
      {actions.onShowDetails && (
        <td className="p-3 pl-0 text-start">
          <button
            className="ml-auto relative text-secondary-dark bg-light-dark hover:text-primary flex items-center h-[25px] w-[25px] text-base font-medium leading-normal text-center align-middle cursor-pointer rounded-2xl transition-colors duration-200 ease-in-out shadow-none border-0 justify-center"
            onClick={() => actions.onShowDetails(dataItem)}
          >
            <span className="flex items-center justify-center p-0 m-0 leading-none shrink-0 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </span>
          </button>
        </td>
      )}
    </tr>
  )
}

export default TableRow
