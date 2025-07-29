"use client"

import { allManagements } from "content-collections"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { DOCS_CONFIG } from "@/lib/config"

export function useDocNavigation() {
    const pathname = usePathname();

    const docsByCategory = Object.entries(DOCS_CONFIG.categories).reduce(
        (acc, [category, cfg]) => {
            const categoryDocs = allManagements
                .filter(d => d._meta.path.startsWith(`${category}/`))
                .sort((a, b) => {
                    const aSlug = a._meta.path.split('/')[1]!;
                    const bSlug = b._meta.path.split('/')[1]!;
                    return cfg.items.indexOf(aSlug) - cfg.items.indexOf(bSlug);
                });
            acc[category] = categoryDocs;
            return acc;
        },
        {} as Record<string, typeof allManagements>,
    );

    const sortedCategories = Object.entries(docsByCategory).sort(
        ([catA], [catB]) =>
            (DOCS_CONFIG.categories[catA as keyof typeof DOCS_CONFIG.categories]?.order ?? Infinity) -
            (DOCS_CONFIG.categories[catB as keyof typeof DOCS_CONFIG.categories]?.order ?? Infinity),
    );

    const isActiveLink = (path: string) => pathname === `/docs/${path}`;

    return { sortedCategories, isActiveLink };
}

interface DocNavigationProps {
    onLinkClick?: () => void
    className?: string
}

export function DocNavigation({ onLinkClick, className }: DocNavigationProps) {
    const { sortedCategories, isActiveLink } = useDocNavigation()

    return (
        <nav className={className}>
            <ul className="space-y-8">
                {sortedCategories.map(([category, docs], index) => (
                    <li key={category}>
                        {index > 0 && <div className="h-px bg-dark-gray mb-8" />}
                        <h2 className="px-4 text-sm font-semibold tracking-tight text-muted-light uppercase mb-2">
                            {DOCS_CONFIG.categories[
                                category as keyof typeof DOCS_CONFIG.categories
                            ]?.title || category.replace("-", " ")}
                        </h2>
                        <ul className="">
                            {docs.map((doc) => (
                                <li
                                    key={doc._meta.path}
                                    className={cn("group rounded-sm", {
                                        "bg-brand-200/10": isActiveLink(doc._meta.path),
                                    })}
                                >
                                    <Link
                                        href={`/docs/${doc._meta.path}`}
                                        onClick={onLinkClick}
                                        className={cn(
                                            "block px-4 py-1.5 cursor-pointer rounded-md text-sm font-medium text-muted-dark ",
                                            {
                                                "text-brand-400 bg-zinc-200/15 hover:text-brand-400": isActiveLink(doc._meta.path),
                                                "group-hover:text-zinc-300 hover:bg-zinc-200/5": !isActiveLink(doc._meta.path),
                                            },
                                        )}
                                    >
                                        {doc.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </nav>
    )
}