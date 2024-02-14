import React from 'react'
import { Filters } from '../components'

const HomeContainer = () => {
  return (
    <div className='w-full flex justify-center items-center flex-col px-4 lg:px-10 2xl:px-20'>
      {/* filters */}
      <Filters />
      {/* templatwes  */}
    </div>
  )
}

export default HomeContainer