import type { ReactNode } from 'react';
import ProtectedRoute from '@/src/components/protected-route';

export default function CartLayout({ children }: Readonly<{ children: ReactNode }>) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}