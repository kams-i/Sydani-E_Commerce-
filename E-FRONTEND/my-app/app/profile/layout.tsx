import type { ReactNode } from 'react';
import ProtectedRoute from '@/src/components/protected-route';

export default function ProfileLayout({ children }: Readonly<{ children: ReactNode }>) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}