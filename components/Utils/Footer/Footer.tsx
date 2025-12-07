'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { fetchFooterMenu, fetchGlobalData, MenuItem } from '@/lib/api';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaPinterestP } from 'react-icons/fa';

export default function Footer() {
    const pathname = usePathname();
    const [footerMenu, setFooterMenu] = useState<MenuItem[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const shouldHideFooter = pathname.startsWith('/admin') || pathname.startsWith('/login');

    useEffect(() => {
        if (shouldHideFooter) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const menu = await fetchFooterMenu();
                const globalData = await fetchGlobalData();
                setFooterMenu(menu);
                setSettings(globalData);
            } catch (error) {
                console.error("Failed to fetch footer data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [shouldHideFooter]);

    if (isLoading || shouldHideFooter) {
        return null;
    }

    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            footer
        </footer>
    );
}
