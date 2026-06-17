import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { notification } from "antd";
import { v4 as uuidv4 } from "uuid";
import { API_PREFIX } from "@/constants/api";

// Định nghĩa kiểu dữ liệu AnyElement trực tiếp tại đây để tránh lỗi import
type AnyElement = any;

/**
 * Cấu trúc Response chuẩn từ Backend
 */
export interface IApiResponse<T = AnyElement> {
  success: boolean;
  message?: string;
  payload: T;
  errors?: string[];
  error?: string;
  id?: string | number;
  meta?: any;
}

const LogType = {
  REQUEST: "req",
  RESPONSE: "res",
  ERROR: "err",
} as const;

type LogType = (typeof LogType)[keyof typeof LogType];

const API_REQUEST_TIMEOUT = 30000;

const RESPONSE_CODE = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
};


const log = (...params: AnyElement[]) => {
  if (import.meta.env.DEV) {
    console.warn(...params);
  }
};

const requestLog = (
  method = "",
  url = "",
  data: AnyElement,
  type: LogType,
  baseURL: string,
) => {
  const tag =
    type === LogType.REQUEST || type === LogType.RESPONSE
      ? method
      : LogType.ERROR;

  const colors = {
    [LogType.REQUEST]: "#3b82f6",
    [LogType.RESPONSE]: "#10b981",
    [LogType.ERROR]: "#ef4444",
  };

  const icons = {
    [LogType.REQUEST]: ">>>",
    [LogType.RESPONSE]: "<<<",
    [LogType.ERROR]: "xxx",
  };

  log(
    `%c${icons[type]} [${tag.toUpperCase()}] | %c${url.replace(baseURL, "")} \n`,
    `color: ${colors[type]}; font-weight: bold`,
    "color: violet; font-weight: bold",
    data,
  );
};

const customParamsSerializer = (params: AnyElement): string => {
  const searchParams = new URLSearchParams();
  const serialize = (key: string, value: AnyElement) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
    } else if (typeof value === "object") {
      Object.keys(value).forEach((k) => serialize(`${key}.${k}`, value[k]));
    } else {
      searchParams.append(key, String(value));
    }
  };
  Object.keys(params || {}).forEach((key) => serialize(key, params[key]));
  return searchParams.toString();
};

abstract class HttpClient {
  protected readonly instance: AxiosInstance;
  protected readonly longDurationInstance: AxiosInstance;

  protected constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: API_REQUEST_TIMEOUT,
      withCredentials: true,
      paramsSerializer: {
        serialize: customParamsSerializer,
      },
    });

    this.longDurationInstance = axios.create({
      baseURL,
      timeout: 0, // Vô hạn timeout cho upload/download tệp dung lượng lớn
      withCredentials: true,
      paramsSerializer: {
        serialize: customParamsSerializer,
      },
    });

    this._initializeInterceptors(this.instance);
    this._initializeInterceptors(this.longDurationInstance);
  }

  private _initializeInterceptors = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
      this._handleRequest as any,
      this._handleError,
    );
    instance.interceptors.response.use(
      this._handleResponse as any,
      this._handleError,
    );
  };

  private _handleRequest = (config: InternalAxiosRequestConfig) => {
    config.headers["x-client-request-id"] = uuidv4();
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    requestLog(
      config.method,
      config.url,
      config,
      LogType.REQUEST,
      config.baseURL || "",
    );
    return config;
  };

  private _handleResponse = (response: AxiosResponse<IApiResponse>) => {
    requestLog(
      response.config.method,
      response.config.url,
      response,
      LogType.RESPONSE,
      response.config.baseURL || "",
    );

    const { success, payload, errors, error, message } = response.data;

    if (success) {
      return payload;
    }

    const descriptiveError = errors?.length
      ? errors.join(", ")
      : error || message || "Đã có lỗi hệ thống xảy ra";

    return Promise.reject({
      message: descriptiveError,
      ...response.data,
    });
  };

  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];
  private broadcastChannel = new BroadcastChannel("auth_channel");

  private subscribeTokenRefresh(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.map((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private _handleError = async (error: AnyElement) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    const errorData: IApiResponse = error?.response?.data || {
      success: false,
      message: "Kết nối máy chủ thất bại",
      payload: null,
    };

    const descriptiveError = errorData.errors?.length
      ? errorData.errors.join(", ")
      : errorData.error || errorData.message || "Đã có lỗi xảy ra";

    requestLog(
      originalRequest?.method,
      originalRequest?.url,
      error,
      LogType.ERROR,
      originalRequest?.baseURL || "",
    );

    this.broadcastChannel.onmessage = (event) => {
      if (event.data.type === "REFRESH_SUCCESS") {
        this.onRefreshed("refreshed");
      }
    };

    // Tự động silent refresh qua cookie
    if (status === RESPONSE_CODE.UNAUTHORIZED && !originalRequest._retry) {
      if (this.isRefreshing) {
        return new Promise((resolve) => {
          this.subscribeTokenRefresh(() => {
            resolve(this.instance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      try {
        log("BFF: Attempting silent refresh...");
        const bffUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
        await axios.post(
          `${bffUrl}${API_PREFIX.IDENTITY}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        log("BFF: Refresh success!");
        this.isRefreshing = false;
        this.onRefreshed("refreshed");

        this.broadcastChannel.postMessage({ type: "REFRESH_SUCCESS" });

        return this.instance(originalRequest);
      } catch (refreshError) {
        log("BFF: Refresh failed. Token might be expired or revoked.");
        this.isRefreshing = false;

        // Lazy import useAuthStore từ store toàn cục mới của bạn để tránh Circular Dependency
        const { useAuthStore } = await import("@/store/useAuthStore");
        useAuthStore.getState().logout();

        return Promise.reject(refreshError);
      }
    }

    if (status === RESPONSE_CODE.FORBIDDEN) {
      notification.warning({
        message: "Bạn không có quyền thực hiện hành động này",
      });
    }

    return Promise.reject({
      ...errorData,
      message: descriptiveError,
    });
  };

  public get = <T>(
    url: string,
    params = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> =>
    this.instance.get(url, { params, ...config }) as unknown as Promise<T>;

  public post = <T>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> =>
    this.instance.post(url, data, config) as unknown as Promise<T>;

  public put = <T>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> =>
    this.instance.put(url, data, config) as unknown as Promise<T>;

  public patch = <T>(
    url: string,
    data = {},
    config: AxiosRequestConfig = {},
  ): Promise<T> =>
    this.instance.patch(url, data, config) as unknown as Promise<T>;

  public delete = <T>(
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<T> => this.instance.delete(url, config) as unknown as Promise<T>;

  public upload = <T>(
    url: string,
    data: FormData,
    config: AxiosRequestConfig = {},
  ): Promise<T> =>
    this.longDurationInstance.post(url, data, {
      ...config,
      headers: { "Content-Type": "multipart/form-data" },
    }) as unknown as Promise<T>;
}

class MainHttpClient extends HttpClient {
  constructor() {
    super(import.meta.env.VITE_API_URL || "http://localhost:8080");
  }
}

export const axiosClient = new MainHttpClient();

export default HttpClient;
