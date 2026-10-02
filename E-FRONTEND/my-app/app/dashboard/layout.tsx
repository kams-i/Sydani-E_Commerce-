import type { ReactNode } from 'react';
import ProtectedRoute from '@/src/components/protected-route';

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}