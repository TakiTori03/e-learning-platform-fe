import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { IUserInfo, IListResponse } from "@/type";

const IDENTITY_PREFIX = `${API_PREFIX.IDENTITY}/admin/users`;

export const userApi = {
  // 1. Get all users (pageable)
  getAllUsers: (params: {
    page: number;
    size: number;
    q?: string;
    role?: string;
    status?: string;
  }): Promise<IListResponse<IUserInfo>> => {
    return axiosClient.get<IListResponse<IUserInfo>>(IDENTITY_PREFIX, {
      ...params,
      page: params.page > 0 ? params.page - 1 : 0,
    });
  },

  // 2. Get user by ID
  getUserById: (id: string): Promise<IUserInfo> => {
    return axiosClient.get<IUserInfo>(`${IDENTITY_PREFIX}/${id}`);
  },

  // 3. Update user status (ACTIVE, LOCKED, PENDING)
  updateUserStatus: (id: string, status: string): Promise<void> => {
    return axiosClient.put<void>(`${IDENTITY_PREFIX}/${id}/status`, {}, {
      params: { status },
    });
  },

  // 4. Approve instructor application
  approveInstructor: (id: string): Promise<void> => {
    return axiosClient.put<void>(`${IDENTITY_PREFIX}/${id}/approve-instructor`);
  },

  // 5. Assign system role (ADMIN, INSTRUCTOR, STUDENT)
  assignRole: (id: string, roleName: string): Promise<void> => {
    return axiosClient.post<void>(`${IDENTITY_PREFIX}/${id}/roles`, {}, {
      params: { roleName },
    });
  },
};

export default userApi;
