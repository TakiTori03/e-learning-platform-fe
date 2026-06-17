import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { IUserInfo } from "@/type";

const IDENTITY_PREFIX = API_PREFIX.IDENTITY;

export interface IUpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  headline?: string;
  biography?: string;
  language?: string;
  socials?: Record<string, string>;
  showProfile?: boolean;
  showCourses?: boolean;
}

export interface IChangePasswordRequest {
  oldPassword?: string;
  newPassword?: string;
}

export const profileApi = {
  updateProfile: (data: IUpdateProfileRequest) =>
    axiosClient.put<IUserInfo>(`${IDENTITY_PREFIX}/users/me`, data),

  changePassword: (data: IChangePasswordRequest) =>
    axiosClient.post(`${IDENTITY_PREFIX}/auth/change-password`, data),
};
