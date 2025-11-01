import React from 'react'
import { MdDeleteForever } from 'react-icons/md'
export default function () {
  return (
    <div className='note'>
        <span>Hello! first note</span>
        <div className='note-footer'>
            <small>31/10/2025</small>
            <MdDeleteForever className='delete-icon' size='1.3em'/>
        </div>
    </div>
  )
}
