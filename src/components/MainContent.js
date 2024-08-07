import React from 'react'
import Form from './Form'

const MainContent = () => {
  return (
    <main className="container w-[25%] mx-auto text-center mt-[10%]">
      <div className="flex items-center w-full px-4 py-6 border border-[#AFB300] rounded-lg drop-shadow-md">
        <div className="flex-1">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-center 003248 text-[#003248]">
              MARKET PRO
            </h2>
            <p className="mt-3 text-[#003248ba]">
              Sign in to manage your market
            </p>
          </div>
          <div className="mt-8">
            <Form />
          </div>
        </div>
      </div>
    </main>
  )
}

export default MainContent
