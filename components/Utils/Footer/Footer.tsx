'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { fetchFooterMenu, fetchGlobalData, MenuItem } from '@/lib/api';
import Link from 'next/link';
import logo from '@/public/whitelogo.svg';
import Image from 'next/image';

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
                const [menu, globalData] = await Promise.all([
                    fetchFooterMenu(),
                    fetchGlobalData()
                ]);
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

    if (shouldHideFooter) {
        return null;
    }

    return (
        <footer className="bg-footer common-box">
            <div className="container">
                <div className="about-company-footer grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="about-body flex gap-3 text-sm">
                        <Link href='/' className='inline-block min-w-[180px]'>
                            <Image src={logo} alt="logo" height={70} width={220} />
                        </Link>
                        <div className="about-us-footer-body mt-1">
                            <p className='text-white/70'>Himalayan Ripple offers unforgettable journeys across Nepal, blending adventure with warm hospitality always great.</p>
                        </div>
                    </div>
                    <div className="mail-us">
                        <h3 className=' text-white font-semibold text-2xl capitalize'>Keep in touch with us</h3>
                        <p className='text-white/70'>Send us your information we will get right back to you</p>
                        <form className="bg-white rounded-lg flex overflow-hidden mt-3">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="px-6 py-2 flex-1 border-r border-r-footer outline-none text-[15px] placeholder:text-body-text/80 font-medium"
                            />

                            <input
                                type="text"
                                placeholder="Your Email"
                                className="px-6 py-2 flex-1 outline-none text-[15px] placeholder:text-body-text/80 font-medium"
                            />

                            <button
                                className="bg-primary text-white px-6 py-2 font-medium shrink-0"
                            >
                                Submit
                            </button>
                        </form>

                    </div>
                </div>
                <ul className='mt-6 md:mt-8 lg:mt-10 border-y border-y-white/10 grid grid-cols-2 lg:grid-cols-4 [&>li]:p-6 [&>li:nth-child(3)]:pl-0 lg:[&>li:nth-child(3)]:pl-8 [&>li:first-child]:pl-0 [&>li:last-child]:pr-0 lg:[&>li]:py-10 lg:[&>li]:px-8 overflow-hidden [&>li]:border [&>li]:border-white/10 [&>li]:border-r-0 [&>li]:-m-px'>
                    {footerMenu.map((column) => (
                        <li key={column.id} className="space-y-2.5">
                            <h3 className="text-lg font-medium text-white/90">{column.title}</h3>
                            <ul className="space-y-1">
                                {column.children?.map((link) => (
                                    <li key={link.id}>
                                        <Link
                                            href={link.url}
                                            className="text-white/80 text-sm"
                                        >
                                            {link.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </ li >
                    ))}
                </ul>
            </div>
        </footer>
    );
}
