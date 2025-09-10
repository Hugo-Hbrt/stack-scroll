import { PostFactory } from "@models/Post";

const postData = [
    {
        authorUsername: "tech_guru",
        title: "AI in Everyday Life",
        subjectTag: "Technology",
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  `,
        numberOfVotes: 120,
        numberOfComments: 45
    },
    {
        authorUsername: "wanderlust_jane",
        title: "Backpacking Through Europe",
        subjectTag: "Travel",
        content: "A guide to budget-friendly backpacking across Europe, covering routes, tips, and must-see locations.",
        numberOfVotes: 85,
        numberOfComments: 30
    },
    {
        authorUsername: "foodie_king",
        title: "Top 10 Street Foods",
        subjectTag: "Food",
        content: "From tacos in Mexico to satay in Thailand, here are the best street foods you must try.",
        numberOfVotes: 150,
        numberOfComments: 60
    },
    {
        authorUsername: "fitlife_coach",
        title: "Morning Workout Routine",
        subjectTag: "Fitness",
        content: "A simple yet effective workout routine to kickstart your mornings with energy and focus.",
        numberOfVotes: 95,
        numberOfComments: 20
    },
    {
        authorUsername: "bookworm123",
        title: "Best Fantasy Novels of 2025",
        subjectTag: "Books",
        content: "A roundup of the most immersive fantasy novels released this year that every reader should check out.",
        numberOfVotes: 110,
        numberOfComments: 35
    },
    {
        authorUsername: "cinema_buff",
        title: "The Rise of Indie Films",
        subjectTag: "Movies",
        content: "Why indie films are gaining popularity and challenging mainstream cinema in 2025.",
        numberOfVotes: 130,
        numberOfComments: 50
    }
];

const posts = postData.map(post => PostFactory.createPost(post.subjectTag, post.title, post.content, post.authorUsername, post.numberOfComments, post.numberOfVotes));
export default posts;