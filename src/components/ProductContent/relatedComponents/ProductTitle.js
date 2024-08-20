import React from 'react'

const ProductTitle = ({ href, title }) => {
  return (
    <div className="flex flex-col justify-start">
      <a
        href={href}
        className="mb-1 font-semibold transition-colors duration-200 ease-in-out text-lg/normal text-secondary-inverse hover:text-primary"
      >
        {title}
      </a>
    </div>
  )
}

export default ProductTitle
