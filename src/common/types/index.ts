export interface authcookie {
  accessToken: string;
}

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: string;
    id: string;
    tenant:string
  };
}

export interface PaginateQurytypes{
  page:number
  limit:number
}
