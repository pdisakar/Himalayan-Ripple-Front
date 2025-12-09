import PageBanner from '@/components/PageBanner/PageBanner';
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb';
import React from 'react';
import Link from 'next/link';

interface PackageProps {
    content: any;
}

export const Package: React.FC<PackageProps> = ({ content }) => {
    return (
        <>
            <PageBanner image={content.bannerImage} imageAlt={content.bannerImageAlt} imageCaption={content.bannerImageCaption} />
            <div className="container">
                <div className="page-common-box">
                    <div className="page-title lg:w-9/12 mx-auto">
                        <div className="breadcrumb mb-1">
                            <BreadCrumb data={content.breadcrumbs} />
                        </div>
                        {content.title && (
                            <h1 dangerouslySetInnerHTML={{ __html: content.title }} />
                        )}
                        {content.description && (
                            <article className='text-center mt-6' dangerouslySetInnerHTML={{ __html: content.description }} />
                        )}
                        <div className="total-ratings flex justify-center items-center gap-1 mt-1">
                            <svg
                                className="icon text-primary"
                                width="82"
                                height="14"
                            >
                                <use
                                    xlinkHref="/icons.svg#5_star"
                                    fill="currentColor"
                                ></use>
                            </svg>
                            {Number(content.total_testimonials) > 0 && (
                                <span className="text-[13px] leading-[100%] text-muted font-light">
                                    5/5 from <Link href='/testimonials' className='hover:text-primary underline'> {String(content.total_testimonials).padStart(2, '0')} Reviews</Link>
                                </span>
                            )}

                        </div>
                    </div>
                    <div className="trip-overview">
                        
                    </div>
                </div>
            </div>
        </>
    );
};
