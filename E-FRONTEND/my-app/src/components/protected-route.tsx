'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { userAPI } from '@/src/lib/api';

type AuthStatus = 'checking' | 'authenticated' | 'error';

export default function ProtectedRoute({ children }: Readonly<{ children: ReactNode }>) {
    const router = useRouter();
    const [status, setStatus] = useState<AuthStatus>('checking');
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let active = true;

        const verifySession = async () => {
            const token = localStorage.getItem('token');
            if (!token || token === 'undefined' || token === 'null') {
                router.replace('/');
                return;
            }

            try {
                await userAPI.getCurrentUser();
                if (active) setStatus('authenticated');
            } catch (error) {
                const statusCode = (error as { response?: { status?: number } }).response?.status;

                if (statusCode === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    if (active) router.replace('/');
                    return;
                }

                if (active) setStatus('error');
            }
        };

        verifySession();
        return () => {
            active = false;
        };
    }, [retryCount, router]);

    if (status === 'authenticated') return <>{children}</>;

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#E8C6B5] p-6 text-center text-[#5A3A33]">
            {status === 'checking' ? (
                <>
                    <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
                    <p className="text-sm font-medium" role="status">Checking your session...</p>
                </>
            ) : (
                <>
                    <p className="text-sm font-medium">Unable to verify your session. Check your connection and try again.</p>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setStatus('checking');
                                setRetryCount((count) => count + 1);
                            }}
                            className="rounded-lg bg-[#5A3A33] px-4 py-2 text-sm font-semibold text-white"
                        >
                            Retry
                        </button>
                        <button
                            type="button"
                            onClick={() => router.replace('/')}
                            className="rounded-lg border border-[#5A3A33] px-4 py-2 text-sm font-semibold"
                        >
                            Sign in
                        </button>
                    </div>
                </>
            )}
        </main>
    );
}