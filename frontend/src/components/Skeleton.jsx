// Skeleton Components for Loading States

export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
            {/* Image Skeleton */}
            <div className="aspect-[3/4] bg-slate-200" />

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
                {/* Category */}
                <div className="h-3 bg-slate-200 rounded w-16" />
                {/* Title */}
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                {/* Price */}
                <div className="flex gap-2">
                    <div className="h-6 bg-slate-200 rounded w-20" />
                    <div className="h-6 bg-slate-100 rounded w-16" />
                </div>
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 8 }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(count)].map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function ProductDetailSkeleton() {
    return (
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
            {/* Image Skeleton */}
            <div className="space-y-4">
                <div className="aspect-[3/4] bg-slate-200 rounded-2xl" />
                <div className="flex gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-20 h-24 bg-slate-200 rounded-xl" />
                    ))}
                </div>
            </div>

            {/* Details Skeleton */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 space-y-6">
                <div className="h-4 bg-slate-200 rounded w-20" />
                <div className="h-10 bg-slate-200 rounded w-3/4" />
                <div className="flex gap-4">
                    <div className="h-8 bg-slate-200 rounded w-24" />
                    <div className="h-8 bg-slate-100 rounded w-20" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-full" />
                    <div className="h-4 bg-slate-100 rounded w-5/6" />
                    <div className="h-4 bg-slate-100 rounded w-4/6" />
                </div>
                <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-16" />
                    <div className="flex gap-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-12 h-12 bg-slate-200 rounded-xl" />
                        ))}
                    </div>
                </div>
                <div className="h-14 bg-slate-200 rounded-xl" />
            </div>
        </div>
    );
}

export function OrderCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse">
            <div className="flex justify-between mb-4">
                <div className="space-y-2">
                    <div className="h-5 bg-slate-200 rounded w-32" />
                    <div className="h-4 bg-slate-100 rounded w-24" />
                </div>
                <div className="h-7 bg-slate-200 rounded-full w-20" />
            </div>
            <div className="flex gap-3 mb-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-16 h-20 bg-slate-200 rounded-lg" />
                ))}
            </div>
            <div className="flex justify-between pt-4 border-t border-slate-100">
                <div className="h-4 bg-slate-100 rounded w-16" />
                <div className="h-6 bg-slate-200 rounded w-24" />
            </div>
        </div>
    );
}

export function TextSkeleton({ width = 'full', height = 4 }) {
    return (
        <div
            className={`h-${height} bg-slate-200 rounded animate-pulse`}
            style={{ width: width === 'full' ? '100%' : width }}
        />
    );
}

export function CartItemSkeleton() {
    return (
        <div className="flex gap-4 bg-white p-4 rounded-xl border border-slate-100 animate-pulse">
            <div className="w-24 h-32 bg-slate-200 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-3">
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-6 bg-slate-200 rounded w-20" />
            </div>
        </div>
    );
}

export function CategoryCardSkeleton() {
    return (
        <div className="aspect-square bg-slate-200 rounded-2xl animate-pulse" />
    );
}
