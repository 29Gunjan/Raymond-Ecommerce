import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.put('/auth/password', data)
};

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getBySlug: (slug) => api.get(`/products/${slug}`),
    search: (query) => api.get('/products', { params: { search: query } })
};

// Categories API
export const categoriesAPI = {
    getAll: () => api.get('/categories'),
    getBySlug: (slug) => api.get(`/categories/${slug}`)
};

// Cart API
export const cartAPI = {
    get: () => api.get('/cart'),
    add: (data) => api.post('/cart/add', data),
    updateItem: (itemId, quantity) => api.put(`/cart/item/${itemId}`, { quantity }),
    removeItem: (itemId) => api.delete(`/cart/item/${itemId}`),
    clear: () => api.delete('/cart/clear')
};

// Orders API
export const ordersAPI = {
    getAll: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post('/orders', data),
    cancel: (id) => api.put(`/orders/${id}/cancel`)
};

// Payment API (Razorpay)
export const paymentAPI = {
    getKey: () => api.get('/payment/key'),
    createOrder: (data) => api.post('/payment/create-order', data),
    verifyPayment: (data) => api.post('/payment/verify', data),
    handleFailure: (data) => api.post('/payment/failed', data)
};

// Reviews API
export const reviewsAPI = {
    getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
    add: (data) => api.post('/reviews', data),
    update: (id, data) => api.put(`/reviews/${id}`, data),
    delete: (id) => api.delete(`/reviews/${id}`)
};

// Wishlist API
export const wishlistAPI = {
    get: () => api.get('/wishlist'),
    add: (productId) => api.post('/wishlist/add', { productId }),
    remove: (productId) => api.delete(`/wishlist/remove/${productId}`),
    check: (productId) => api.get(`/wishlist/check/${productId}`)
};

// Addresses API
export const addressesAPI = {
    getAll: () => api.get('/addresses'),
    add: (data) => api.post('/addresses', data),
    update: (id, data) => api.put(`/addresses/${id}`, data),
    delete: (id) => api.delete(`/addresses/${id}`),
    setDefault: (id) => api.put(`/addresses/${id}/default`)
};

// Admin API
export const adminAPI = {
    // Dashboard
    getStats: () => api.get('/admin/stats'),

    // Products
    getProducts: (params) => api.get('/admin/products', { params }),
    createProduct: (data) => api.post('/admin/products', data),
    updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/admin/products/${id}`),

    // Orders
    getOrders: (params) => api.get('/admin/orders', { params }),
    getOrder: (id) => api.get(`/admin/orders/${id}`),
    updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),

    // Users
    getUsers: () => api.get('/admin/users'),
    updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),

    // Categories
    getCategories: () => api.get('/categories'),
    createCategory: (data) => api.post('/admin/categories', data),
    updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/admin/categories/${id}`)
};

export default api;
