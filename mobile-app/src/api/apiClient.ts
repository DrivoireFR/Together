import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import { DataSuccess, DataError, type ApiResult } from '../utils/DataResult';
import { API_BASE_URL, STORAGE_KEYS, HTTP_STATUS } from '../constants';
import { StorageUtil } from '../utils/storage';
import { router } from 'expo-router';
import type { ApiError } from '../types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      async (config) => {
        const token = await StorageUtil.getItem<string>(STORAGE_KEYS.TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          await StorageUtil.removeItem(STORAGE_KEYS.TOKEN);
          await StorageUtil.removeItem(STORAGE_KEYS.USER);
          router.replace('/(auth)/login');
        }
        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string): Promise<ApiResult<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url);
      return new DataSuccess(response.data);
    } catch (error) {
      return this.handleError<T>(error as AxiosError);
    }
  }

  async post<T>(url: string, data?: unknown): Promise<ApiResult<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data);
      return new DataSuccess(response.data);
    } catch (error) {
      return this.handleError<T>(error as AxiosError);
    }
  }

  async put<T>(url: string, data?: unknown): Promise<ApiResult<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data);
      return new DataSuccess(response.data);
    } catch (error) {
      return this.handleError<T>(error as AxiosError);
    }
  }

  async delete<T>(url: string): Promise<ApiResult<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url);
      return new DataSuccess(response.data);
    } catch (error) {
      return this.handleError<T>(error as AxiosError);
    }
  }

  private handleError<T>(error: AxiosError): DataError<T> {
    const apiError = error.response?.data as ApiError;
    const message = apiError?.message || error.message || 'Une erreur est survenue';
    const statusCode = error.response?.status || 0;
    return new DataError<T>(message, statusCode, error);
  }
}

export const apiClient = new ApiClient();
