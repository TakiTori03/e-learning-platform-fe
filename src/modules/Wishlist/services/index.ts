import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { ICourse } from "@/type";

const INTERACTION_PREFIX = API_PREFIX.INTERACTION;
const AGGREGATOR_PREFIX = API_PREFIX.AGGREGATOR;

export const wishlistApi = {
  getWishlist: (): Promise<ICourse[]> => {
    return axiosClient.get<ICourse[]>(`${AGGREGATOR_PREFIX}/courses/wishlist`);
  },

  addToWishlist: (courseId: string): Promise<void> => {
    return axiosClient.post(`${INTERACTION_PREFIX}/wishlists`, {
      courseId,
    });
  },

  removeFromWishlist: (courseId: string): Promise<void> => {
    return axiosClient.delete(`${INTERACTION_PREFIX}/wishlists/${courseId}`);
  },

  checkWishlistStatus: (courseId: string): Promise<boolean> => {
    return axiosClient.get<boolean>(`${INTERACTION_PREFIX}/wishlists/status/${courseId}`);
  },
};
