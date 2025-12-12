'use client';
import React, { useState, useEffect } from 'react';

interface SidebarTriggerProps {
    children: React.ReactNode;
}

const SidebarTrigger: React.FC<SidebarTriggerProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimating(true);
                });
            });
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                setIsVisible(false);
                document.body.style.overflow = 'unset';
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Cleanup overflow on unmount
    useEffect(() => {
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="cursor-pointer focus:outline-none"
                aria-label="Open side panel"
            >
                <svg className="icon text-primary" width="32" height="32">
                    <use xlinkHref={`/icons.svg#side-pannel`} fill="currentColor"></use>
                </svg>
            </button>

            {isVisible && (
                <div className={`fixed inset-0 z-[99999]`}>
                    {/* Backdrop */}
                    <div
                        className={`absolute inset-0 bg-black/50 backdrop-blur-md transition-all duration-300 ease-in-out origin-center ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            }`}
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Panel */}
                    <div
                        className={`absolute right-0 top-0 h-full w-[400px] max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isAnimating ? 'translate-x-0' : 'translate-x-full'
                            }`}
                    >
                        <div className="flex flex-col h-full bg-page-bg">
                            {/* Header */}
                            <div className="p-6 flex items-center justify-between border-b border-white/10 shrink-0">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className=" ml-auto mr-2 hover:cursor-pointer"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content Slot */}
                            <div className="flex-1 overflow-y-auto p-6 pt-0">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SidebarTrigger;
