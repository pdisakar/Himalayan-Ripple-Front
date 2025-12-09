import React from 'react';
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb';
import Link from 'next/link';

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
                <article
                    className="prose max-w-none nt-6"
                    dangerouslySetInnerHTML={{ __html: content.description }}
                />
                {content.children && content.children.length > 0 && (
                    <ul className="mt-6 space-y-4">
                        {content.children.map((child: any) => (
                            <li key={child.id} className="border-b border-gray-100 pb-4 last:border-0">
                                <h3 className="text-xl font-semibold block text-headings hover:text-primary transition-colors">
                                    <Link href={`/${child.slug}`}>
                                        {child.title}
                                    </Link>
                                </h3>

                                <article
                                    className=" line-clamp-2"
                                    dangerouslySetInnerHTML={{ __html: child.description }}
                                />
                                <Link className='text-primary hover:text-primary/80 transition-colors text-sm font-medium' href={`/${child.slug}`}>Read More +</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>

    );
};
