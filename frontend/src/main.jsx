import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import './styles/index.css'

function Root() {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
        });
    }, []);

    return (
        <React.StrictMode>
            <BrowserRouter>
                <AuthProvider>
                    <CartProvider>
                        <ToastProvider>
                            <App />
                        </ToastProvider>
                    </CartProvider>
                </AuthProvider>
            </BrowserRouter>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
