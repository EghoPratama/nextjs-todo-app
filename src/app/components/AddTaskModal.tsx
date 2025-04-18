"use client"

import React, { useState } from "react"
import Button from "./Button";
import Input from "./Input";

type Props = {
    onAdd: (task: { title: string; description: string }) => void
    onClose: () => void
}

export default ({onAdd, onClose}: Props) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAdd({ title, description })
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                    Add New Task
                </h2>

                <Input
                    label="Title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="mb-4">
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows={4}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="error" outline onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="success">
                        Add Task
                    </Button>
                </div>
            </form>
        </div>
    );
};
