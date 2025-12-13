import React from 'react'
import Image from 'next/image'
import { IMAGE_URL } from '@/lib/constants'

interface PageBannerProps {
    image: string;
    imageAlt?: string;
    imageCaption?: string;
}

const PageBanner: React.FC<PageBannerProps> = ({ image, imageAlt, imageCaption }) => {
    return (
        <figure className='image-slot aspect-1920/750 min-h-[400px] max-h-[600px]'>
            <Image
                src={IMAGE_URL + image}
                alt={imageAlt || 'Banner Image'}
                fill
                className='object-cover'
                priority
                fetchPriority='high'
                sizes="100vw"
                quality={75}
            />

            {imageCaption && (
                <figcaption className="text-center mt-2 text-sm text-gray-600">
                    {imageCaption}
                </figcaption>
            )}
        </figure>
    );
};

export default PageBanner;
