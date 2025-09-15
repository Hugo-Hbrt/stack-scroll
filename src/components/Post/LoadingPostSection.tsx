import { twMerge } from "tailwind-merge";

export interface LoadingPostSectionProps {
    className?: string;
}

const LoadingPostSection = ({ className }: LoadingPostSectionProps) => {
    return (
        <div 
            data-testid="loading-post-section"
            className={twMerge("flex flex-col gap-10 p-[22px] rounded-[9px] border border-text-50 font-family-sans animate-pulse", className)}
            role="status"
            aria-live="polite"
            aria-label="Loading post"
        >
            <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row min-w-0 gap-4 flex-wrap md:flex-nowrap max-w-min justify-between">
                        {/* Tag skeleton */}
                        <div className="bg-gray-300 rounded-md px-2 py-1 w-20 h-6"></div>
                        {/* Author skeleton */}
                        <div className="bg-gray-300 rounded w-16 h-4"></div>
                    </div>
                    {/* Title skeleton - responsive like PostSection */}
                    <div className="bg-gray-300 rounded w-80 h-8 md:h-12"></div>
                </div>
                {/* Voter skeleton */}
                <div className="flex flex-col items-center w-12 gap-1">
                    <div className="bg-gray-300 rounded w-5 h-5"></div>
                    <div className="bg-gray-300 rounded w-6 h-4"></div>
                    <div className="bg-gray-300 rounded w-5 h-5"></div>
                </div>
            </div>
            {/* Content skeleton - responsive text size */}
            <div className="space-y-2">
                <div className="bg-gray-300 rounded w-full h-4 md:h-5"></div>
                <div className="bg-gray-300 rounded w-5/6 h-4 md:h-5"></div>
                <div className="bg-gray-300 rounded w-4/6 h-4 md:h-5"></div>
            </div>
            {/* Comments button skeleton */}
            <div className="bg-gray-300 rounded w-24 h-8"></div>
        </div>
    );
}

export default LoadingPostSection;