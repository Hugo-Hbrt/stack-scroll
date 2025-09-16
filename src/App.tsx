import { Routes, Route } from "react-router";
import PostPage from "@pages/PostPage";
import FeedPage from "@pages/FeedPage";
import Root from "@components/Root/Root";
import ROUTES from "@config/routes";
import AuthenticationPage from "@pages/AuthenticationPage";
import LoginPage from "@pages/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<LoginPage />} />
        <Route path={ROUTES.FEED} element={<FeedPage />} />
        <Route path="post/:postId" element={<PostPage />} />
        <Route path={ROUTES.AUTH_REDIRECT} element={<AuthenticationPage />} />
      </Route>
    </Routes>
  );
}

export default App;
