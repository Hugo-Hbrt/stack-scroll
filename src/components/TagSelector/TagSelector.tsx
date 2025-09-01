import { twMerge } from 'tailwind-merge';

export enum tagSelectorState {
    UNSELECTED = 0,
    SELECTED = 1
}

const stateClasses = {
    [tagSelectorState.UNSELECTED]: "bg-primary-700 text-text-50 font-normal",
    [tagSelectorState.SELECTED]: "bg-accent-50 text-text-950 font-semibold"
}

export interface TagSelectorProps {
    text: string;
    onClick: () => void;
    state: tagSelectorState;
    className?: string;
}

const TagSelector = ({ text, onClick, state, className}: TagSelectorProps) => {
    return (
        <button className={twMerge("rounded-3xl px-3 py-1.5 font-family-sans text-xl", stateClasses[state], className)}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default TagSelector;
