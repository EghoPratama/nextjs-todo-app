"use client"

import { useState, useEffect } from "react";

type User = {
    id: string
    name: string
    email: string
    role: "LEAD" | "TEAM"
}

export default function useUserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Token not found");
            setLoading(true);
            return;
        }

        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch user list");
                }

                const data = await res.json();
                setUsers(data.users);
            } catch {
                setError("Failed to fetch user");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, error, loading };
};