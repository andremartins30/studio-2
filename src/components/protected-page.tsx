'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from "@/components/app-layout";
import { useAuth } from "@/contexts/auth-context";

interface ProtectedPageProps {
    children: React.ReactNode;
}

export function ProtectedPage({ children }: ProtectedPageProps) {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !token) {
            router.push('/login');
        }
    }, [isLoading, token, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Carregando...</div>
            </div>
        );
    }

    if (!token || !user) {
        return null; // Redirect está sendo tratado no useEffect
    }

    return <AppLayout>{children}</AppLayout>;
}
