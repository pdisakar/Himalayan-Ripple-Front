'use client';

import React, { useState } from 'react';
import { Blog, fetchBlogs } from '@/lib/api';
import { BlogCard } from '@/components/Cards/BlogCard/BlogCard';

interface BlogListProps {
    initialBlogs: Blog[];
    totalCount: number;
}

export const BlogList: React.FC<BlogListProps> = ({ initialBlogs, totalCount }) => {
    const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialBlogs.length < totalCount);

    const loadMore = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const nextPage = page + 1;
            const { data, total } = await fetchBlogs(nextPage, 6);
            
            setBlogs(prev => [...prev, ...data]);
            setPage(nextPage);
            setHasMore(blogs.length + data.length < total);
        } catch (error) {
            console.error('Error loading more blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {blogs.length === 0 ? (
                <div className="text-center py-20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No blogs found</h3>
                    <p className="text-gray-600">Check back later for new stories.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="mt-12 text-center">
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading...
                                    </>
                                ) : (
                                    'Load More Stories'
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
