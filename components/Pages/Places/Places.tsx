import BreadCrumb from '@/components/BreadCrumb/BreadCrumb';
import PageBanner from '@/components/PageBanner/PageBanner';
import { PackageCard } from '@/components/Cards/PackageCard/PackageCard';
import { PlaceCard } from '@/components/Cards/PlaceCard/PlaceCard';
import React from 'react';

interface PlacesProps {
    content: any;
}

export const Places: React.FC<PlacesProps> = ({ content }) => {
    return (
        <>
            {content?.bannerImage && (
                <PageBanner
                    image={content.bannerImage}
                    imageAlt={content.bannerImageAlt}
                    imageCaption={content.bannerImageCaption}
                />
            )}

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
                    </div>

                    {content.children && content.children.length > 0 && (
                        <div className="places mt-12">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-headings">Available Places</h2>
                                <span className="text-sm font-medium">
                                    {content.children.length} Place{content.children.length !== 1 ? 's' : ''} Found
                                </span>
                            </div>

                            <div className="childrents grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {content.children.map((child: any) => (
                                    <PlaceCard key={child.id} data={child} />
                                ))}
                            </div>
                        </div>
                    )}

                    {content.packages && content.packages.length > 0 && (
                        <div className="packages mt-12">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-headings">Available Packages</h2>
                                <span className="text-sm font-medium">
                                    {content.packages.length} Package{content.packages.length !== 1 ? 's' : ''} Found
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {content.packages.map((pkg: any) => (
                                    <PackageCard key={pkg.id} data={pkg} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
