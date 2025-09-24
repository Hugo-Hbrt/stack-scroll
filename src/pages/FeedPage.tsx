import { useEffect, useMemo, useCallback } from "react";
import type { Post } from "@models/Post";
import PostCard from "@components/Post/PostCard";
import TagSelector from "@components/TagSelector/TagSelector";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchPostsBySubReddit, setSelectedSubReddit } from "../store/postsSlice";
import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner";
import { SUBREDDITS } from "@config/reddit";

const MAX_NUMBER_OF_SHOWN_POSTS = 10;

const FeedPage = () => {
  const dispatch = useAppDispatch();
  const { posts: allPosts, selectedSubReddit, loading, error } = useAppSelector((s) => s.posts);

  const feedPosts = useMemo<Post[]>(() => {
    return selectedSubReddit === "All"
      ? allPosts
      : allPosts.filter((p: Post) => p.subreddit === selectedSubReddit);
  }, [allPosts, selectedSubReddit]);

  const handleTagSelection = useCallback((tag: string) => {
    if (tag !== selectedSubReddit) dispatch(setSelectedSubReddit(tag));
  }, [dispatch, selectedSubReddit]);

  // Fetch posts once when component mounts or when subreddit changes
  useEffect(() => {
    dispatch(fetchPostsBySubReddit(selectedSubReddit));
  }, [dispatch, selectedSubReddit]);

  const visible = useMemo(
    () => feedPosts.slice(0, MAX_NUMBER_OF_SHOWN_POSTS),
    [feedPosts]
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 items-center">
        <ul className="flex flex-row gap-4 flex-wrap justify-center" aria-label="Tag filters">
          {SUBREDDITS.map((subReddit) => (
            <li key={subReddit}>
              <TagSelector
                text={subReddit}
                selected={subReddit === selectedSubReddit}
                onClick={() => handleTagSelection(subReddit)}
              />
            </li>
          ))}
        </ul>

        {loading && <LoadingSpinner />}

        {!loading && error && (
          <div role="alert" className="text-red-600">
            {error}
          </div>
        )}

        {!loading && visible.length === 0 && !error && (
          <p className="text-muted-foreground">No posts for “{selectedSubReddit}”.</p>
        )}

        {visible.map((post) => (
          <PostCard key={post.id} post={post} className="w-full max-w-5xl" />
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
