import PageBanner from '@/components/PageBanner/PageBanner';
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb';
import TripOverview from '@/components/TripOverview/TripOverview';
import React from 'react';
import Link from 'next/link';

interface PackageProps {
    content: any;
}

export const Package: React.FC<PackageProps> = ({ content }) => {
    return (
        <>
            {content?.bannerImage?.trim() && (
                <PageBanner
                    image={content.bannerImage}
                    imageAlt={content.bannerImageAlt}
                    imageCaption={content.bannerImageCaption}
                />
            )}
            <div className="container">
                <div className="page-common-box">
                    <div className="page-title">
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
                    <div className=' lg:grid pt-8 package-page lg:grid-cols-10 mt-8'>
                        <div className="page-left lg:col-span-7">
                            <div className="trip-overview">
                                <TripOverview data={content.tripFacts} />
                            </div>

                            {content.tripHighlights && (
                                <div className="package-highlights mt-8">
                                    <div className='page-title'>
                                        <h2>Trip Highlights</h2>
                                    </div>
                                    <div className="mt-3 [&_ul_li]:relative [&_ul_li]:pl-7 [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-[5px] [&_ul_li]:before:w-4.5 [&_ul_li]:before:h-4.5 [&_ul_li]:before:bg-[url('/icons/checkmark.svg')] [&_ul_li]:before:bg-no-repeat [&_ul_li]:before:bg-cover [&_ul]:space-y-1.5 text-headings" dangerouslySetInnerHTML={{ __html: content.tripHighlights }} />
                                </div>
                            )}
                            {content.details && (
                                <div className="package-details mt-8">
                                    <div className=' page-title'>
                                        <h2
                                            dangerouslySetInnerHTML={{
                                                __html: `About ${content.title}`
                                            }}
                                        />
                                    </div>
                                    <article className="mt-3" dangerouslySetInnerHTML={{ __html: content.details }} />
                                </div>
                            )
                            }

                        </div>
                        <div className="card lg:col-span-3"> this is card</div>
                    </div>

                </div>
            </div>
        </>
    );
};
