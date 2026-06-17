import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { IUserInfo } from "@/type";
import type { ILoginRequest, IRegisterRequest, IRegisterInstructorRequest } from "../types";

const PREFIX = API_PREFIX.IDENTITY;

export const authApi = {
  login: (data: ILoginRequest) =>
    axiosClient.post<IUserInfo>(`${PREFIX}/auth/login`, data),
  logout: () => axiosClient.post(`${PREFIX}/auth/logout`),
  register: (data: IRegisterRequest) =>
    axiosClient.post<IUserInfo>(`${PREFIX}/auth/register`, data),
  registerInstructor: (data: IRegisterInstructorRequest) =>
    axiosClient.post<IUserInfo>(`${PREFIX}/auth/register-instructor`, data),
  getMe: () => axiosClient.get<IUserInfo>(`${PREFIX}/users/me`),
  getUserById: (id: string) =>
    axiosClient.get<IUserInfo>(`${PREFIX}/users/${id}`),
};
export default authApi;
