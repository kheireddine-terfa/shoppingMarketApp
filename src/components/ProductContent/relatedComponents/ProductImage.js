import React from 'react'

const ProductImage = ({ src, alt }) => {
  return (
    <div className="relative inline-block shrink-0 border p-1 rounded-md me-3">
      <img
        src={src}
        className="w-[55px] h-[55px] inline-block shrink-0 rounded-md"
        alt={alt}
      />
    </div>
  )
}

export default ProductImage
