import { useEffect, useState } from "react";

const MAX_COMMENT_LENGTH = 10000;

interface CommentFormProps 
{
    onSubmit?: (comment: string) => void;
}

const checkCommentIsValid = (comment: string) => {
    if (comment.trim().length === 0) {
        return false;
    }
    if (comment.length > MAX_COMMENT_LENGTH) {
        return false;
    }
    return true;
}

const CommentForm = ({onSubmit}: CommentFormProps) => {
    
    const [comment, setComment] = useState("");
    const [commentIsTooLong, setCommentIsTooLong] = useState(false);

    useEffect(() => {
        setCommentIsTooLong(comment.length > MAX_COMMENT_LENGTH);
    }, [comment]);

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (onSubmit) {
            onSubmit(comment);
        }
    }

    return (
        <form className="flex flex-col font-family-sans w-full gap-3" onSubmit={onFormSubmit}>
            <textarea className="bg-primary-900 rounded-[10px] placeholder:text-text-base placeholder:font-bold pt-1 pl-2 border-text-base border-1 min-h-28 focus:outline-text-50 resize-none" placeholder="Add a comment..." name="comment"
                      value={comment} onChange={(e) => setComment(e.target.value)} />
            {commentIsTooLong && <p className="text-red-500 font-bold">Comment is too long!!</p>}
            {checkCommentIsValid(comment) && <button className="bg-accent-base hover:bg-accent-800 w-min px-2.5 py-1.25 rounded-md self-end" type="submit">Comment</button>}
        </form>
    );
}

export default CommentForm;
