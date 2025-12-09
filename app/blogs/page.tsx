'use client';


import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchAllBlogs, Blog } from '@/lib/api';

// Blog interface is imported from lib/api.ts

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await fetchAllBlogs();
                setBlogs(data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className="page-common-box">
            this is blog container
        </div>
    );
}
