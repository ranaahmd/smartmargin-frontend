import React from 'react';

export function CardSkeleton({ count = 3 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-amber-100 rounded-2xl p-6 animate-pulse">
                    <div className="h-40 bg-amber-200 rounded-xl mb-4" />
                    <div className="h-5 bg-amber-200 rounded w-2/3 mx-auto mb-3" />
                    <div className="h-4 bg-amber-200 rounded w-1/2 mx-auto" />
                </div>
            ))}
        </div>
    );
}

export function RowSkeleton({ rows = 4 }) {
    return (
        <div className="space-y-3 animate-pulse">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="h-12 bg-amber-100 rounded-lg" />
            ))}
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-amber-100 rounded-2xl p-6 h-28" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-amber-100 rounded-2xl h-72" />
                <div className="bg-amber-100 rounded-2xl h-72" />
            </div>
        </div>
    );
}
