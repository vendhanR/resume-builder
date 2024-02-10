import React from 'react'
import { PropagateLoader } from 'react-spinners'

const MainSpinner = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
        <PropagateLoader color='#489FCD' size={20} />

    </div>
  )
}

export default MainSpinner;