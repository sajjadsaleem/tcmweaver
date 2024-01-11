import { FC, useState, createContext, useContext, useEffect } from 'react'

const FullPageComponentLoading = () => {
  const [currTheme, setCurrTheme] = useState(null)

  // console.log('currtheme', currTheme)
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    const currentTheme = JSON.parse(storedTheme)
    // console.log(currentTheme)
    setCurrTheme(currentTheme)


  }, [])
  return (
    <>
      {currTheme != null && (
        <div className="fullpagecomponentLoading text-center" style={{ backgroundColor: currTheme ? '#fff' : '#242424' }}>
          <div className='page-loading'>
            {currTheme ? (
              <img src="graph-logo-light.png" height="90" alt="Logo" />
            ) : (
              <img src="graph-logoold.png" height="90" alt="Logo" />
            )}

          </div>
        </div>

      )}

    </>
  )
}

export { FullPageComponentLoading };