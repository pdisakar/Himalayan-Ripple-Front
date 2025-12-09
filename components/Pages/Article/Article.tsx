import React from 'react';
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb';

interface ArticleProps {
    content: any;
}

export const Article: React.FC<ArticleProps> = ({ content }) => {
    console.log("article ", content);

    return (

        <main className="testimonials-list-page container">
            <div className='page-common-box'>
                <div className="page-title">
                    <div className="breadcrumb mb-1">
                        <BreadCrumb data={content.breadcrumbs} />
                    </div>
                    <h1>{content.title}</h1>
                </div>
                <div
                    className="prose max-w-none nt-6"
                    dangerouslySetInnerHTML={{ __html: content.description }}
                />
                {/* if it got childrent then map in ul li h3 */}
            </div>
        </main>

    );
};
