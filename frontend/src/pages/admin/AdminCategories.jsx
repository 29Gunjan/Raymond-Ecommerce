import { useState, useEffect } from 'react';
import { categoriesAPI, adminAPI } from '../../services/api';

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', description: '', image: '' });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await categoriesAPI.getAll();
            setCategories(res.data || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await adminAPI.updateCategory(editingId, formData);
                setMessage({ type: 'success', text: 'Category updated successfully!' });
            } else {
                await adminAPI.createCategory(formData);
                setMessage({ type: 'success', text: 'Category created successfully!' });
            }
            setFormData({ name: '', description: '', image: '' });
            setEditingId(null);
            fetchCategories();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to save category' });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            description: category.description || '',
            image: category.image || ''
        });
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await adminAPI.deleteCategory(id);
            setCategories(categories.filter(c => c.id !== id));
            setMessage({ type: 'success', text: 'Category deleted!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete category' });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({ name: '', description: '', image: '' });
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
                <div className="container">
                    <h1 className="text-3xl font-heading text-white">Categories</h1>
                    <p className="text-gray-400 mt-1">{categories.length} categories</p>
                </div>
            </div>

            <div className="container py-8">
                {message && (
                    <div className={`mb-6 px-4 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800 sticky top-24">
                            <h2 className="text-lg font-semibold mb-4 text-white">
                                {editingId ? 'Edit Category' : 'Add Category'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="form-group">
                                    <label className="form-label">Name</label>
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
                                        className="form-input h-20 resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Image URL</label>
                                    <input
                                        type="url"
                                        className="form-input"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="btn btn-primary flex-1">
                                        {editingId ? 'Update' : 'Add'}
                                    </button>
                                    {editingId && (
                                        <button type="button" onClick={handleCancel} className="btn btn-secondary">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Categories Grid */}
                    <div className="lg:col-span-2">
                        <div className="grid md:grid-cols-2 gap-4">
                            {categories.map(category => (
                                <div key={category.id} className="bg-[#12121a] rounded-xl overflow-hidden border border-gray-800">
                                    <div className="h-32 bg-gray-900 overflow-hidden">
                                        {category.image ? (
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-white">{category.name}</h3>
                                            <span className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">
                                                {category._count?.products || 0} products
                                            </span>
                                        </div>
                                        {category.description && (
                                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{category.description}</p>
                                        )}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminCategories;
