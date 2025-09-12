import type { Post } from "@models/Post";
import PostCard from "@components/Post/PostCard";
import TagSelector, { tagSelectorState } from "@components/TagSelector/TagSelector.tsx";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchPostsByTag, setSelectedTag } from "../store/postsSlice";
import { useEffect, useRef } from "react";

// const TAGS = ["All", "r/programming", "r/reactjs", "r/javascript", "r/frontend"];
const MIN_NUMBER_OF_SHOWN_POSTS = 1;
const MAX_NUMBER_OF_SHOWN_POSTS = 4;

const TAGS = ["All", "Technology", "Travel", "Food", "Fitness", "Books"];

const FeedPage = () => {
  const dispatch = useAppDispatch();
  const { posts: allPosts, selectedTag, loading } = useAppSelector((state) => state.posts);
  const retryCountRef = useRef<number>(0);
    
  const feedPosts = selectedTag === "All"
    ? allPosts
    : allPosts.filter((post: Post) => post.tag === selectedTag);

  const handleTagSelection = (tag: string) => {
    dispatch(setSelectedTag(tag));
  };

  const computeTagSelectorState = (tag: string) => {
    return tag === selectedTag ? tagSelectorState.SELECTED : tagSelectorState.UNSELECTED;
  }

  // Reset retry count when tag changes
  useEffect(() => {
    retryCountRef.current = 0;
  }, [selectedTag]);

  // Fetch posts with retry logic
  useEffect(() => {
    const currentRetryCount = retryCountRef.current;
    const needsMorePosts = feedPosts.length < MIN_NUMBER_OF_SHOWN_POSTS;
    const canMakeRequest = !loading && currentRetryCount < 2; // Allow initial + 1 retry

    if (needsMorePosts && canMakeRequest) {
      retryCountRef.current = currentRetryCount + 1;
      dispatch(fetchPostsByTag(selectedTag));
    }
  }, [feedPosts.length, selectedTag, loading, dispatch]);


  return (
    <div className="flex flex-col">
      <div>

        <div className="flex flex-col gap-4 items-center">
          <ul className="flex flex-row gap-4 flex-wrap justify-center">
            {TAGS.map((tag) => (
              <li key={tag} id={tag}>
                <TagSelector state={computeTagSelectorState(tag)} text={tag} onClick={() => handleTagSelection(tag)} />
              </li>
            ))}
          </ul>
          {feedPosts.slice(0, MAX_NUMBER_OF_SHOWN_POSTS).map((post) =>
            <PostCard
              key={post.title}
              post={post}
              className="w-full max-w-5xl" />
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedPage;