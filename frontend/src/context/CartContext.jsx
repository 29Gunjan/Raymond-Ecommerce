import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState({ items: [], subtotal: 0, itemCount: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCart({ items: [], subtotal: 0, itemCount: 0 });
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await cartAPI.get();
            setCart(response.data);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, variantId, quantity = 1) => {
        try {
            setLoading(true);
            const response = await cartAPI.add({ productId, variantId, quantity });
            setCart(response.data);
            return true;
        } catch (error) {
            console.error('Failed to add to cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            setLoading(true);
            const response = await cartAPI.updateItem(itemId, quantity);
            setCart(response.data);
        } catch (error) {
            console.error('Failed to update quantity:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (itemId) => {
        try {
            setLoading(true);
            const response = await cartAPI.removeItem(itemId);
            setCart(response.data);
        } catch (error) {
            console.error('Failed to remove item:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            setLoading(true);
            await cartAPI.clear();
            setCart({ items: [], subtotal: 0, itemCount: 0 });
        } catch (error) {
            console.error('Failed to clear cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        fetchCart,
        itemCount: cart.itemCount || 0
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
