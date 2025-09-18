import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchUserInfo } from './fetchUserInfo';
import type { RedditToken } from '@utils/sessionStorage/tokenStorage';

const mockToken: RedditToken = {
    accessToken: 'test_access_token_123',
    scope: 'identity read',
    expiresAt: Date.now() + 3600000
};

// Mock global fetch
global.fetch = vi.fn();

describe('fetchUserInfo', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully fetch user info from Reddit API', async () => {
        const mockUserData = {
            id: 't2_test123',
            name: 'testuser',
            icon_img: 'https://www.redditstatic.com/avatars/avatar_default_01.png',
            link_karma: 100,
            comment_karma: 50,
            created_utc: 1234567890,
            verified: true,
            is_gold: false
        };

        (fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockUserData
        });

        const result = await fetchUserInfo(mockToken);

        expect(result).toEqual(mockUserData);
        expect(fetch).toHaveBeenCalledWith(
            new URL('/api/v1/me', 'https://oauth.reddit.com'),
            {
                method: 'GET',
                headers: {
                    'User-Agent': "web:stack-scroll:v1.0.0 (by /u/stack_scroll_auth)",
                    'Authorization': `Bearer ${mockToken.accessToken}`
                }
            }
        );
    });

    it('should throw error when API request fails', async () => {
        (fetch as any).mockResolvedValue({
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        });

        await expect(fetchUserInfo(mockToken)).rejects.toThrow(
            'Failed to fetch user info: 401 Unauthorized'
        );
    });

    it('should include correct authorization header', async () => {
        const mockUserData = {
            id: 't2_test123',
            name: 'testuser',
            icon_img: '',
            link_karma: 0,
            comment_karma: 0,
            created_utc: 0,
            verified: false,
            is_gold: false
        };

        (fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockUserData
        });

        await fetchUserInfo(mockToken);

        const [, options] = (fetch as any).mock.calls[0];
        expect(options.headers.Authorization).toBe('Bearer test_access_token_123');
    });

    it('should use correct Reddit OAuth endpoint', async () => {
        const mockUserData = {
            id: 't2_test123',
            name: 'testuser',
            icon_img: '',
            link_karma: 0,
            comment_karma: 0,
            created_utc: 0,
            verified: false,
            is_gold: false
        };

        (fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockUserData
        });

        await fetchUserInfo(mockToken);

        const [url] = (fetch as any).mock.calls[0];
        expect(url.toString()).toBe('https://oauth.reddit.com/api/v1/me');
    });

    it('should handle network errors', async () => {
        (fetch as any).mockRejectedValue(new Error('Network error'));

        await expect(fetchUserInfo(mockToken)).rejects.toThrow('Network error');
    });
});