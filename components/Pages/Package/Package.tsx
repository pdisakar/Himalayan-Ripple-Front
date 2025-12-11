import PageBanner from '@/components/PageBanner/PageBanner';
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb';
import TripOverview from '@/components/TripOverview/TripOverview';
import React from 'react';
import Link from 'next/link';
import Itinerary from '@/components/Itinerary/Itinerary';
import BookModule from '@/components/BookModule/BookModule';
import { IMAGE_URL } from '@/lib/constants'
import Image from 'next/image';
import PackageFaqs from '@/components/PackageFaqs/PackageFaqs';

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
                        <div className="breadcrumb mb-2">
                            <BreadCrumb data={content.breadcrumbs} />
                        </div>
                        {content.title && (
                            <h1 dangerouslySetInnerHTML={{ __html: `${content.title} - ${content.tripFacts.duration} ${content.tripFacts.durationUnit || content.tripFacts['duration-unit'] || ''}` }} />
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
                    <div className=' lg:grid pt-8 package-page lg:grid-cols-10 gap-6 mt-8'>
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
                                                __html: `About ${content.title} - ${content.tripFacts.duration} ${content.tripFacts.durationUnit || content.tripFacts['duration-unit'] || ''}`
                                            }}
                                        />
                                    </div>
                                    <article className="mt-3" dangerouslySetInnerHTML={{ __html: content.details }} />
                                </div>
                            )
                            }
                            {content.itinerary.length > 0 && (
                                <div className="package-itinerary mt-8">
                                    <div className=' page-title'>
                                        <h2
                                            dangerouslySetInnerHTML={{
                                                __html: `Detailed Itinerary ${content.title} - ${content.tripFacts.duration}  ${content.tripFacts.durationUnit || content.tripFacts['duration-unit'] || ''}`
                                            }}
                                        />
                                    </div>
                                    <div className='space-y-4 p-6 bg-primary/7 rounded-lg text-[15px] mb-6'><p>Below Itinerary is only a generalized itinerary. Actual itinerary may vary based on the season, group size, and other factors. If this itinerary is not suitable for you, please contact us to discuss your requirements.
                                    </p>
                                        <Link href='/contact' className='hover:text-primary hover:bg-white font-medium px-6 py-2 bg-primary text-white rounded-lg transform transition-all duration-100 ease-in-out'>Contact Us</Link>
                                    </div>
                                    <Itinerary data={content.itinerary} />
                                </div>
                            )}
                            {
                                content.tripMapImage && (
                                    <div className="package-trip-map mt-8">
                                        <div className=' page-title'>
                                            <h2
                                                dangerouslySetInnerHTML={{
                                                    __html: `Trip Map`
                                                }}
                                            />
                                        </div>
                                        <figure className='image-slot shadow-sm overflow-hidden aspect-[12/19]'>
                                            <Image
                                                src={IMAGE_URL + content.tripMapImage}
                                                alt={content.tripMapImageAlt}
                                                fill
                                                className='object-cover'
                                            />
                                        </figure>
                                    </div>
                                )
                            }
                            {
                                content.costInclude && (
                                    <div className="package-cost-exclude mt-8">
                                        <div className=' page-title'>
                                            <h2
                                                dangerouslySetInnerHTML={{
                                                    __html: `Cost Include`
                                                }}
                                            />
                                        </div>
                                        <div className="mt-3 [&_h3]:text-heading [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:my-2.5 [&_h2]:text-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:my-2.5 [&_h4]:text-heading [&_h4]:text-2xl [&_h4]:font-semibold [&_h4]:my-2.5 [&_ul_li]:relative [&_ul_li]:pl-7 [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-[5px] [&_ul_li]:before:w-4.5 [&_ul_li]:before:h-4.5 [&_ul_li]:before:bg-[url('/icons/checkmark.svg')] [&_ul_li]:before:bg-no-repeat [&_ul_li]:before:bg-cover [&_ul]:space-y-1.5 text-headings [&_p]:mb-2 [&_p:last-child]:mb-0" dangerouslySetInnerHTML={{ __html: content.costInclude }} />
                                    </div>

                                )
                            }

                            {
                                content.costExclude && (
                                    <div className="package-cost-exclude mt-8">
                                        <div className=' page-title'>
                                            <h2
                                                dangerouslySetInnerHTML={{
                                                    __html: `Cost Exclude`
                                                }}
                                            />
                                        </div>
                                        <div className="mt-3 [&_h3]:text-heading [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:my-2.5 [&_h2]:text-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:my-2.5 [&_h4]:text-heading [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:my-2.5 [&_ul_li]:relative [&_ul_li]:pl-7 [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-[5px] [&_ul_li]:before:w-4.5 [&_ul_li]:before:h-4.5 [&_ul_li]:before:bg-[url('/icons/wrong.svg')] [&_ul_li]:before:bg-no-repeat [&_ul_li]:before:bg-cover [&_ul]:space-y-1.5 text-headings [&_p]:mb-2 [&_p:last-child]:mb-0" dangerouslySetInnerHTML={{ __html: content.costExclude }} />
                                    </div>
                                )
                            }
                            {
                                content.goodToKnow && (
                                    <div className="package-good-to-know mt-8">
                                        <div className=' page-title'>
                                            <h2
                                                dangerouslySetInnerHTML={{
                                                    __html: `Know Before You Go`
                                                }}
                                            />
                                        </div>
                                        <article dangerouslySetInnerHTML={{ __html: content.goodToKnow }} />
                                    </div>
                                )
                            }
                            {
                                content.extraFAQs && (
                                   <PackageFaqs data={content.extraFAQs} />
                                )
                            }

                        </div>
                        <div className="lg:col-span-3">
                            <div className='sticky booking-module top-0 pt-6'>
                                <BookModule packageSlug={content.slug} defaultprice={content.defaultPrice} groupprice={content.groupPrices} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};
