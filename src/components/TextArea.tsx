// components/Textarea.tsx
import React from "react";

type Props = {
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export default function Textarea({ label, value, onChange }: Props) {
    return (
        <div className="mb-4">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            <textarea
                value={value}
                onChange={onChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
        </div>
    )
}
