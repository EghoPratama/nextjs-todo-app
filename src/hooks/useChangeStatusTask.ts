"use client"

import { useState} from "react";

export default function useChangeStatusTask() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateStatus = async (taskId: string, status: string) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/tasks/${taskId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status }),
            });

            if (!res.ok) {
                throw new Error("Failed to update status");
            }

            return true;
        } catch (err) {
            console.error('Status update error:', err)
            setError("Failed to update task status");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { updateStatus, loading, error };
}