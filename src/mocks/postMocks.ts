import { createPost } from "@models/Post";

const postData = [
    {
        id: 1,
        authorUsername: "ReactDev2024",
        title: "React 19 Released: What's New and Should You Upgrade?",
        subjectTag: "Technology",
        content: `React 19 is finally here! After months of beta testing, the React team has delivered some groundbreaking improvements.

Key highlights:
• React Compiler: Automatic performance optimizations
• Server Components: Better SSR integration  
• Concurrent Features: Improved Suspense and error boundaries

The migration guide is comprehensive, but there are breaking changes with legacy components. Overall, excited about React's direction!

Anyone else tried it yet?`,
        numberOfVotes: 234,
        numberOfComments: 18
    },
    {
        id: 2,
        authorUsername: "SoloTravelJane",
        title: "3 Months Backpacking Southeast Asia - Complete Budget Breakdown",
        subjectTag: "Travel",
        content: `Just returned from an incredible solo adventure through Thailand, Vietnam, Cambodia, and Laos!

Total budget: $2,800 for 3 months
• Accommodation: $800 (hostels, guesthouses)
• Food: $600 (street food is amazing!)
• Transportation: $400 
• Activities: $500 (temples, diving, tours)

Top highlights: Angkor Wat sunrise, Ha Long Bay cruise, cooking classes in Chiang Mai.

Safety was never an issue - just trust your instincts and stay connected with family. This trip was absolutely life-changing!`,
        numberOfVotes: 445,
        numberOfComments: 15
    },
    {
        id: 3,
        authorUsername: "ChefMikeNYC",
        title: "I Made Authentic Tonkotsu Ramen at Home - 3 Day Process",
        subjectTag: "Food",
        content: `After 15 years cooking professionally, I tackled the ultimate challenge: homemade tonkotsu ramen.

The process:
Day 1: 18-hour pork bone broth (rolling boil for creamy texture)
Day 2: Tare seasoning and aromatic oils  
Day 3: Fresh alkaline noodles, perfect eggs, braised chashu

Result? The best ramen I've ever had, including trips to Japan. But would I do it again? Maybe for very special occasions!

Key lesson: patience and quality ingredients matter more than technique.`,
        numberOfVotes: 678,
        numberOfComments: 12
    },
    {
        id: 4,
        authorUsername: "FitCoachSarah",
        title: "Why Your Morning Workout Isn't Working (And How to Fix It)",
        subjectTag: "Fitness",
        content: `Common morning workout mistake: forcing yourself through terrible sessions half-asleep.

My 6AM success formula:
• Prep the night before (clothes, water ready)
• Light pre-workout fuel (banana + coffee)
• Start with 5-10 min mobility work
• Progressive intensity - begin easy, build up
• Same time daily for habit formation

Real secret: It's about consistency and effort, not timing. If evenings work better for you, embrace it! Your best workout time is when you can give 100% consistently.`,
        numberOfVotes: 387,
        numberOfComments: 19
    },
    {
        id: 5,
        authorUsername: "BookwormBeth",
        title: "Brandon Sanderson's 4 Secret Novels: Ranked and Reviewed",
        subjectTag: "Books",
        content: `Just finished all of Sanderson's secret Kickstarter novels!

My rankings:
1. The Lost Metal ⭐⭐⭐⭐⭐ (Mistborn finale - incredible)
2. Tress and the Emerald Sea ⭐⭐⭐⭐⭐ (fairy tale perfection) 
3. Frugal Wizard's Handbook ⭐⭐⭐⭐ (sci-fi comedy!)
4. Yumi and the Nightmare Painter ⭐⭐⭐⭐ (beautiful, romance rushed)

Brandon somehow wrote four complete novels in secret while maintaining his regular schedule. The man is not human!

If you're new to Sanderson, start with Mistborn. But if you're already a fan, these are absolutely worth it.`,
        numberOfVotes: 892,
        numberOfComments: 16
    },
    {
        id: 6,
        authorUsername: "IndieFilmFan",
        title: "A24's 2024 Horror Films Ranked: Best to Worst",
        subjectTag: "Movies",
        content: `A24 had another strong horror year! My rankings:

1. Heretic ⭐⭐⭐⭐⭐ (Hugh Grant as villain = terrifying)
2. MaXXXine ⭐⭐⭐⭐ (Mia Goth delivers, great 80s setting)
3. I Saw the TV Glow ⭐⭐⭐⭐ (psychological, beautiful trans allegory)
4. Love Lies Bleeding ⭐⭐⭐ (great chemistry, wild third act)
5. Strange Darling ⭐⭐⭐ (interesting structure, predictable twist)

The A24 formula: elevated themes, incredible cinematography, strong female leads, ambiguous endings that spark debate.`,
        numberOfVotes: 543,
        numberOfComments: 14
    },
    {
        id: 7,
        authorUsername: "CoffeeCodeRepeat",
        title: "VS Code to Neovim: My 30-Day Experience Report",
        subjectTag: "Technology",
        content: `After 5 years of VS Code loyalty, I switched to Neovim. Here's my honest assessment:

Week 1: Pain and suffering (50% slower)
Week 2: Configuration rabbit hole (more configuring than coding)
Week 3: Modal editing clicks (never touching mouse feels liberating)
Week 4: Full productivity (actually faster than VS Code now!)

Final verdict: Sticking with Neovim! But I'd only recommend if you:
• Enjoy tinkering with tools
• Work in terminal environments  
• Don't mind initial productivity hit

For most developers: VS Code is still better out of the box.`,
        numberOfVotes: 421,
        numberOfComments: 20
    },
    {
        id: 8,
        authorUsername: "PlantBasedPro",
        title: "One Year Vegan: The Good, Bad, and Surprising Results",
        subjectTag: "Food",
        content: `365 days plant-based! Here's my honest review:

The Good:
• Consistent energy (no 3PM crashes)
• Better digestion 
• Improved cooking skills
• Lower environmental impact
• Cheaper when cooking at home

The Bad:
• Harder social dining
• Travel challenges
• Initial nutrition learning curve
• Family pushback

The Surprising:
• Taste buds changed (crave vegetables now!)
• Better athletic performance
• Clearer skin
• More mindful eating

Would I do it again? Absolutely. Benefits outweigh challenges.`,
        numberOfVotes: 756,
        numberOfComments: 17
    }
];

const posts = postData.map(post => createPost(post.id, post.subjectTag, post.title, post.content, post.authorUsername, post.numberOfComments, post.numberOfVotes));
export default posts;