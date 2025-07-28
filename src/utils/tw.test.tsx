import { describe, it, expect } from "vitest";
import tw from "./tw";

describe("tw utility function", () => {

    it("should return the input string", () => {
        const input = "bg-red-500 text-white";
        const result = tw(input);
        expect(result).toBe(input);
    });
})