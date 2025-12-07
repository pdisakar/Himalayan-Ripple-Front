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
        <footer className="bg-footer common-box">

            <ul className='container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
                {footerMenu.map((column) => (
                    <li key={column.id} className="space-y-3">
                        <h3 className="text-lg font-semibold text-white/90">{column.title}</h3>
                        <ul className="space-y-1.5">
                            {column.children?.map((link) => (
                                <li key={link.id}>
                                    <Link
                                        href={link.url}
                                        className="text-white/70 text-[15px]"
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </ li >
                ))}
            </ul>
        </footer>
    );
}
