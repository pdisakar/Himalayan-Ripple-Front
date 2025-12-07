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
       <figure className='image-slot aspect-[420/350] rounded-lg'>
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
      <figcaption className='pt-3'>
        <div className="blog-meta flex items-center gap-3 mb-2 flex-wrap">
          <span className='blog-author flex items-center gap-1.5 leading-[100%] text-sm text-muted'> <svg
              className="icon text-muted"
              width="18"
              height="18"
            >
              <use
                xlinkHref="/icons.svg#blog-card-author"
                fill="currentColor"
              ></use>
            </svg>{blog.authorName}</span>
          <span className='blog-date flex items-center gap-1.5 leading-[100%] text-sm text-muted'> <svg
              className="icon text-muted"
              width="18"
              height="18"
            >
              <use
                xlinkHref="/icons.svg#blog-card-date"
                fill="currentColor"
              ></use>
            </svg>{format(new Date(blog.publishedDate), 'MMM dd, yyyy')}</span>
        </div>
          <Link href={`/${blog.slug}`} className='group'>
            <h3 className='text-headings text-xl leading-[1.29] font-semibold capitalize transition-all duration-200 ease-out group-hover:text-primary'>{blog.title}</h3>
          </Link>
      </figcaption>
      
    </div>
  )
}

