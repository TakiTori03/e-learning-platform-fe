
export interface ICategorySearchRequest {
  page: number;
  size: number;
  q?: string;
}

export interface ICreateCategoryRequest {
  name: string;
  description: string;
  icon?: string;
}

export interface IUpdateCategoryRequest {
  id: string;
  body: ICreateCategoryRequest;
}

export interface ICategoryCourseCountsResponse {
  [key: string]: number;
}
