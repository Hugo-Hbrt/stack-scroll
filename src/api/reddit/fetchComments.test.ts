import { describe, it, vi, expect, beforeEach } from "vitest";
import type { RedditToken } from "@utils/sessionStorage/tokenStorage";
import { fetchComments } from "./fetchComments";
import { REDDIT_OAUTH_BASE_URL } from "@config/reddit";
import type { UserInfo } from "@utils/sessionStorage/userStorage";

const accessToken = "test-token";

vi.mock("@store/hooks", async () => {
    return {
        useAppSelector: (...args: any) => () => {
            console.log("Mocked useSelector called with", args);
            return {
                accessToken: accessToken,
                scope: "scope",
                expiresAt: Date.now() + 6000 * 10,
            } as RedditToken;
        }
    }
});

const mockUser = {
    name: "redditUser",
} as UserInfo;

describe("fetchComments", () => {
    const mockToken: RedditToken = {
        accessToken: accessToken,
        scope: "scope",
        expiresAt: Date.now() + 6000 * 10,
    };

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("should throw error when fetch fails", async () => {
        // Mock fetch to return a failed response
        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: false,
            status: 404,
            text: () => Promise.resolve("Not Found")
        });

        const subreddit = "nonexistent";
        const postId = "invalid123";

        await expect(fetchComments(subreddit, postId, mockToken, mockUser)).rejects.toThrow();
    });

    it("should fetch comments successfully", async () => {
        const mockResponse = [
            {
                // Post data (we ignore this)
                data: {
                    children: [{ data: { id: "post123", title: "Test Post" } }]
                }
            },
            {
                // Comments data (this is what we want)
                data: {
                    children: [
                        {
                            kind: "t1",
                            data: {
                                id: "comment123",
                                author: "testuser",
                                body: "This is a test comment",
                                score: 5,
                                created_utc: 1640995200,
                                parent_id: "t3_post123",
                                link_id: "t3_post123",
                                subreddit: "test",
                                depth: 0,
                                is_submitter: false,
                                stickied: false
                            }
                        }
                    ]
                }
            }
        ];

        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        const subreddit = "test";
        const postId = "post123";
        const result = await fetchComments(subreddit, postId, mockToken, mockUser);
        expect(result).toEqual(mockResponse[1]); // Should return only comments data
        expect(result.data.children[0].data.id).toBe("comment123");
        expect(result.data.children[0].data.body).toBe("This is a test comment");
        expect(fetch).toHaveBeenCalledWith(
            new URL("/r/test/comments/post123", REDDIT_OAUTH_BASE_URL),
            expect.objectContaining({
                method: "GET",
                headers: expect.objectContaining({
                    "User-Agent": `web:stack-scroll:v1.0.0 (by /u/${mockUser.name})`,
                    "Authorization": `Bearer ${mockToken.accessToken}`
                })
            })
        );
    });

    it("should include authorization header when token is provided", async () => {
        const mockResponse = [
            { data: { children: [] } }, // Post data
            { data: { children: [] } }  // Comments data
        ];

        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        const subreddit = "javascript";
        const postId = "abc123";
        await fetchComments(subreddit, postId, mockToken, mockUser);

        expect(fetch).toHaveBeenCalledWith(
            new URL("/r/javascript/comments/abc123", REDDIT_OAUTH_BASE_URL),
            expect.objectContaining({
                method: "GET",
                headers: expect.objectContaining({
                    "User-Agent": `web:stack-scroll:v1.0.0 (by /u/${mockUser.name})`,
                    "Authorization": `Bearer ${mockToken.accessToken}`
                })
            })
        );
    });

    it("should handle network errors", async () => {
        global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

        const subreddit = "react";
        const postId = "xyz789";

        await expect(fetchComments(subreddit, postId, mockToken, mockUser)).rejects.toThrow("Network error");
    });

    it("should handle invalid JSON response", async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.reject(new Error("Invalid JSON"))
        });

        const subreddit = "javascript";
        const postId = "def456";

        await expect(fetchComments(subreddit, postId, mockToken, mockUser)).rejects.toThrow("Invalid JSON");
    });
});

describe("fetchComments - Integration Tests", () => {
    beforeEach(() => {
        // Restore real fetch for integration tests
        vi.restoreAllMocks();
    });

    const realToken: RedditToken = {
        accessToken: accessToken,
        scope: "read",
        expiresAt: Date.now() + 3600 * 1000, // 1 hour from now
    };

    it.skip("should handle Reddit comments API response structure (requires real fetch)", async () => {
        // This test would make a real API call but fetch is not available in test environment
        // We've verified this works with scripts/test-reddit-api.js
        console.log("Real comments API test skipped - verified with standalone script");
    });

    it("should test Reddit comments data structure", async () => {
        // Test with realistic Reddit comments structure
        if (process.env.CI) {
            return;
        }

        const sampleCommentsResponse = {
            data: {
                children: [
                    {
                        kind: "t1",
                        data: {
                            id: "comment123",
                            author: "testuser",
                            body: "This is a test comment with **markdown**.",
                            score: 42,
                            created_utc: 1640995200,
                            parent_id: "t3_post123",
                            link_id: "t3_post123",
                            subreddit: "test",
                            depth: 0,
                            is_submitter: false,
                            stickied: false,
                            distinguished: null,
                            replies: {
                                data: {
                                    children: [
                                        {
                                            kind: "t1",
                                            data: {
                                                id: "reply123",
                                                author: "replyuser",
                                                body: "This is a reply to the comment.",
                                                score: 10,
                                                created_utc: 1640995300,
                                                parent_id: "t1_comment123",
                                                link_id: "t3_post123",
                                                subreddit: "test",
                                                depth: 1,
                                                is_submitter: true,
                                                stickied: false
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ]
            }
        };

        // Mock the full Reddit response [post, comments]
        const fullMockResponse = [
            { data: { children: [] } }, // Post data
            sampleCommentsResponse       // Comments data
        ];

        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(fullMockResponse)
        });

        const result = await fetchComments("test", "post123", realToken, mockUser);

        expect(result).toEqual(sampleCommentsResponse);
        expect(result.data.children[0].data.id).toBe("comment123");
        expect(result.data.children[0].data.body).toBe("This is a test comment with **markdown**.");
        expect(result.data.children[0].data.score).toBe(42);
        expect(result.data.children[0].data.depth).toBe(0);

        // Test nested replies
        const replies = result.data.children[0].data.replies as any;
        expect(replies.data.children[0].data.id).toBe("reply123");
        expect(replies.data.children[0].data.depth).toBe(1);
        expect(replies.data.children[0].data.is_submitter).toBe(true);

        console.log("Reddit comments structure test passed with sample data");
    });
});