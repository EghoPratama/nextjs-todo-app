'use client'

import React, { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

type InputProps = {
    label: string
    type?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default ({label, type = 'text', value, onChange}: InputProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
        <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                {label}
            </label>
            <div className="relative">
                <input
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300 focus:outline-none"
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                            <EyeIcon className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}
