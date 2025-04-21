import React from "react";
import clsx from "clsx";
import { useUserStore } from "@/store/useUserStore";

type Task = {
    id: string
    title: string
    description: string
    status: 'NOT_STARTED' | 'ON_PROGRESS' | 'DONE' | 'REJECT'
    assignee_name: string
    assignee_id: string
}

const statusColors = {
    NOT_STARTED: "bg-gray-300 text-gray-800",
    ON_PROGRESS: "bg-blue-500 text-white",
    DONE: "bg-green-600 text-white",
    REJECT: "bg-red-600 text-white",
}

type Props = {
    task: Task
    onEdit?: () => void
    onStatusChange?: (status: Task['status']) => void
}

const statusOptions = [
    { label: 'Not Started', value: 'NOT_STARTED' },
    { label: 'On Progress', value: 'ON_PROGRESS' },
    { label: 'Done', value: 'DONE' },
    { label: 'Reject', value: 'REJECT' },
]

export default function TaskCard({ task, onEdit, onStatusChange }: Props) {
    const { user } = useUserStore();

    const canEdit = user?.role === "LEAD";
    const canChangeStatus = user?.role === "LEAD" || user?.id === task?.assignee_id;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 relative">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {task.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Assigned to: {task.assignee_name}</p>
                </div>
                {onEdit && canEdit && (
                    <button
                        onClick={onEdit}
                        className="text-sm text-blue-500 hover:underline mt-4 cursor-pointer"
                    >
                        Edit
                    </button>
                )}
            </div>

            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{task.description}</p>

            {canChangeStatus && onStatusChange ? (
                <select
                    value={task.status}
                    onChange={(e) => onStatusChange(e.target.value as Task['status'])}
                    className="text-sm px-2 py-1 border rounded-md"
                >
                    {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>
                            {s.label}
                        </option>
                    ))}
                </select>
            ) : (
                <span
                    className={clsx(
                        'absolute top-2 right-2 text-xs px-2 py-1 rounded-full',
                        statusColors[task.status]
                    )}
                >
                    {task.status.replace('_', ' ')}
                </span>
            )}
        </div>
    )
};

