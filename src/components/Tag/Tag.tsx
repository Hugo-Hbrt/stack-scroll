import { twMerge } from 'tailwind-merge';

export interface TagProps {
    text: string;
    className?: string;
}

const Tag = ({ text, className }: TagProps) => {
    return (<div className={twMerge("bg-primary-900 text-text-100 rounded-md px-2 py-1 font-family-sans font-normal w-min", className)}>
        <p className="text-[15px]">{text}</p>
    </div>);
}

export default Tag;