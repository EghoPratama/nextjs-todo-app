"use client"

import { useState} from "react";
import { useRouter} from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function useLogin() {
    const router = useRouter();
    const { setUser } = useUserStore();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.message || "Login failed");
                return false;
            }

            const { token } = await res.json();
            localStorage.setItem("token", token);

            const meRes = await fetch("/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!meRes.ok) {
                setError('Failed to fetch user info');
                return false;
            }

            const meData = await meRes.json();
            setUser(meData.user);

            router.push("/");
            return true;
        } catch (err) {
            console.error('Login error:', err);
            setError('Something went wrong');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};