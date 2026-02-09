import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="text-center px-4">
                <h1 className="text-8xl font-bold text-[#DA2439] mb-4">404</h1>
                <h2 className="text-3xl font-heading text-white mb-4">Page Not Found</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="btn btn-primary px-8 py-3"
                    >
                        Go Home
                    </Link>
                    <Link
                        to="/products"
                        className="btn btn-secondary px-8 py-3"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
