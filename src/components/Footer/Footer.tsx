import GithubLogo from "@assets/images/github-mark.svg";

const Footer = () => {
    // Add my github link
    return (
        <footer className="w-full h-16 bg-gray-800 flex flex-wrap items-center justify-center text-white text-sm">
            &copy; 2025 StackScroll. All rights reserved.
            <a href="https://github.com/Hugo-Hbrt/stack-scroll" target="_blank" className="ml-2">
            <GithubLogo className="w-[24px] h-[24px] stroke-accent-950 fill-accent-950 inline mr-2"/>
                GitHub
            </a>
        </footer>
    );
}

export default Footer;