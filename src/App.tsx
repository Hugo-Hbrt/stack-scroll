import { Routes, Route } from "react-router";
import PostPage from "@pages/PostPage";
import FeedPage from "@pages/FeedPage";
import Root from "@components/Root/Root";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route path="/feed" element={<FeedPage/>} />
        <Route path="/post/:postId" element={<PostPage />}/>
      </Route>
    </Routes>
  );
}

export default App;
