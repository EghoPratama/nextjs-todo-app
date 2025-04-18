import React from "react";

type Option = {
    label: string
    value: string
}

type SelectProps = {
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: Option[]
}

export default function Select({ label, value, onChange, options }: SelectProps) {
    return (
        <div className="mb-4">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            <select
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
                <option value="">-- Select --</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
