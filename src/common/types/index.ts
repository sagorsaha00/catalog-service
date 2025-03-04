export interface authcookie {
  accessToken: string;
}

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: string;
    id: string;
  };
}
