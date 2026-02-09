import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
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
        <div className="min-h-screen bg-slate-50">
            {/* Page Header */}
            <div className="bg-white border-b border-slate-100 py-14">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-heading text-slate-900" data-aos="fade-up">
                        {currentCategory?.name || 'All Products'}
                    </h1>
                    {filters.search && (
                        <p className="mt-3 text-slate-600 text-lg" data-aos="fade-up" data-aos-delay="100">
                            Search results for: "<span className="text-[#DA2439] font-medium">{filters.search}</span>"
                        </p>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-28">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-slate-900">Filters</h2>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-[#DA2439] hover:text-[#b91d30] font-medium transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Categories */}
                            <div className="mb-8">
                                <h3 className="font-semibold mb-4 text-slate-900">Category</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={!filters.category}
                                            onChange={() => handleFilterChange('category', '')}
                                            className="w-5 h-5 text-[#DA2439] bg-white border-slate-300 focus:ring-[#DA2439]"
                                        />
                                        <span className="text-slate-600 group-hover:text-slate-900 transition-colors">All Categories</span>
                                    </label>
                                    {categories.map(cat => (
                                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={filters.category === cat.slug}
                                                onChange={() => handleFilterChange('category', cat.slug)}
                                                className="w-5 h-5 text-[#DA2439] bg-white border-slate-300 focus:ring-[#DA2439]"
                                            />
                                            <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-4 text-slate-900">Price Range</h3>
                                <div className="flex gap-3">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                            <p className="text-slate-600">
                                Showing <span className="font-semibold text-slate-900">{products.length}</span> of <span className="font-semibold text-slate-900">{pagination.total}</span> products
                            </p>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                        Filters
                                    </span>
                                </button>
                                <select
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#DA2439] focus:border-transparent"
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
                            <ProductGridSkeleton count={12} />
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                                <div className="w-20 h-20 mx-auto mb-6 text-slate-300">
                                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">No products found</h2>
                                <p className="text-slate-500 mb-6">Try adjusting your filters or search criteria</p>
                                <button onClick={clearFilters} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors">
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
                                    <div className="flex justify-center gap-2 mt-14">
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                            disabled={pagination.page === 1}
                                            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setPagination(prev => ({ ...prev, page }))}
                                                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${pagination.page === page
                                                    ? 'bg-slate-900 text-white shadow-lg'
                                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                            disabled={pagination.page === pagination.pages}
                                            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
