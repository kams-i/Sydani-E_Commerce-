'use client';

import { useState, type ComponentProps } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type PasswordInputProps = Omit<ComponentProps<'input'>, 'type'> & {
    toggleLabel?: string;
};

export default function PasswordInput({
    className = '',
    toggleLabel = 'password',
    ...inputProps
}: PasswordInputProps) {
    const [visible, setVisible] = useState(false);
    const action = visible ? 'Hide' : 'Show';

    return (
        <div className="relative">
            <input
                {...inputProps}
                type={visible ? 'text' : 'password'}
                className={`${className} pr-10`}
            />
            <button
                type="button"
                onClick={() => setVisible((current) => !current)}
                aria-label={`${action} ${toggleLabel}`}
                aria-pressed={visible}
                title={`${action} ${toggleLabel}`}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-current opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
                {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
        </div>
    );
}