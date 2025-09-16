// Modules export a class
import { type RedditToken, SecureTokenStorage } from "./tokenStorage";
import { describe, it, expect, beforeEach } from "vitest";

/* Class has : 
- setToken
- getTokens
- clearTokens
- hasValidTokens
*/

// Unit test for each method
beforeEach(() => {
    sessionStorage.clear();
});

describe("SecureStorageToken", () => {
    const defaultRedditToken = {
        accessToken: "test-token",
        expiresAt: Date.now() + 3600,
        scope: "scope-1 scope-2"
    } as RedditToken;

    describe("setToken", () => {
        it("Sets 3 new tokens in the session storage.", () => {
            SecureTokenStorage.setToken(defaultRedditToken);
            expect(sessionStorage.length).toEqual(3);
        });

        it.todo("Encode the accessToken", () => {
            // TODO : Mock encode function and checks it has been called ?
        });
    });

    describe("getToken", () => {
        it("Returns null if no token is defined in the session storage", () => {
            const res = SecureTokenStorage.getToken();
            expect(res).toBeNull();
        });

        it("Returns the token object if the token is in the session storage", () => {
            SecureTokenStorage.setToken(defaultRedditToken);
            const res = SecureTokenStorage.getToken();
            expect(res).to.deep.equal(defaultRedditToken);
        });

        it("Returns null if the token is expired", () => {
            SecureTokenStorage.setToken({ ...defaultRedditToken, ...{ expiresAt: Date.now() - 2000 } });
            const res = SecureTokenStorage.getToken();
            expect(res).toBeNull();
        });

        it("Clears the token if it is expired", () => {
            SecureTokenStorage.setToken({ ...defaultRedditToken, ...{ expiresAt: Date.now() - 2000 } });
            SecureTokenStorage.getToken();
            expect(sessionStorage.length).toEqual(0);
        });
    });

    describe("clearToken", () => {
        it("to clear the token", () => {
            SecureTokenStorage.setToken(defaultRedditToken);
            expect(sessionStorage.length).not.toEqual(0);
            SecureTokenStorage.clearToken();
            expect(sessionStorage.length).toEqual(0);
        });
        it("to do nothing when no token is stored", () => {
            expect(sessionStorage.length).toEqual(0);
            SecureTokenStorage.clearToken();
            expect(sessionStorage.length).toEqual(0);
        });
    });

    describe("hasValidToken", () => {
        it("returns false if no token is stored", () => {
            expect(sessionStorage.length).toEqual(0);
            const res = SecureTokenStorage.hasValidToken();
            expect(res).toEqual(false);
        });

        it("returns false if token is expired", () => {
            SecureTokenStorage.setToken({ ...defaultRedditToken, ...{ expiresAt: Date.now() - 2000 } });
            const res = SecureTokenStorage.hasValidToken();
            expect(res).toEqual(false);
        });

        it("returns true if token is not expired", () => {
            SecureTokenStorage.setToken(defaultRedditToken);
            const res = SecureTokenStorage.hasValidToken();
            expect(res).toEqual(true);
        })
    })
});

