import { useState, useEffect } from 'react';
import { adminAPI, categoriesAPI } from '../../services/api';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        comparePrice: '',
        categoryId: '',
        images: [''],
        featured: false,
        isNew: false
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                adminAPI.getProducts({ limit: 100 }),
                categoriesAPI.getAll()
            ]);
            setProducts(productsRes.data?.products || []);
            setCategories(categoriesRes.data || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
                images: formData.images.filter(img => img.trim())
            };

            if (editingProduct) {
                await adminAPI.updateProduct(editingProduct.id, data);
            } else {
                await adminAPI.createProduct(data);
            }

            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            alert('Failed to save product: ' + (error.response?.data?.error || 'Unknown error'));
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            comparePrice: product.comparePrice?.toString() || '',
            categoryId: product.categoryId,
            images: product.images?.length ? product.images : [''],
            featured: product.featured || false,
            isNew: product.isNew || false
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await adminAPI.deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            comparePrice: '',
            categoryId: '',
            images: [''],
            featured: false,
            isNew: false
        });
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const updateImage = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-[#12121a] border-b border-gray-800 py-8">
                <div className="container flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-heading text-white">Products</h1>
                        <p className="text-gray-400 mt-1">{products.length} products</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="btn btn-primary"
                    >
                        + Add Product
                    </button>
                </div>
            </div>

            <div className="container py-8">
                {/* Products Table */}
                <div className="bg-[#12121a] rounded-xl border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900">
                                <tr className="text-left text-sm text-gray-400">
                                    <th className="px-6 py-4 font-medium">Product</th>
                                    <th className="px-6 py-4 font-medium">Category</th>
                                    <th className="px-6 py-4 font-medium">Price</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-16 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={product.images?.[0] || 'https://via.placeholder.com/48x64'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/48x64'; }}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{product.name}</p>
                                                    <p className="text-xs text-gray-500">{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{product.category?.name}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-amber-500">{formatPrice(product.price)}</p>
                                            {product.comparePrice && (
                                                <p className="text-xs text-gray-500 line-through">{formatPrice(product.comparePrice)}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1">
                                                {product.featured && <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-xs rounded border border-amber-500/30">Featured</span>}
                                                {product.isNew && <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/30">New</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="px-3 py-1 text-sm text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="px-3 py-1 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#12121a] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
                        <div className="p-6 border-b border-gray-800">
                            <h2 className="text-xl font-semibold text-white">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="form-group">
                                <label className="form-label">Product Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input h-24 resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Price (₹)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Compare Price (₹)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.comparePrice}
                                        onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Images</label>
                                {formData.images.map((img, i) => (
                                    <input
                                        key={i}
                                        type="url"
                                        className="form-input mb-2"
                                        value={img}
                                        onChange={(e) => updateImage(i, e.target.value)}
                                        placeholder="Image URL"
                                    />
                                ))}
                                <button type="button" onClick={addImageField} className="text-sm text-amber-500 hover:text-amber-400 transition-colors">
                                    + Add another image
                                </button>
                            </div>

                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500"
                                    />
                                    <span>Featured Product</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={formData.isNew}
                                        onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500"
                                    />
                                    <span>New Arrival</span>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-800">
                                <button type="submit" className="btn btn-primary">
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;
