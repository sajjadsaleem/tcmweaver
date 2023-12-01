import { FC, useState, createContext, useContext, useEffect } from 'react'

const FullPageComponentLoading = () => {
  const [currTheme, setCurrTheme] = useState()
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    const currentTheme = JSON.parse(storedTheme)
    // console.log(currentTheme)
    setCurrTheme(currentTheme)


  }, [])
  return (
    <>
      <div className="fullpagecomponentLoading text-center" style={{ backgroundColor: currTheme ? '#fff' : '#242424' }}>
        <div className='page-loading'>
          <img src="graph-logo.png" height="90" alt="Logo" />
        </div>
      </div>
    </>
  )
}

export { FullPageComponentLoading };