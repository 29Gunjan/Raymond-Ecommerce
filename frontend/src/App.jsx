import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Particles from './components/Particles';
import FloatingLights from './components/FloatingLights';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import WishlistPage from './pages/WishlistPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import MyReturnsPage from './pages/MyReturnsPage';
import ReturnDetailPage from './pages/ReturnDetailPage';

// Support & Company Pages
import TrackOrderPage from './pages/TrackOrderPage';
import ReturnsPage from './pages/ReturnsPage';
import ShippingPage from './pages/ShippingPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import StoreLocatorPage from './pages/StoreLocatorPage';
import StyleBlogPage from './pages/StyleBlogPage';
import SizeGuidePage from './pages/SizeGuidePage';
import EmailPreferencesPage from './pages/EmailPreferencesPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { ForgotPasswordPage, ResetPasswordPage } from './pages/ResetPasswordPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminReturns from './pages/admin/AdminReturns';
import ChatWidget from './components/ChatWidget';

// Admin Route Wrapper
function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function App() {
    return (
        <div className="app relative">
            {/* Particle Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Particles
                    particleColors={['#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7']}
                    particleCount={80}
                    particleSpread={15}
                    speed={0.02}
                    particleBaseSize={80}
                    moveParticlesOnHover={true}
                    particleHoverFactor={0.4}
                    alphaParticles={true}
                    sizeRandomness={0.7}
                    cameraDistance={35}
                    disableRotation={false}
                    pixelRatio={1}
                />
            </div>

            {/* Floating Ambient Lights */}
            <FloatingLights />

            <div className="relative z-10">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:slug" element={<ProductDetailPage />} />
                        <Route path="/category/:slug" element={<ProductsPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/auth/callback" element={<AuthCallbackPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route
                            path="/checkout"
                            element={
                                <ProtectedRoute>
                                    <CheckoutPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/orders"
                            element={
                                <ProtectedRoute>
                                    <OrdersPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/orders/:id"
                            element={
                                <ProtectedRoute>
                                    <OrderDetailPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/wishlist"
                            element={
                                <ProtectedRoute>
                                    <WishlistPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/my-returns"
                            element={
                                <ProtectedRoute>
                                    <MyReturnsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/my-returns/:id"
                            element={
                                <ProtectedRoute>
                                    <ReturnDetailPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/products"
                            element={
                                <AdminRoute>
                                    <AdminProducts />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/orders"
                            element={
                                <AdminRoute>
                                    <AdminOrders />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <AdminRoute>
                                    <AdminUsers />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/categories"
                            element={
                                <AdminRoute>
                                    <AdminCategories />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/returns"
                            element={
                                <AdminRoute>
                                    <AdminReturns />
                                </AdminRoute>
                            }
                        />

                        {/* Support Pages */}
                        <Route path="/track-order" element={<TrackOrderPage />} />
                        <Route path="/returns" element={<ReturnsPage />} />
                        <Route path="/shipping" element={<ShippingPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/contact" element={<ContactPage />} />

                        {/* Company Pages */}
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/careers" element={<CareersPage />} />
                        <Route path="/stores" element={<StoreLocatorPage />} />
                        <Route path="/blog" element={<StyleBlogPage />} />
                        <Route path="/size-guide" element={<SizeGuidePage />} />
                        <Route path="/email-preferences" element={<EmailPreferencesPage />} />

                        {/* 404 Not Found */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
            <ChatWidget />
        </div>
    );
}

export default App;


