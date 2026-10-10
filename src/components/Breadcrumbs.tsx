
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Uganda Escorts",
        "item": "https://www.hexescortsug.com"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": `https://www.hexescortsug.com${item.href}`
      }))
    ]
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500">
        <li className="flex items-center">
          <Link 
            href="/" 
            title="Uganda Escorts - Hex Escorts Directory"
            className="hover:text-primary transition-colors flex items-center font-medium"
          >
            <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1 shrink-0" />
            <span>Uganda Escorts</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2 text-gray-600 shrink-0" />
            {item.current ? (
              <span className="text-primary font-medium truncate max-w-[150px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-primary transition-colors truncate max-w-[100px] sm:max-w-none">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
