import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthCallbackPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            navigate('/login?error=' + error);
            return;
        }

        if (token) {
            loginWithToken(token);
            navigate('/');
        } else {
            navigate('/login?error=no_token');
        }
    }, [searchParams, navigate, loginWithToken]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-[#DA2439] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Signing you in...</p>
            </div>
        </div>
    );
}

export default AuthCallbackPage;
