'use client';

import { useState } from 'react';

/**
 * Revalidation Control Panel
 * 
 * Add this component to your admin dashboard to easily trigger cache revalidation.
 * 
 * Usage:
 * import { RevalidationPanel } from '@/components/RevalidationPanel';
 * <RevalidationPanel />
 */

export function RevalidationPanel() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedPaths, setSelectedPaths] = useState<string[]>([]);

    const commonPaths = [
        { path: '/', label: 'Homepage' },
        { path: '/about', label: 'About Page' },
        { path: '/contact', label: 'Contact Page' },
        { path: '/packages', label: 'Packages List' },
        { path: '/places', label: 'Places List' },
        { path: '/blogs', label: 'Blogs List' },
        { path: '/testimonials', label: 'Testimonials List' },
    ];

    const handleRevalidate = async (revalidateAll: boolean = false) => {
        setLoading(true);
        setMessage('');

        try {
            const secret = prompt('Enter revalidation secret:');
            if (!secret) {
                setMessage('❌ Secret is required');
                setLoading(false);
                return;
            }

            const body: any = { secret };

            if (revalidateAll) {
                body.revalidateAll = true;
            } else if (selectedPaths.length > 0) {
                body.paths = selectedPaths;
            } else {
                setMessage('❌ Please select at least one path or use "Revalidate All"');
                setLoading(false);
                return;
            }

            const res = await fetch('/api/revalidate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (data.success) {
                setMessage(`✅ ${data.message} at ${data.timestamp}`);
                setSelectedPaths([]);
            } else {
                setMessage(`❌ Failed: ${data.message}`);
            }
        } catch (error: any) {
            setMessage(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const togglePath = (path: string) => {
        setSelectedPaths(prev =>
            prev.includes(path)
                ? prev.filter(p => p !== path)
                : [...prev, path]
        );
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                🔄 Cache Revalidation
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                After updating content, revalidate the cache to make changes visible on the website.
            </p>

            <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                    Select Paths to Revalidate:
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {commonPaths.map(({ path, label }) => (
                        <label
                            key={path}
                            className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <input
                                type="checkbox"
                                checked={selectedPaths.includes(path)}
                                onChange={() => togglePath(path)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {label} <code className="text-xs text-gray-500">({path})</code>
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex gap-3 mb-4">
                <button
                    onClick={() => handleRevalidate(false)}
                    disabled={loading || selectedPaths.length === 0}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Revalidating...' : `Revalidate Selected (${selectedPaths.length})`}
                </button>

                <button
                    onClick={() => handleRevalidate(true)}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Revalidating...' : 'Revalidate All'}
                </button>
            </div>

            {message && (
                <div className={`p-3 rounded ${message.startsWith('✅')
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                    {message}
                </div>
            )}

            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                <p className="font-semibold mb-2 text-gray-900 dark:text-white">💡 Quick Guide:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Select specific paths for targeted updates</li>
                    <li>Use "Revalidate All" after major changes</li>
                    <li>Changes appear within 1-2 seconds</li>
                    <li>You'll need the revalidation secret token</li>
                </ul>
            </div>
        </div>
    );
}
