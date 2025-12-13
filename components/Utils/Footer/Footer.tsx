'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { fetchFooterMenu, fetchGlobalData, MenuItem } from '@/lib/api';
import Link from 'next/link';
import logo from '@/public/whitelogo.svg';
import Image from 'next/image';

interface FooterProps {
    initialMenu?: MenuItem[];
    initialSettings?: any;
}

export default function Footer({ initialMenu = [], initialSettings = null }: FooterProps) {
    const pathname = usePathname();
    const [footerMenu, setFooterMenu] = useState<MenuItem[]>(initialMenu);
    const [settings, setSettings] = useState<any>(initialSettings);
    const [isLoading, setIsLoading] = useState(!initialMenu.length && !initialSettings);


    const shouldHideFooter = pathname.startsWith('/admin') || pathname.startsWith('/login');

    useEffect(() => {
        if (shouldHideFooter) {
            setIsLoading(false);
            return;
        }

        // If we already have data from props, don't re-fetch
        if (footerMenu.length > 0 && settings) {
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
        <>
            <footer className="bg-footer common-box pb-10">
                <div className="container">
                    <div className="about-company-footer grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="about-body space-y-1 text-sm">
                            <Link href='/' className='inline-block min-w-[180px]'>
                                <Image src={logo} alt="logo" height={70} width={220} />
                            </Link>
                            <div className="about-us-footer-body mt-1">
                                <p className='text-white/70'>Himalayan Ripple offers unforgettable journeys across Nepal, blending adventure with warm hospitality always great.</p>
                                <ul className='mt-3 flex gap-5 flex-wrap'>
                                    <li className='group'>
                                        <a
                                            href={`https://wa.me/${settings?.mobileNumber1?.replace(/\D/g, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="whatsapp-mobile flex items-center gap-2 cursor-pointer"
                                            aria-label="Contact us on WhatsApp"
                                        >
                                            <svg
                                                className="icon text-white/70"
                                                width="28"
                                                height="28"
                                            >
                                                <use
                                                    xlinkHref="/icons.svg#mobilewhatsapp"
                                                    fill="currentColor"
                                                ></use>
                                            </svg>

                                            <div className="whatsappbody">
                                                <span className="block text-sm leading-[100%] text-[14px] text-white/70">
                                                    Call or WhatsApp
                                                </span>
                                                <span className="block text-[13px] leading-[100%] text-white/85 group-hover:text-white transition-colors duration-100 mt-1.5">
                                                    +977 {settings?.mobileNumber1}
                                                </span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className='group'>
                                        <a
                                            href={`mailto:${settings?.email}`}
                                            className="email-mobile flex items-center gap-2 cursor-pointer"
                                            aria-label="Email us"
                                        >
                                            <svg
                                                className="icon text-white/70"
                                                width="28"
                                                height="28"
                                            >
                                                <use
                                                    xlinkHref="/icons.svg#footer_email"
                                                    fill="currentColor"
                                                ></use>
                                            </svg>

                                            <div className="emailbody">
                                                <span className="block text-sm leading-[100%] text-[14px] text-white/70">
                                                    Email Us
                                                </span>
                                                <span className="block text-[14px] leading-[100%] text-white/85 group-hover:text-white transition-colors duration-100 mt-1.5">
                                                    {settings?.email}
                                                </span>
                                            </div>
                                        </a>

                                    </li>
                                </ul>
                            </div>

                        </div>
                        <div className="mail-us">
                            <h3 className=' text-white/90 font-semibold text-2xl capitalize'>Keep in touch with us</h3>
                            <p className='text-white/70'>Send us your information we will get right back to you</p>
                            <form className="bg-white rounded-lg flex overflow-hidden mt-3">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="px-6 py-2 flex-1 min-w-0 border-r border-r-footer outline-none text-[15px] placeholder:text-body-text/80 font-medium"
                                />

                                <input
                                    type="text"
                                    placeholder="Your Email"
                                    className="px-6 py-2 flex-1 min-w-0 outline-none text-[15px] placeholder:text-body-text/80 font-medium"
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
                                                className="text-white/80 text-sm hover:text-white capitalize transition-colors duration-100"
                                            >
                                                {link.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </ li >
                        ))}
                    </ul>
                    <div className="social-media mt-8">
                        <h3 className='text-white/90 text-lg text-center font-semibold uppercase'>Follow Us</h3>
                        <ul className="flex items-center justify-center flex-wrap gap-4 mt-3">
                            {[
                                { href: settings?.facebookLink, icon: "footer_facebook", label: "Facebook" },
                                { href: settings?.instagramLink, icon: "footer_instagram", label: "Instagram" },
                                { href: settings?.linkedinLink, icon: "footer_linkedin", label: "LinkedIn" },
                                { href: settings?.pinterestLink, icon: "footer_pintrest", label: "Pinterest" },
                                { href: settings?.twitterLink, icon: "footer_x", label: "(Twitter) X" },
                                { href: settings?.youtubeLink, icon: "footer_youtube", label: "Youtube" },
                            ]
                                .filter(item => item.href)
                                .map((item, idx) => {
                                    const normalized = item.href.startsWith("http")
                                        ? item.href
                                        : `https://${item.href}`;

                                    return (
                                        <li key={idx} className='group'>
                                            <a
                                                href={normalized}
                                                className="flex items-center gap-1 text-xs font-medium text-white/70 group-hover:text-white transition-colors duration-100"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <svg className="icon" width="18" height="18">
                                                    <use xlinkHref={`/icons.svg#${item.icon}`} fill="currentColor"></use>
                                                </svg>
                                                <span className="leadings-[100%]">{item.label}</span>
                                            </a>
                                        </li>
                                    );
                                })}
                        </ul>


                    </div>
                </div>
            </footer>
            <span className='py-8 block text-center max-w-[600px] mx-auto text-[15px] text-footer'>© {new Date().getFullYear()} Himalayan Ripple. All rights reserved. No part of this website may be reproduced without permission.
            </span>
        </>

    );
}
