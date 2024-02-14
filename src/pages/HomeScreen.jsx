import React, { Suspense } from 'react'
import {Header} from '../components'
import { MainSpinner } from '../components'
import { Route, Routes } from 'react-router-dom'
import HomeContainer from '../containers/HomeContainer'
import {CreateResume, CreateTemplate, TemplateDesingPinDetails, UserProfile} from '../pages'

const HomeScreen = () => {
  return (
    <div className='w-full flex flex-col '>
      <Header />
      <main className='flex '>
       
       <Suspense fallback={<MainSpinner/>}>
          <Routes>
            <Route path='/' element={<HomeContainer/>}/>
            <Route path='/template/create' element={<CreateTemplate/>}/>
            <Route path='/UserProfile/:uid' element={<UserProfile/>}/>
            <Route path='/resume/*' element={<CreateResume/>}/>
            <Route path='/resumeDetails/:templateID' element={<TemplateDesingPinDetails/>}/>
          </Routes>
       </Suspense>
      </main>
    </div>
  )
}

export default HomeScreen