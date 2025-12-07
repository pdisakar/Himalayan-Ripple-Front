import { Blog } from '@/lib/api';
import React from 'react'
import Image from 'next/image'
import { IMAGE_URL } from '@/lib/constants';
import Link from 'next/link';
import { format } from 'date-fns';

interface BlogCardProps {
  blog: Blog;
}

export const BlogCard = ({ blog }: BlogCardProps) => {
  console.log(blog);
  
  return (
    <div className='blog-card'>
       <figure className='image-slot aspect-[420/350] rounded-t-lg'>
        <Link href={`/${blog.slug}`} className='group'>
          <Image
           src={IMAGE_URL+blog.featuredImage}
             alt={blog.featuredImageAlt || blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className='rounded-lg transition-all duration-500 ease-out group-hover:scale-110 group-hover:blur-[0.5px]'
          />
        </Link>
      </figure>
      <figcaption>
        <div className="blog-meta">
          <span className='blog-author'>{blog.authorName}</span>
          <span className='blog-date'>{format(new Date(blog.publishedDate), 'MMM dd, yyyy')}</span>
        </div>
          <Link href={`/${blog.slug}`} className='group'>
            <h3 className='text-headings text-xl leading-[1.29] font-semibold capitalize transition-all duration-200 ease-out group-hover:text-primary'>{blog.title}</h3>
          </Link>
      </figcaption>
      
    </div>
  )
}

