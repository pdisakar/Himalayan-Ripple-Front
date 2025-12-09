import React from 'react';
import { fetchTestimonials } from '@/lib/api';
import { TestimonialsList } from '@/components/TestimonialsList/TestimonialsList';
import type { Metadata } from 'next';
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb';


export const metadata: Metadata = {
    title: 'Customer Testimonials | What Our Travelers Say',
    description: 'Read authentic reviews and testimonials from our satisfied customers who have experienced unforgettable journeys with us.',
    keywords: 'testimonials, customer reviews, travel reviews, client feedback, tour reviews',
};

export default async function TestimonialsPage() {
    const { data: testimonials, total } = await fetchTestimonials(1, 6);

    const BradCrumbdata = [
        {
            "title": "Home",
            "url": "/"
        },
        {
            "title": "Testimonials",
            "url": null
        }
    ]

    return (

        <main className="testimonials-list-page container">
            <div className='page-common-box'>
                <div className="page-title">
                    <div className="breadcrumb mb-1">
                        <BreadCrumb data={BradCrumbdata} />
                    </div>
                    <h1>Read All Testimonials</h1>
                </div>
                <div className="testimonials-list mt-6">
                    <TestimonialsList initialTestimonials={testimonials} totalCount={total} />
                </div>
            </div>
        </main>


    );
}
