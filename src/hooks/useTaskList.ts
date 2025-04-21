"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Task = {
    id: string
    title: string
    description: string
    status: string
    assignee_name: string
    assignee_id: string
};

export default function useTaskList () {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push("/login")
                return;
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
        };

        fetchTasks();
    }, [router]);

    return { tasks, setTasks, loading }
};