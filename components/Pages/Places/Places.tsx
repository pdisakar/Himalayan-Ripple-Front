import BreadCrumb from '@/components/BreadCrumb/BreadCrumb';
import PageBanner from '@/components/PageBanner/PageBanner';
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
                    <div className="childrents">here map childrents with the place card</div>
                    <div className="packages">here map childrents with the package card</div>
                </div>
            </div>
        </>
    );
};
