import React from 'react'
import { MdSearch } from 'react-icons/md'

export default function Search({ value, onChange }) {
    return (
        <div className="flex items-center bg-amber-200 rounded-full px-4 py-2 gap-2">
            <MdSearch className="text-gray-700" size="1.2em" />
            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search notes..."
                className="bg-transparent outline-none text-sm text-gray-900 w-40 sm:w-56"
            />
        </div>
    )
}
