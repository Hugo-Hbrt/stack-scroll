import type React from "react";
import tw from "@utils/tw.ts";
import { twMerge } from 'tailwind-merge'

interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    btnStyle?: buttonStyle;
    className?: string;
}

const Button = ({ children, onClick, btnStyle="primary", className=""}: ButtonProps) => {
    
    return <button
        aria-label="button"
        className={twMerge(buttonStyles[btnStyle], className)}
        onClick={onClick}
    >
        {children}
    </button>
};

export default Button;

// Styles 
type buttonStyle = 'primary';


export const buttonStyles: Record<buttonStyle, string> = {
    primary: tw("bg-accent-base text-text-50 px-[10px] py-[5px] rounded-[7px] font-family-sans font-normal hover:bg-accent-700")
};

