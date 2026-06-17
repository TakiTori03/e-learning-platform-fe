import { axiosClient } from "./index";
import { API_PREFIX } from "@/constants/api";
import axios from "axios";

const PREFIX = API_PREFIX.MEDIA;

export interface IMediaResponse {
  id: string;
  fileName: string;
  fileType: string;
  contentType: string;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
  transcriptUrl?: string;
  provider: string;
  status: string;
  duration?: number;
}

export interface IPresignedUrlResponse {
  uploadUrl: string;
  mediaId: string;
  objectKey: string;
}

export const mediaApi = {
  uploadImage: (file: File): Promise<IMediaResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.upload<IMediaResponse>(`${PREFIX}/upload/image`, formData);
  },

  uploadDocument: (file: File): Promise<IMediaResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.upload<IMediaResponse>(`${PREFIX}/upload/document`, formData);
  },

  requestPresignedUrl: (
    fileName: string,
    contentType: string
  ): Promise<IPresignedUrlResponse> => {
    return axiosClient.post<IPresignedUrlResponse>(
      `${PREFIX}/upload/request-presigned-url`,
      {},
      {
        params: { fileName, contentType },
      }
    );
  },

  uploadToPresignedUrl: (
    uploadUrl: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<void> => {
    return axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (onProgress) {
            onProgress(percent);
          }
        }
      },
    });
  },

  linkMediaToLesson: (
    mediaId: string,
    lessonId: string,
    courseId: string
  ): Promise<string> => {
    return axiosClient.put<string>(`${PREFIX}/${mediaId}/link`, {}, {
      params: { lessonId, courseId },
    });
  },

  deleteMedia: (id: string): Promise<string> => {
    return axiosClient.delete<string>(`${PREFIX}/${id}`);
  },

  getMediaById: (id: string): Promise<IMediaResponse> => {
    return axiosClient.get<IMediaResponse>(`${PREFIX}/${id}`);
  },

  getHlsKey: (keyId: string): Promise<ArrayBuffer> => {
    const gatewayBase = import.meta.env.VITE_API_URL || "http://localhost:8080";
    return axios
      .get(`${gatewayBase}${PREFIX}/keys/${keyId}`, {
        responseType: "arraybuffer",
        withCredentials: true,
      })
      .then((res) => res.data);
  },
};

export default mediaApi;
