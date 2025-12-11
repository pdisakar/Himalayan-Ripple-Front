'use client';

import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqSection {
    title: string;
    faqs: FaqItem[];
}

interface PackageFaqsProps {
    data: string;
}

const PackageFaqs: React.FC<PackageFaqsProps> = ({ data }) => {
    const [openItem, setOpenItem] = useState<string | null>(null);

    const { mainTitle, sections } = useMemo(() => {
        if (!data) return { mainTitle: '', sections: [] };

        const sections: FaqSection[] = [];
        let mainTitle = '';

        const tagRegex = /<(h[234]|p)[^>]*>([\s\S]*?)<\/\1>/gi;

        let match;
        let currentSection: FaqSection = { title: '', faqs: [] };

        const pushSection = () => {
            if (currentSection.title || currentSection.faqs.length > 0) {
                sections.push(currentSection);
            }
        };

        while ((match = tagRegex.exec(data)) !== null) {
            const tag = match[1].toLowerCase();
            const content = match[2];

            if (tag === 'h2') {
                mainTitle = content;
            } else if (tag === 'h3') {
                pushSection();
                currentSection = { title: content, faqs: [] };
            } else if (tag === 'h4') {
                currentSection.faqs.push({ question: content, answer: '' });
            } else if (tag === 'p') {
                const faqs = currentSection.faqs;
                if (faqs.length > 0) {
                    const lastFaq = faqs[faqs.length - 1];
                    lastFaq.answer = lastFaq.answer
                        ? `${lastFaq.answer}<br/><br/>${content}`
                        : content;
                }
            }
        }
        pushSection();

        return { mainTitle: mainTitle || (sections.length > 0 ? 'FAQs' : ''), sections };
    }, [data]);


    const toggleFaq = (id: string) => {
        setOpenItem(prev => (prev === id ? null : id));
    };

    if (!sections.length && !mainTitle) return null;

    return (
        <div className="package-faqs-container mt-8">
            {mainTitle && (
                <div className="page-title">
                    <h2
                        dangerouslySetInnerHTML={{ __html: mainTitle }}
                    />
                </div>
            )}

            <div className="space-y-6">
                {sections.map((section, sIndex) => {
                    let faqCounter = 0;
                    return (
                        <div key={`section-${sIndex}`} className="faq-section">
                            {section.title && (
                                <h3
                                    className="text-xl font-bold text-headings capitalize"
                                    dangerouslySetInnerHTML={{ __html: section.title }}
                                />
                            )}

                            {/* Accordion Items */}
                            <ul className='[&>li]:border-b [&>li]:border-muted/20 '>
                                {section.faqs.map((faq, fIndex) => {
                                    const id = `${sIndex}-${fIndex}`;
                                    const isOpen = openItem === id;

                                    return (
                                        <li
                                            key={id}
                                        >
                                            <button
                                                onClick={() => toggleFaq(id)}
                                                className="w-full flex justify-between gap-6 items-center py-4 text-left hover:cursor-pointer text-headings hover:text-primary transform transition-all duration-100 ease-in-out leading-[1.5]"
                                                aria-expanded={isOpen}
                                            >
                                                <h4 className="font-semibold">
                                                    <span className="pr-2 text-primary">Q.{String(++faqCounter).padStart(2, '0')}:</span>
                                                    <span dangerouslySetInnerHTML={{ __html: faq.question }} />
                                                </h4>
                                                {isOpen ? (
                                                    <span className="font-semibold">-</span>
                                                ) : (
                                                    <span className="font-semibold">+</span>
                                                )}

                                            </button>

                                            {/* Answer Content */}
                                            <div
                                                className={`
                                                grid transition-all duration-300 ease-in-out
                                                ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
                                            `}
                                            >
                                                <div className="overflow-hidden">
                                                    <div className="p-4 pl-0 pt-0">
                                                        <article
                                                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PackageFaqs;
