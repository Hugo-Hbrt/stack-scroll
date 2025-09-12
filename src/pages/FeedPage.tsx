import { useEffect, useMemo, useRef, useCallback } from "react";
import type { Post } from "@models/Post";
import PostCard from "@components/Post/PostCard";
import TagSelector from "@components/TagSelector/TagSelector";
import AppLogo, { AppLogoSize } from "@components/AppLogo/AppLogo";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchPostsByTag, setSelectedTag } from "../store/postsSlice";

const MIN_NUMBER_OF_SHOWN_POSTS = 1;
const MAX_NUMBER_OF_SHOWN_POSTS = 10;
const MAX_NUMBER_OF_RETRY = 2;

const TAGS = ["All", "Technology", "Travel", "Food", "Fitness", "Books"] as string[];

const FeedPage = () => {
  const dispatch = useAppDispatch();
  const { posts: allPosts, selectedTag, loading, error } = useAppSelector((s) => s.posts);

  const retryCountRef = useRef(0);

  const feedPosts = useMemo<Post[]>(() => {
    return selectedTag === "All"
      ? allPosts
      : allPosts.filter((p: Post) => p.tag === selectedTag);
  }, [allPosts, selectedTag]);

  const handleTagSelection = useCallback((tag: string) => {
    if (tag !== selectedTag) dispatch(setSelectedTag(tag));
  }, [dispatch, selectedTag]);

  // Reset retry count when tag changes
  useEffect(() => {
    retryCountRef.current = 0;
  }, [selectedTag]);

  // Fetch posts (threshold-based retry)
  useEffect(() => {
    const needsMore = feedPosts.length < MIN_NUMBER_OF_SHOWN_POSTS;
    const canRetry = retryCountRef.current < MAX_NUMBER_OF_RETRY;
    if (!loading && needsMore && canRetry) {
      retryCountRef.current += 1;
      dispatch(fetchPostsByTag(selectedTag));
    }
  }, [dispatch, selectedTag, feedPosts.length, loading]);

  const visible = useMemo(
    () => feedPosts.slice(0, MAX_NUMBER_OF_SHOWN_POSTS),
    [feedPosts]
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 items-center">
        <ul className="flex flex-row gap-4 flex-wrap justify-center" aria-label="Tag filters">
          {TAGS.map((tag) => (
            <li key={tag}>
              <TagSelector
                text={tag}
                selected={tag === selectedTag}
                onClick={() => handleTagSelection(tag)}
              />
            </li>
          ))}
        </ul>

        {loading && (
          <div
            data-testid="loading-spinner"
            className="flex justify-center my-4"
            role="status"
            aria-live="polite"
            aria-label="Loading posts"
          >
            <AppLogo size={AppLogoSize.Medium} className="animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div role="alert" className="text-red-600">
            {error}
          </div>
        )}

        {!loading && visible.length === 0 && !error && (
          <p className="text-muted-foreground">No posts for “{selectedTag}”.</p>
        )}

        {visible.map((post) => (
          <PostCard key={post.id} post={post} className="w-full max-w-5xl" />
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
