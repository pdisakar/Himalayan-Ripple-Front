'use client';

import { useState, useEffect, useRef } from 'react';
import { Package, searchPackages } from '@/lib/api';
import Link from 'next/link';
import { IMAGE_URL } from '@/lib/constants';
import Image from 'next/image';

interface HomeSearchProps {
    initialQuery?: string;
    onQueryChange?: (query: string) => void;
    onResultClick?: () => void;
}

export default function HomeSearch({ initialQuery = '', onQueryChange, onResultClick }: HomeSearchProps = {}) {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<Package[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Sync query when initialQuery changes from parent
    useEffect(() => {
        if (initialQuery !== undefined && initialQuery !== query) {
            setQuery(initialQuery);
        }
    }, [initialQuery]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 0) {
                setLoading(true);
                try {
                    const data = await searchPackages(query);
                    setResults(data);
                    setIsOpen(true);
                } catch (error) {
                    console.error('Search error:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto z-10">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (query.trim().length > 0) setIsOpen(true);
                    }}
                    onFocus={() => {
                        if (query.trim().length > 0) setIsOpen(true);
                    }}
                    placeholder="Places to go, things to do, hotels..."
                    className="w-full px-4 py-3.5 pl-12 pr-28 rounded-full border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-[0_2px_2px_rgba(0,0,0,0.07)] text-gray-900 bg-white"
                />
                <svg
                    className="absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-400"
                    width="20"
                    height="20">
                    <use
                        xlinkHref="/icons.svg#headersearch"
                        fill="currentColor"></use>
                </svg>
                <button className="absolute right-[4px] top-[4px] bottom-[4px] bg-primary text-white font-medium hover:cursor-pointer px-6 rounded-full transition-colors">
                    Search
                </button>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border  border-gray-100 max-h-96 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Loading...</div>
                    ) : results.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {results.map((pkg) => (
                                <Link
                                    key={pkg.id}
                                    href={`/${pkg.slug}`}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        setIsOpen(false);
                                        if (onResultClick) onResultClick();
                                    }}
                                >
                                    <div className="h-16 w-24 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                        <Image
                                            src={pkg.featuredImage ? `${IMAGE_URL}${pkg.featuredImage}` : '/placeholder.jpg'}
                                            alt={pkg.title}
                                            fill
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 truncate">{pkg.title}</h4>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <span>{pkg.duration} {pkg.durationUnit}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500">No packages found</div>
                    )}
                </div>
            )}
        </div>
    );
}
