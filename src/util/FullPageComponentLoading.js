import { FC, useState, createContext, useContext } from 'react'

const FullPageComponentLoading = () => {
  return (
    <>
      <div className="fullpagecomponentLoading text-center" style={{ backgroundColor: '#fff' }}>
        <div className='page-loading'>
          <img src="graph-logo.png" height="90" alt="Logo" />
        </div>
      </div>
    </>
  )
}

export { FullPageComponentLoading };