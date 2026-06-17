export interface IRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IRegisterInstructorRequest extends IRegisterRequest {
  headline?: string;
  biography?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}
