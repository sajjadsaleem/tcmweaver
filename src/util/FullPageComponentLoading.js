import { FC, useState, createContext, useContext } from 'react'

const FullPageComponentLoading = () => {
  return (
    <>
      <div className="fullpagecomponentLoading bg-white text-center">
        <div className='page-loading'>
          <img src="graph-logo.png" height="90" alt="Logo" />
        </div>
        {/* <div className="spinner-border m-1" role="status"></div> */}
        {/* <div className='mt-1'>
            <span className='text-dark'>Loading ...</span>
        </div> */}
      </div>
    </>
  )
}

export { FullPageComponentLoading };