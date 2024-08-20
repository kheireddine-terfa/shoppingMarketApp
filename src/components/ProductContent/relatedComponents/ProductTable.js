import React from 'react'
import ProductRow from './ProductRow'

const ProductTable = ({ products, onDelete }) => {
  return (
    <div className="flex-auto block py-8 pt-6 px-9">
      <div className="overflow-x-auto">
        <table className="w-full my-0 align-middle text-dark border-neutral-200">
          <thead className="align-bottom">
            <tr className="font-semibold text-[0.95rem] text-secondary-dark">
              <th className="pb-3 text-start min-w-[175px]">Title</th>
              <th className="pb-3 text-start min-w-[100px]">Price</th>
              <th className="pb-3 text-start min-w-[100px]">Sales</th>
              <th className="pb-3 text-start min-w-[175px]">Inventory State</th>
              <th className="pb-3 pr-12 text-start min-w-[175px]">Manage</th>
              <th className="pb-3 text-end min-w-[50px]">Details</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <ProductRow
                key={index}
                imageSrc={product.imageSrc}
                imageAlt={product.imageAlt}
                titleHref={product.titleHref}
                title={product.title}
                price={product.price}
                sales={product.sales}
                inventoryState={product.inventoryState}
                inventoryStateClass={product.inventoryStateClass}
                onDelete={() => onDelete(product.id)} // Pass the product ID to onDelete
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductTable
