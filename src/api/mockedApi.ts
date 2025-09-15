import { type Post } from '@models/Post';
import { type Comment } from '@models/Comment';
import postMocks from '../mocks/postMocks';
import commentMocks from '../mocks/commentMocks';

// Simulate network delay
const delay = (ms: number = 1500): Promise<void> => 
    new Promise(resolve => setTimeout(resolve, ms));

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    error?: string;
}

class MockedApi {
    private posts: Post[] = [...postMocks];
    private comments: Comment[] = [...commentMocks];

    // Posts API endpoints
    async getPosts(): Promise<ApiResponse<Post[]>> {
        await delay();
        try {
            return {
                data: this.posts,
                success: true,
                message: 'Posts retrieved successfully'
            };
        } catch (error) {
            return {
                data: [],
                success: false,
                error: 'Failed to retrieve posts'
            };
        }
    }

    async getPost(postId: number): Promise<ApiResponse<Post | null>> {
        await delay();
        try {
            const post = this.posts.find(p => p.id === postId);
            return {
                data: post || null,
                success: !!post,
                message: post ? 'Post found' : 'Post not found'
            };
        } catch (error) {
            return {
                data: null,
                success: false,
                error: 'Failed to retrieve post'
            };
        }
    }

    async getPostsByTag(tag: string): Promise<ApiResponse<Post[]>> {
        await delay();
        try {
            const filteredPosts = tag === 'All' 
                ? this.posts 
                : this.posts.filter(post => post.tag === tag);
            
            return {
                data: filteredPosts,
                success: true,
                message: `Posts filtered by "${tag}" successfully`
            };
        } catch (error) {
            return {
                data: [],
                success: false,
                error: 'Failed to filter posts'
            };
        }
    }

    async createPost(postData: Omit<Post, 'id'>): Promise<ApiResponse<Post>> {
        await delay();
        try {
            const newPost: Post = {
                ...postData,
                id: this.posts.length > 0 ? Math.max(...this.posts.map(p => p.id)) + 1 : 1
            };
            this.posts.push(newPost);
            
            return {
                data: newPost,
                success: true,
                message: 'Post created successfully'
            };
        } catch (error) {
            return {
                data: {} as Post,
                success: false,
                error: 'Failed to create post'
            };
        }
    }

    async updatePost(postId: number, updates: Partial<Post>): Promise<ApiResponse<Post | null>> {
        await delay();
        try {
            const postIndex = this.posts.findIndex(p => p.id === postId);
            
            if (postIndex === -1) {
                return {
                    data: null,
                    success: false,
                    error: 'Post not found'
                };
            }
            
            this.posts[postIndex] = { ...this.posts[postIndex], ...updates };
            return {
                data: this.posts[postIndex],
                success: true,
                message: 'Post updated successfully'
            };
        } catch (error) {
            return {
                data: null,
                success: false,
                error: 'Failed to update post'
            };
        }
    }

    async deletePost(postId: number): Promise<ApiResponse<boolean>> {
        await delay();
        try {
            const postIndex = this.posts.findIndex(p => p.id === postId);
            
            if (postIndex === -1) {
                return {
                    data: false,
                    success: false,
                    error: 'Post not found'
                };
            }
            
            this.posts.splice(postIndex, 1);
            // Remove associated comments
            this.comments = this.comments.filter(c => c.postId !== postId);
            
            return {
                data: true,
                success: true,
                message: 'Post deleted successfully'
            };
        } catch (error) {
            return {
                data: false,
                success: false,
                error: 'Failed to delete post'
            };
        }
    }

    // Comments API endpoints
    async getComments(postId?: number): Promise<ApiResponse<Comment[]>> {
        await delay();
        try {
            const comments = postId 
                ? this.comments.filter(c => c.postId === postId)
                : this.comments;
            
            return {
                data: comments,
                success: true,
                message: postId 
                    ? `Comments for post ${postId} retrieved successfully`
                    : 'All comments retrieved successfully'
            };
        } catch (error) {
            return {
                data: [],
                success: false,
                error: 'Failed to retrieve comments'
            };
        }
    }

    async getComment(commentId: number): Promise<ApiResponse<Comment | null>> {
        await delay();
        try {
            const comment = this.comments.find(c => c.id === commentId);
            return {
                data: comment || null,
                success: !!comment,
                message: comment ? 'Comment found' : 'Comment not found'
            };
        } catch (error) {
            return {
                data: null,
                success: false,
                error: 'Failed to retrieve comment'
            };
        }
    }

    async createComment(commentData: Omit<Comment, 'id'>): Promise<ApiResponse<Comment>> {
        await delay();
        try {
            const newComment: Comment = {
                ...commentData,
                id: this.comments.length > 0 ? Math.max(...this.comments.map(c => c.id)) + 1 : 1
            };
            this.comments.push(newComment);
            
            // Update post comment count
            const postIndex = this.posts.findIndex(p => p.id === commentData.postId);
            if (postIndex !== -1) {
                this.posts[postIndex].commentsCount += 1;
            }
            
            return {
                data: newComment,
                success: true,
                message: 'Comment created successfully'
            };
        } catch (error) {
            return {
                data: {} as Comment,
                success: false,
                error: 'Failed to create comment'
            };
        }
    }

    async updateComment(commentId: number, updates: Partial<Comment>): Promise<ApiResponse<Comment | null>> {
        await delay();
        try {
            const commentIndex = this.comments.findIndex(c => c.id === commentId);
            
            if (commentIndex === -1) {
                return {
                    data: null,
                    success: false,
                    error: 'Comment not found'
                };
            }
            
            this.comments[commentIndex] = { ...this.comments[commentIndex], ...updates };
            return {
                data: this.comments[commentIndex],
                success: true,
                message: 'Comment updated successfully'
            };
        } catch (error) {
            return {
                data: null,
                success: false,
                error: 'Failed to update comment'
            };
        }
    }

    async deleteComment(commentId: number): Promise<ApiResponse<boolean>> {
        await delay();
        try {
            const commentIndex = this.comments.findIndex(c => c.id === commentId);
            
            if (commentIndex === -1) {
                return {
                    data: false,
                    success: false,
                    error: 'Comment not found'
                };
            }
            
            const comment = this.comments[commentIndex];
            this.comments.splice(commentIndex, 1);
            
            // Update post comment count
            const postIndex = this.posts.findIndex(p => p.id === comment.postId);
            if (postIndex !== -1) {
                this.posts[postIndex].commentsCount = Math.max(0, this.posts[postIndex].commentsCount - 1);
            }
            
            return {
                data: true,
                success: true,
                message: 'Comment deleted successfully'
            };
        } catch (error) {
            return {
                data: false,
                success: false,
                error: 'Failed to delete comment'
            };
        }
    }

    // Utility methods
    reset(): void {
        this.posts = [...postMocks];
        this.comments = [...commentMocks];
    }

    getStatus(): { postsCount: number; commentsCount: number } {
        return {
            postsCount: this.posts.length,
            commentsCount: this.comments.length
        };
    }
}

// Export singleton instance
export const api = new MockedApi();
export default api;