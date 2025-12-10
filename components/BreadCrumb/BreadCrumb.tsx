import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
    title: string;
    url?: string | null;
}

interface BreadCrumbProps {
    data: BreadcrumbItem[];
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({ data }) => {
    if (!data || !Array.isArray(data)) return null;

    return (
        <nav className="text-[13px] font-medium text-gray-600 flex items-center gap-x-0.5 justify-center flex-wrap">
            {data.map((item, index) => {
                const isLast = index === data.length - 1;
                return (
                    <span key={index} className="flex items-center gap-1">
                        {item.url ? (
                            <Link href={item.url} className="hover:underline hover:text-primary">
                                {item.title}
                            </Link>
                        ) : (
                            <span className="font-medium text-headings">{item.title}</span>
                        )}
                        {!isLast && <span>»</span>}
                    </span>
                );
            })}
        </nav>
    );
};

export default BreadCrumb;
