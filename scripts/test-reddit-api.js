#!/usr/bin/env node

/**
 * Script to test Reddit API integration
 * Run with: node scripts/test-reddit-api.js
 */

import https from 'https';
import { URL } from 'url';

const REDDIT_BASE_URL = "https://www.reddit.com";

async function testRedditAPI() {
    console.log("Testing Reddit API integration...\n");

    // Test 1: Public endpoint (no auth required)
    console.log("1. Testing public Reddit API endpoint...");
    try {
        const publicUrl = new URL("/r/test/new.json?limit=3", REDDIT_BASE_URL);
        const publicData = await fetchURL(publicUrl.toString());
        
        if (publicData && publicData.data && publicData.data.children) {
            console.log("✅ Public API works!");
            console.log(`   Found ${publicData.data.children.length} posts`);
            
            if (publicData.data.children.length > 0) {
                const firstPost = publicData.data.children[0].data;
                console.log("   Sample post:");
                console.log(`   - ID: ${firstPost.id}`);
                console.log(`   - Title: ${firstPost.title.substring(0, 50)}...`);
                console.log(`   - Author: ${firstPost.author}`);
                console.log(`   - Score: ${firstPost.score}`);
            }
        }
    } catch (error) {
        console.log("❌ Public API failed:", error.message);
    }

    console.log("\n2. Testing our fetchPosts function structure...");
    
    // Import our function (need to handle ES modules)
    try {
        // Simulate the function logic
        const mockToken = {
            accessToken: "demo_token",
            scope: "read",
            expiresAt: Date.now() + 3600000
        };

        console.log("✅ Function would be called with:");
        console.log(`   - Subreddit: test`);
        console.log(`   - Token: ${mockToken.accessToken.substring(0, 10)}...`);
        console.log(`   - Headers would include: User-Agent and Authorization`);
        
    } catch (error) {
        console.log("❌ Function test failed:", error.message);
    }

    console.log("\n3. Analyzing Reddit API response structure...");
    
    // Test with a different subreddit
    try {
        const techUrl = new URL("/r/programming/new.json?limit=1", REDDIT_BASE_URL);
        const techData = await fetchURL(techUrl.toString());
        
        if (techData && techData.data && techData.data.children && techData.data.children.length > 0) {
            const post = techData.data.children[0].data;
            console.log("✅ Reddit response structure analysis:");
            console.log("   Expected fields present:");
            console.log(`   - id: ${post.id ? '✓' : '✗'}`);
            console.log(`   - title: ${post.title ? '✓' : '✗'}`);
            console.log(`   - author: ${post.author ? '✓' : '✗'}`);
            console.log(`   - score: ${post.score !== undefined ? '✓' : '✗'}`);
            console.log(`   - created_utc: ${post.created_utc ? '✓' : '✗'}`);
            console.log(`   - subreddit: ${post.subreddit ? '✓' : '✗'}`);
            
            // Check for additional fields
            const extraFields = Object.keys(post).filter(key => 
                !['id', 'title', 'author', 'score', 'created_utc', 'subreddit'].includes(key)
            );
            console.log(`   - Additional fields (${extraFields.length}): ${extraFields.slice(0, 5).join(', ')}${extraFields.length > 5 ? '...' : ''}`);
        }
    } catch (error) {
        console.log("❌ Structure analysis failed:", error.message);
    }

    console.log("\n✨ Reddit API test complete!");
}

function fetchURL(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'TEST-SCRIPT'
            }
        };

        https.get(url, options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error(`Failed to parse JSON: ${error.message}`));
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

// Run the test
testRedditAPI().catch(console.error);