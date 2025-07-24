# Product Requirements Document - Stack Scroll

## Document version

| Version | Author | Comment |
| --------| ------ | ------- |
| v0.1|Hugo Hebert| Initial version|


## Table of contents
- [Project Goal](#project-goal)
- [Target Audience](#target-audience)
- [Tech stack](#tech-stack)
- [Core pages](#core-pages)
- [Features](#features)
- [Components overview](#component-overview)
- [MVP Roadmap](#mvp-roadmap)
- [Out of scope](#out-of-scope-for-mvp)

## Project goal

Build a front-end application that mimics a simplified version of Reddit, focused on tech-related content. The goal is to practice front-end development using **React**, **Redux**, and **React Router**, while consuming data from Reddit’s public API. The project emphasizes speed, simplicity, and clean UI/UX.

---

## Target Audience

Fictional users – this is a personal learning project intended to improve front-end skills through a realistic, scoped-down Reddit clone.

---

## Tech Stack

- **Build Tool**: Vite  
- **Framework**: React  
- **State Management**: Redux  
- **Routing**: React Router  
- **Styling**: TailwindCSS  
- **Data Source**: Reddit Public API  
- **Authentication**: Optional (OAuth for future features)  
- **Backend**: None – relies entirely on Reddit API  
- **Architecture**: To be defined post-wireframing

---

## Core Pages

### 1. Feed Page
- Displays a list of posts from selected tech subreddits (e.g., `r/reactjs`, `r/programming`, `r/technology`)
- Filter buttons at the top to switch between subreddits
- Sort by button to chose between :
    - Most recent posts
    - Most upvoted posts
- Post preview includes:
  - Title
  - Score (upvotes)
  - Subreddit name
  - Author
  - Link to detailed post view
- Fully responsive layout

### 2. Post Detail Page
- Shows full content of a selected post
- Includes all related comments
- Displays number of upvotes/downvotes
- Future: allow authenticated interaction (e.g. upvote, comment)

---

## Features

### Must-Have
- Fetch tech posts from Reddit via public API
- Display post list on Feed page
- Navigate to Post detail page
- Display upvotes/downvotes count
- Display post comments

### Nice-to-Have
- Filter by subreddit (via top buttons)
- Responsive design (mobile-friendly)
- Loading placeholders while fetching
- Static vote interaction UI (without backend)

### Future Enhancements
- Reddit OAuth authentication
- Dark/Light mode toggle
- Post creation (if auth is implemented)
- Search for posts or subreddits

---


## Component Overview

- `PostCard` – for previewing a post in the feed  
- `SubredditFilter` – top filter buttons
- `SortByButton` - sort by button
- `PostDetail` – main component for post content  
- `CommentList` – displays comments  
- `Loader` – shows while content is loading  
- `Navbar` – optional global nav component  
- `Layout` – shared layout structure

---

## 🎨 Design & UX

### UX Goal
- Fast, minimalist experience focused on content and usability

### Visual Direction
- No predefined palette or visual inspiration  
- Clean, readable layout  
- TailwindCSS utility-first styling  
- Dark mode considered for future release  

### Component Styling Strategy
- Lightweight use of cards, buttons, and badges  
- Content-driven layout with accessible contrast and spacing  

---

## MVP Roadmap

1. Set up Vite + React + Tailwind + Redux
2. Design basic wireframes (Feed + Post)
3. Build Feed page with data from Reddit
4. Enable routing to individual Post pages
5. Load and display comments
6. Add responsive styling and UI polish
7. Optional: static upvote UI / dark mode toggle

---

## Out of Scope (for MVP)
- Full authentication & persistent sessions
- Writing or submitting content
- Full Reddit-like navigation & moderation features


