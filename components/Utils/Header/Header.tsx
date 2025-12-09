'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { fetchHeaderMenu, fetchGlobalData, MenuItem } from '@/lib/api';
import DesktopHeader from './DesktopHeader/DesktopHeader';
import MobileHeader from './MobileHeader/MobileHeader';

interface HeaderProps {
    initialMenu?: MenuItem[];
    initialSettings?: any;
}

export default function Header({ initialMenu = [], initialSettings = null }: HeaderProps) {
    const pathname = usePathname();
    const [headerMenu, setHeaderMenu] = useState<MenuItem[]>(initialMenu);
    const [settings, setSettings] = useState<any>(initialSettings);
    // Loading is only true if we don't have initial data AND we need to fetch
    const [isLoading, setIsLoading] = useState(!initialMenu.length && !initialSettings);

    const shouldHideHeader = pathname.startsWith('/admin') || pathname.startsWith('/login');

    useEffect(() => {
        if (shouldHideHeader) return;

        // If we already have data from props, don't re-fetch
        if (headerMenu.length > 0 && settings) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [menu, globalData] = await Promise.all([
                    fetchHeaderMenu(),
                    fetchGlobalData()
                ]);
                setHeaderMenu(menu);
                setSettings(globalData);
            } catch (error) {
                console.error("Failed to fetch header data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [shouldHideHeader]);

    if (shouldHideHeader) {
        return null;
    }

    return (
        <header>
            <div className="desktop-header hidden md:block">
                <DesktopHeader menuData={headerMenu} settingsData={settings} />
            </div>
            <div className="mobile-header md:hidden">
                <MobileHeader menuData={headerMenu} settingsData={settings} />
            </div>
        </header>
    );
}
