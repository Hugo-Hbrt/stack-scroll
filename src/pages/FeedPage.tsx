import PostCard from "@components/Post/PostCard";
import mockedPosts from "../mocks/postMocks.ts";
import TagSelector, { tagSelectorState } from "@components/TagSelector/TagSelector.tsx";
import { useEffect, useState } from "react";

const TAGS = ["All", "r/programming", "r/reactjs", "r/javascript", "r/frontend"];

const FeedPage = () => {
  const [selectedTag, setSelectedTag] = useState(TAGS[0]);
  
  const computeTagSelectorState = (tag: string) => {
    return tag === selectedTag ? tagSelectorState.SELECTED : tagSelectorState.UNSELECTED;
  }
  
  return (
    <div className="flex flex-col">
      <div>

        <div className="flex flex-col gap-4 items-center">
          <ul className="flex flex-row gap-4 flex-wrap justify-center">
            {TAGS.map((tag) => (
              <li key={tag} id={tag}>
                <TagSelector state={computeTagSelectorState(tag)} text={tag} onClick={() => setSelectedTag(tag)} />
              </li>
            ))}
          </ul>
          {mockedPosts.map((post) => 
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