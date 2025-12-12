'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/Logo.svg';

interface SidePanelProps {
    settings?: any; // Accepting settings if we want to make it dynamic later
}

const SidePannel: React.FC<SidePanelProps> = ({ settings }) => {

    const socialLinks = [
        { href: settings?.facebookLink, icon: "footer_facebook", label: "Facebook" },
        { href: settings?.instagramLink, icon: "footer_instagram", label: "Instagram" },
        { href: settings?.linkedinLink, icon: "footer_linkedin", label: "LinkedIn" },
        { href: settings?.pinterestLink, icon: "footer_pintrest", label: "Pinterest" },
        { href: settings?.twitterLink, icon: "footer_x", label: "(Twitter) X" },
        { href: settings?.youtubeLink, icon: "footer_youtube", label: "Youtube" },
    ].filter(item => item.href);

    return (
        <>
            <div className="mb-8">
                <Link href='/' className='inline-block mb-4'>
                    <Image src={logo} alt="logo" height={60} width={180} />
                </Link>
                <p className=" text-sm leading-relaxed">
                    Himalayan Ripple offers unforgettable journeys across Nepal, blending adventure with warm hospitality.
                </p>
            </div>

            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <svg className="icon w-[18px] h-[18px] text-primary ">
                                <use xlinkHref={`/icons.svg#side-pannel-location`} fill="currentColor"></use>
                            </svg>
                            <span className=" text-sm">{settings?.address || 'Thamel, Kathmandu, Nepal'}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="icon w-[18px] h-[18px] text-primary ">
                                <use xlinkHref={`/icons.svg#side-pannel-callus`} fill="currentColor"></use>
                            </svg>
                            <span className=" text-sm">+977 {settings?.mobileNumber1}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="icon w-[18px] h-[18px] text-primary ">
                                <use xlinkHref={`/icons.svg#side-pannel-email`} fill="currentColor"></use>
                            </svg>
                            <span className=" text-sm">{settings?.email || 'info@himalayanripple.com'}</span>
                        </li>
                    </ul>
                </div>

                {socialLinks.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
                        <ul className="flex items-center flex-wrap gap-4">
                            {socialLinks.map((item, idx) => {
                                const normalized = item.href.startsWith("http") ? item.href : `https://${item.href}`;
                                return (
                                    <li key={idx}>
                                        <a
                                            href={normalized}
                                            className="flex items-center gap-2 text-sm font-medium text-text-color hover:text-primary transition-colors duration-100"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <svg className="icon w-[18px] h-[18px]">
                                                <use xlinkHref={`/icons.svg#${item.icon}`} fill="currentColor"></use>
                                            </svg>
                                            <span>{item.label}</span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};

export default SidePannel;