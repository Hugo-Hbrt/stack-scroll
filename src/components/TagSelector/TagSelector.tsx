import { twMerge } from 'tailwind-merge';

const stateClasses = {
    default: "bg-primary-700 text-text-50 font-normal",
    selected: "bg-accent-50 text-text-950 font-semibold"
}

export interface TagSelectorProps {
    text: string;
    onClick: () => void;
    selected: boolean;
    className?: string;
}

const TagSelector = ({ text, onClick, selected, className}: TagSelectorProps) => {
    return (
        <button className={twMerge("rounded-3xl px-3 py-1.5 font-family-sans text-xl", selected ? stateClasses.selected : stateClasses.default, className)}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default TagSelector;
