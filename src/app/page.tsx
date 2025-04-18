'use client'

import { useEffect, useState } from 'react'
import TaskCard from '@/components/TaskCard'
import Button from '@/components/Button'
import AddTaskModal from '@/components/AddTaskModal'
import { useRouter } from 'next/navigation'

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
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleAddTask = () => {
    // TODO: fetch ulang atau update list setelah nambah task
  }

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const res = await fetch('/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error('Failed to fetch tasks')
        }

        const data = await res.json()
        setTasks(data.tasks)
      } catch (error) {
        console.error('❌ Error fetching tasks:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [router])

  const handleEdit = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
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
                  />
              ))}
            </div>
        )}

        {isModalOpen && (
            <AddTaskModal
                onAdd={handleAddTask}
                onClose={() => setIsModalOpen(false)}
            />
        )}
      </div>
  )
}
