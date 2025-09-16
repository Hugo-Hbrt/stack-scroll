import { describe, it, expect, beforeEach, assert } from "vitest"
import { generateOAuthUrl, generateRandomString } from "./authorization";

describe("generateOAuthUrl", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    it("generates a url with string format", () => {
        const url = generateOAuthUrl();
        expect(typeof url).toBe("string");
        expect(isValidUrl(url)).toBe(true);
    });

    it("saves the OAuth state in sessionStorage", () => {
        expect(sessionStorage.length).toEqual(0);
        const url = generateOAuthUrl();
        expect(sessionStorage.length).toEqual(1);

        // Find state in url
        const matches = url.match(new RegExp("state=(.{16})"));
        if (!matches)
        {
            assert.fail();
        }
        const stateFromUrl = matches[1]
        
        // State from storage
        const key = sessionStorage.key(0) as string;
        const stateFromStorage = sessionStorage.getItem(key);
        
        expect(stateFromStorage).toBe(stateFromUrl);
    });
});

describe("generateRandomString", () => {
    const lengths = [1, 10, 100];

    for (let length of lengths) {
        it(`generate a string of specified length (${length})`, () => {
            expect(generateRandomString(length).length).toEqual(length);
        });
    }
});