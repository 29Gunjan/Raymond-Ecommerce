import { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const showToast = {
        success: (message) => toast.success(message, {
            style: {
                background: '#0f172a',
                color: '#fff',
                padding: '16px 24px',
                borderRadius: '12px',
                border: '1px solid #1e293b',
            },
            iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
            },
        }),
        error: (message) => toast.error(message, {
            style: {
                background: '#0f172a',
                color: '#fff',
                padding: '16px 24px',
                borderRadius: '12px',
                border: '1px solid #1e293b',
            },
            iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
            },
        }),
        loading: (message) => toast.loading(message, {
            style: {
                background: '#0f172a',
                color: '#fff',
                padding: '16px 24px',
                borderRadius: '12px',
                border: '1px solid #1e293b',
            },
        }),
        dismiss: toast.dismiss,
        promise: (promise, messages) => toast.promise(promise, messages, {
            style: {
                background: '#0f172a',
                color: '#fff',
                padding: '16px 24px',
                borderRadius: '12px',
                border: '1px solid #1e293b',
            },
            success: {
                iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                },
            },
            error: {
                iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                },
            },
        }),
    };

    return (
        <ToastContext.Provider value={showToast}>
            <Toaster
                position="top-right"
                gutter={12}
                containerStyle={{ top: 80 }}
                toastOptions={{
                    duration: 3000,
                }}
            />
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export default ToastContext;
