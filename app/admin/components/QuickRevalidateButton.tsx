'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/app/admin/components/ui/button';

/**
 * Quick Revalidation Button
 * 
 * Simple button that triggers cache revalidation with one click.
 * Uses your admin login session - no secret key needed!
 */

export function QuickRevalidateButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleRevalidate = async () => {
    setLoading(true);
    setStatus('idle');
    
    try {
      // Get admin token from localStorage (same as your admin panel uses)
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to admin panel first');
        setLoading(false);
        return;
      }

      const res = await fetch('/admin/api/revalidate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          revalidateAll: true
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStatus('success');
        console.log('✅ Cache refreshed:', data.message);
        // Reset status after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        console.error('❌ Revalidation failed:', data.message);
        
        if (res.status === 401) {
          alert('Session expired. Please login again.');
          window.location.href = '/login';
        } else {
          alert(`Failed: ${data.message}`);
        }
      }
    } catch (error: any) {
      setStatus('error');
      console.error('❌ Revalidation error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleRevalidate}
      disabled={loading}
      className={`
        relative
        ${status === 'success' 
          ? 'text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20' 
          : status === 'error'
          ? 'text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20'
          : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      title={
        loading 
          ? 'Refreshing cache...' 
          : status === 'success'
          ? 'Cache refreshed successfully!'
          : status === 'error'
          ? 'Revalidation failed'
          : 'Refresh website cache'
      }
    >
      <RefreshCw 
        className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} 
      />
      
      {/* Success indicator */}
      {status === 'success' && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      )}
      
      {/* Error indicator */}
      {status === 'error' && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </Button>
  );
}
