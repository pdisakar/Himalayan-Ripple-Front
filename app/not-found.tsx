import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="mt-6 text-9xl font-extrabold text-gray-200">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
            Page not found
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been removed or the link is broken.
          </p>
        </div>
        <div className="mt-8">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-10 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
