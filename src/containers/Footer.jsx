import React from 'react'
import { Logo } from '../assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='w-full flex items-center justify-between border-t border-gray-300'>
        <div className='flex items-center gap-2 pt-2'>
            <img className='w-6 h-auto object-contain' src={Logo} alt='logo' />
            <p>resume-builder</p>
        </div>
        <div className='flex items-center justify-center gap-2'>
            <Link to={'/'} className='text-blue-700 text-sm'>home</Link>
            <Link to={'/'} className='text-blue-700 text-sm'>contact</Link>
            <Link to={'/'} className='text-blue-700 text-sm whitespace-nowrap'>Privacy Policy</Link>
        </div>
    </div>
  )
}

export default Footer