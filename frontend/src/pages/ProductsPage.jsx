import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productsAPI, categoriesAPI } from '../services/api';

function ProductsPage() {
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        category: slug || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || 'newest',
        search: searchParams.get('search') || ''
    });

    useEffect(() => {
        if (slug) {
            setFilters(prev => ({ ...prev, category: slug }));
        }
    }, [slug]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    productsAPI.getAll({
                        category: filters.category,
                        minPrice: filters.minPrice,
                        maxPrice: filters.maxPrice,
                        sort: filters.sort,
                        search: filters.search,
                        page: pagination.page,
                        limit: 12
                    }),
                    categoriesAPI.getAll()
                ]);
                setProducts(productsRes.data.products || []);
                setPagination(productsRes.data.pagination || { page: 1, pages: 1, total: 0 });
                setCategories(categoriesRes.data || []);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [filters, pagination.page]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            sort: 'newest',
            search: ''
        });
    };

    const currentCategory = categories.find(c => c.slug === filters.category);

    return (
        <div className="min-h-screen">
            {/* Page Header */}
            <div className="bg-[#12121a] border-b border-gray-800 py-12">
                <div className="container">
                    <h1 className="text-3xl md:text-4xl font-heading text-white">
                        {currentCategory?.name || 'All Products'}
                    </h1>
                    {filters.search && (
                        <p className="mt-2 text-gray-400">
                            Search results for: "{filters.search}"
                        </p>
                    )}
                </div>
            </div>

            <div className="container py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-[#12121a] rounded-xl p-6 border border-gray-800 sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-white">Filters</h2>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <h3 className="font-medium mb-3 text-white">Category</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={!filters.category}
                                            onChange={() => handleFilterChange('category', '')}
                                            className="w-4 h-4 text-amber-500 bg-gray-800 border-gray-600 focus:ring-amber-500 focus:ring-offset-gray-900"
                                        />
                                        <span className="text-sm text-gray-300">All Categories</span>
                                    </label>
                                    {categories.map(cat => (
                                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={filters.category === cat.slug}
                                                onChange={() => handleFilterChange('category', cat.slug)}
                                                className="w-4 h-4 text-amber-500 bg-gray-800 border-gray-600 focus:ring-amber-500 focus:ring-offset-gray-900"
                                            />
                                            <span className="text-sm text-gray-300">{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h3 className="font-medium mb-3 text-white">Price Range</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                            <p className="text-gray-400">
                                Showing {products.length} of {pagination.total} products
                            </p>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden btn btn-secondary btn-sm"
                                >
                                    Filters
                                </button>
                                <select
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="px-4 py-2 bg-[#12121a] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name: A-Z</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="loading-container">
                                <div className="spinner"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <h2 className="empty-state-title">No products found</h2>
                                <p className="empty-state-text">Try adjusting your filters or search criteria</p>
                                <button onClick={clearFilters} className="btn btn-primary">
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div className="flex justify-center gap-2 mt-12">
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                            disabled={pagination.page === 1}
                                            className="btn btn-secondary btn-sm disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setPagination(prev => ({ ...prev, page }))}
                                                className={`btn btn-sm ${pagination.page === page ? 'btn-primary' : 'btn-ghost'}`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                            disabled={pagination.page === pagination.pages}
                                            className="btn btn-secondary btn-sm disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default ProductsPage;
