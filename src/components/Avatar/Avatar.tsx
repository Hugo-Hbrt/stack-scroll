import tw from "@utils/tw";
import { twMerge } from "tailwind-merge";

enum AvatarMode {
    Image,
    Text
}

export enum AvatarSize {
    Small,
    Medium,
    Large
}

const sizeClasses = {
    [AvatarSize.Small]: {
        icon: "w-[24px] h-[24px]",
        text: "text-[11px]"
    },
    [AvatarSize.Medium]: {
        icon: "w-[36px] h-[36px]",
        text: "text-[16px]"
    },
    [AvatarSize.Large]: {
        icon: "w-[64px] h-[64px]",
        text: "text-[32px]"
    },
};

export interface AvatarProps {
    imageUrl?: string
    username: string
    className?: string
    size?: AvatarSize
}

// Helper function to take characters letters of username
function getFirstChars(username: string) {
    return username.slice(0, 2).toUpperCase()
}

const Avatar = ({imageUrl, username, className="", size=AvatarSize.Small}: AvatarProps) => {

    let mode: AvatarMode;
    
    if (!imageUrl) {
        mode = AvatarMode.Text;
    } else {
        mode = AvatarMode.Image;
    }
    
    const styles = sizeClasses[size];
    const backgroundImg = `background-[url(${imageUrl})]`;
    const background = (mode === AvatarMode.Image) ? backgroundImg : "bg-background-800";
    
    return  (
        <div className={twMerge("rounded-full flex justify-center items-center", background, styles.icon, className)}>
            {(mode === AvatarMode.Image) ? 
             "" : 
            <p className={twMerge("", styles.text)}>{getFirstChars(username)}</p>}
        </div>
        );
}

export default Avatar;