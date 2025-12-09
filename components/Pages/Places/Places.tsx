import BreadCrumb from '@/components/BreadCrumb/BreadCrumb';
import React from 'react';

interface PlacesProps {
    content: any;
}

export const Places: React.FC<PlacesProps> = ({ content }) => {
    return (
        <div className="container">
            <div className="page-common-box">
                <div className="page-title">
                    <div className="breadcrumb mb-1">

                    <BreadCrumb data={content.breadcrumbs} />
                    </div>
                    {content.title && <h1 dangerouslySetInnerHTML={{ __html: content.title }} />}
                </div>

            </div>
        </div>
    );
};
