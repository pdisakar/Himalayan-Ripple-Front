import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/whitelogo.svg';

interface SidePanelProps {
    settings?: any; // Accepting settings if we want to make it dynamic later
}

const SidePannel: React.FC<SidePanelProps> = ({ settings }) => {
    return (
        <>
            <div className="mb-8">
                <Link href='/' className='inline-block mb-4'>
                    <Image src={logo} alt="logo" height={60} width={180} />
                </Link>
                <p className="text-white/70 text-sm leading-relaxed">
                    Himalayan Ripple offers unforgettable journeys across Nepal, blending adventure with warm hospitality.
                </p>
            </div>

            {/* Placeholder for extra content */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-white/90 mb-3">Contact Us</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-white/70 text-sm">{settings?.address || 'Thamel, Kathmandu, Nepal'}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-white/70 text-sm">+977 {settings?.mobileNumber1 || '9812345678'}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default SidePannel;