import { ScreenSize, useScreenSize } from "@utils/hooks/useScreenSize";
import { twMerge } from "tailwind-merge";

interface CommentSectionProps {
    id?: string;
    children?: React.ReactNode;
    className?: string;
    commentsCount: number;
    refProps?: React.RefObject<HTMLDivElement | null>;
}
const CommentSection = ({id, children, className, commentsCount, refProps}: CommentSectionProps) => {

    const screenSize = useScreenSize();

    return (
        <div ref={refProps} id={id} className={twMerge("flex flex-col gap-4 items-center", screenSize == ScreenSize.Desktop ? "border rounded-[9px] border-text-50" : "", className)}>
            <h1 className="self-start font-family-sans font-semibold text-2xl">Comments ({commentsCount})</h1>
            {children}
        </div>
    );
}
export default CommentSection;