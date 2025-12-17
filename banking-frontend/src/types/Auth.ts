export interface User {
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
