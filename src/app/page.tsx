'use client'

import { useState } from 'react';
import TaskCard from '@/components/TaskCard';
import Button from '@/components/Button';
import AddTaskModal from '@/components/AddTaskModal';
import TaskFormModal from "@/components/TaskFormModal";
import useTaskList from "@/hooks/useTaskList";
import useChangeStatusTask from "@/hooks/useChangeStatusTask";
import useUserList from "@/hooks/useUserList";

type Task = {
  id: string
  title: string
  description: string
  status: string
  assignee_name: string
  assignee_id: string
}

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const { tasks, setTasks, loading } = useTaskList();
  const { updateStatus } = useChangeStatusTask();
  const { users } = useUserList();

  const userOptions = users.map(user => ({
    label: user.name,
    value: user.id,
  }))

  const handleAddTask = () => {
    // TODO: fetch ulang atau update list setelah nambah task
  }
  const handleEdit = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    const success = await updateStatus(taskId, newStatus);
    if (success) {
      setTasks((prev) =>
          prev.map((task) =>
              task.id === taskId ? { ...task, status: newStatus } : task
          )
      )
    }
  }

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Task Dashboard
          </h1>
          <Button onClick={() => setIsModalOpen(true)}>+ Add Task</Button>
        </div>

        {loading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading tasks...</p>
        ) : tasks.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No tasks found.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                  <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => handleEdit(task)}
                      onStatusChange={(status) => handleStatusChange(task.id, status)}
                  />
              ))}
            </div>
        )}

        {isModalOpen && (
            <TaskFormModal
                onSubmit={handleAddTask}
                onClose={() => setIsModalOpen(false)}
                userOptions={userOptions}
            />
        )}


      </div>
  )
}
