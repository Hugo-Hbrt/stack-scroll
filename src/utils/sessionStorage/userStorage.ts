export interface UserInfo {
  id: string;
  name: string;
  icon_img: string;
  link_karma: number;
  comment_karma: number;
  created_utc: number;
  verified: boolean;
  is_gold: boolean;
};

export class UserInfoStorage {
    private static readonly USER_INFO_KEY = 'reddit_user_info' as string;
    
    private static verifyUserInfoIsComplete = (userInfo: UserInfo) => {
        
        let isValid = true;
        isValid &&= (userInfo.id != null && userInfo.id !== '');
        isValid &&= (userInfo.name != null);
        isValid &&= (userInfo.icon_img != null);
        isValid &&= (userInfo.link_karma != null);
        isValid &&= (userInfo.comment_karma != null);
        isValid &&= (userInfo.created_utc != null);
        isValid &&= (userInfo.verified != null);
        isValid &&= (userInfo.is_gold != null);

        if (!isValid) {
            throw new Error("User info is incomplete");
        }
    }

    static setUserInfo = (userInfo: UserInfo) => {

        try {
            this.verifyUserInfoIsComplete(userInfo);
            sessionStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
        } catch (error) {
            throw error;
        }
    }

    static getUserInfo = () : UserInfo | null => {
        const userInfoString = sessionStorage.getItem(this.USER_INFO_KEY);
        const userInfo = (userInfoString === null) ? null : JSON.parse(userInfoString) as UserInfo;
        return userInfo;
    }

    static clearUserInfo = () => {
        sessionStorage.removeItem(this.USER_INFO_KEY);
    }

    static hasValidUserInfo = () => {
        
        const userInfo = this.getUserInfo();
        try {
            this.verifyUserInfoIsComplete(userInfo ?? {} as UserInfo);
        } catch (error) {
            return false;
        }
        return true;
    }
}