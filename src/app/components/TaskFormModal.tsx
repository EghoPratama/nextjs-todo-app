'use client'

import React, { useState, useEffect } from 'react'
import Button from './Button'
import Input from './Input'
import Textarea from './TextArea';
import Select from './Select'

type Props = {
    onSubmit: (task: {
        title: string
        description: string
        assignee: string
        status: string
    }) => void
    onClose: () => void
    mode?: 'add' | 'edit'
    defaultValues?: {
        title: string
        description: string
        assignee: string
        status: string
    }
    userOptions: { label: string; value: string }[]
}

export default ({
    onSubmit,
    onClose,
    mode = 'add',
    defaultValues,
    userOptions,
}: Props) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [assignee, setAssignee] = useState('')
    const [status, setStatus] = useState('NOT_STARTED')

    const statusOptions = [
        { label: 'Not Started', value: 'NOT_STARTED' },
        { label: 'On Progress', value: 'ON_PROGRESS' },
        { label: 'Done', value: 'DONE' },
        { label: 'Reject', value: 'REJECT' },
    ]

    useEffect(() => {
        if (defaultValues) {
            setTitle(defaultValues.title)
            setDescription(defaultValues.description)
            setAssignee(defaultValues.assignee)
            setStatus(defaultValues.status || 'NOT_STARTED')
        }
    }, [defaultValues])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ title, description, assignee, status })
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                    {mode === 'add' ? 'Add New Task' : 'Edit Task'}
                </h2>

                <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Textarea
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Select
                    label="Assign to"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    options={userOptions}
                />
                <Select
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={statusOptions}
                />

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="error" outline onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="success">
                        {mode === 'add' ? 'Add Task' : 'Update Task'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
