import { type Post } from "./Post";

export function generateRandomPost(subreddits: string[], postId: number = 1): Post {
    // Helper function to generate random base36 ID (like Reddit's format)
    const generateRedditId = (): string => {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    };

    // Helper function to get random element from array
    const getRandomElement = <T>(arr: T[]): T => {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    // Sample data for generating realistic posts
    const sampleTitles = [
        "Just discovered this amazing trick!",
        "Can anyone help me with this problem?",
        "Look what I found today",
        "This changed my perspective completely",
        "Unpopular opinion: this needs to be said",
        "Finally finished my project after months of work",
        "Does anyone else think this is weird?",
        "LPT: Here's something that might help you",
        "My experience with [topic]",
        "Question about getting started"
    ];

    const sampleContent = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "I've been working on this for a while and thought I'd share my experience with the community.",
        "Just wanted to get everyone's thoughts on this topic. What do you all think?",
        "After doing some research, I found some interesting information that might be helpful.",
        "This has been bothering me for a while, so I decided to finally ask about it here.",
        "I stumbled across this and couldn't believe it. Had to share with you all!",
        "Long story short, here's what happened and what I learned from it.",
        "For anyone who might be in a similar situation, here's my advice.",
        "I know this might be controversial, but I think this needs to be discussed.",
        "Update: Thanks for all the helpful responses in my previous post!"
    ];

    const sampleAuthors = [
        "RandomUser123",
        "TechEnthusiast",
        "CuriousMinds",
        "DataLover42",
        "CodeNewbie",
        "ExperiencedDev",
        "LearningEveryday",
        "ProblemSolver",
        "CommunityHelper",
        "ThoughtfulPoster"
    ];

    // Validate input
    if (!subreddits || subreddits.length === 0) {
        throw new Error("Subreddits list cannot be empty");
    }

    // Generate random post
    return {
        id: postId,
        redditId: generateRedditId(),
        subreddit: getRandomElement(subreddits),
        title: getRandomElement(sampleTitles),
        content: getRandomElement(sampleContent),
        author: getRandomElement(sampleAuthors),
        commentsCount: Math.floor(Math.random() * 500), // 0-499 comments
        initialVoteCount: Math.floor(Math.random() * 2001) - 500 // -500 to 1500 votes
    };
}

// Generate multiple random posts
export const generateMultiplePosts = (subreddits: string[], count: number): Post[] => {
    return Array.from({ length: count }, (_, index) => 
        generateRandomPost(subreddits, index + 1)
    );
};

