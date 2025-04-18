"use client"

import React, { useState} from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";

export default function LoginPage () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.message || "Login Failed");
                return
            }

            const { token } = await res.json();

            localStorage.setItem("token", token);

            router.push("/");
        } catch (error) {
            console.log(error);
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <form
                onSubmit={handleLogin}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
                    Login
                </h2>

                {error && (
                    <p className="mb-4 text-sm text-red-500 font-medium">{error}</p>
                )}

                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    type="submit"
                    loading={loading}
                    className="mt-4 w-full"
                >
                    Login
                </Button>
            </form>
        </div>
    );
};