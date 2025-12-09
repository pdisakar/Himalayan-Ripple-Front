import { fetchBlogs } from '@/lib/api';
import { BlogList } from '@/components/BlogList/BlogList';
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb';

export default async function BlogsPage() {
    const { data: blogs, total } = await fetchBlogs(1, 6);
    console.log(blogs);

    const BradCrumbdata = [
        {
            "title": "Home",
            "url": "/"
        },
              {
            "title": "Blogs",
            "url": null
        }
    ]


    return (
        <main className="blog-list-page container">
            <div className='page-common-box'>
                <div className="page-title">
                    <div className="breadcrumb mb-1">
                        <BreadCrumb data={BradCrumbdata} />
                    </div>
                    <h1>Blog List</h1>
                </div>
                <div className="blog-list mt-6">
                    <BlogList initialBlogs={blogs} totalCount={total} />
                </div>
            </div>
        </main>
    );
}
