import { describe, expect, it, beforeEach } from "vitest";
import { type UserInfo, UserInfoStorage } from "./userStorage";

beforeEach(() => {
    sessionStorage.clear();
});


describe("userInfoStorage", () => {
    const mockedUserInfo = {
        id: "mocked_id",
        name: "mocked_name",
        icon_img: "mocked_icon_img",
        link_karma: 10,
        comment_karma: 11,
        created_utc: 12,
        verified: false,
        is_gold: false
    } as UserInfo;

    describe("setUserInfo", () => {
        it("throws error if userInfo is incomplete", () => {
            // Test all fields of userInfo.
            for (let key of Object.keys(mockedUserInfo)) {
                const incompleteUserInfo = ({ ...mockedUserInfo, [key]: null });
                expect(() => { UserInfoStorage.setUserInfo(incompleteUserInfo) }).toThrowError();
            }
        });

        it("should not throw an error if userInfo is complete", () => {
            expect(() => { UserInfoStorage.setUserInfo(mockedUserInfo) }).not.toThrowError();
        });

        it("should set one item in sessionStorage", () => {
            UserInfoStorage.setUserInfo(mockedUserInfo);
            expect(sessionStorage.length).toEqual(1);
        });

        it("should set the data in sessionStorage in json string format", () => {
            UserInfoStorage.setUserInfo(mockedUserInfo);
            const key = sessionStorage.key(0);
            if (key !== null) {
                const storedObject = JSON.parse(sessionStorage.getItem(key) ?? "null");
                expect(storedObject).toEqual(mockedUserInfo);
            }
        });
    });

    describe("getUserInfo", () => {
        it("to return null if no userInfo is stored in sessionStorage", () => {
            expect(sessionStorage.length).toEqual(0);
            expect(UserInfoStorage.getUserInfo()).toBeNull();
        });

        it("to return userInfo that is stored in sessionStorage", () => {
            UserInfoStorage.setUserInfo(mockedUserInfo);
            expect(UserInfoStorage.getUserInfo()).toEqual(mockedUserInfo);
        });
    });

    describe("clearUserInfo", () => {
        it("should clear userInfo from session storage", () => {
            UserInfoStorage.setUserInfo(mockedUserInfo);
            expect(sessionStorage.length).toEqual(1);
            UserInfoStorage.clearUserInfo();
            expect(sessionStorage.length).toEqual(0);
        });
    });

    describe("hasValidUserInfo", () => {
        it("should return false if no userInfo is saved in session storage", () => {
            expect(UserInfoStorage.hasValidUserInfo()).toBe(false);
        });

        it("should return false if userInfo from storage is corrupted", () => {
            for (let key of Object.keys(mockedUserInfo)) {
                const corruptedUserInfo = ({ ...mockedUserInfo, [key]: null });
                sessionStorage.setItem("reddit_user_info", JSON.stringify(corruptedUserInfo));
                expect(UserInfoStorage.hasValidUserInfo()).toBe(false);
            }
        });

        it("should return true if valid userInfo is saved in session storage", () => {
            sessionStorage.setItem("reddit_user_info", JSON.stringify(mockedUserInfo));
            expect(UserInfoStorage.hasValidUserInfo()).toBe(true);
        });
    })
});