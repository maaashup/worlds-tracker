declare global {
  namespace Express {
    interface Request {
      userId?: string;
      refreshToken?: string;
      
      user?: {
        id: string;
        username: string;
        isAdmin: boolean;
        isOwner: boolean;
      };
    }
  }
}

export {};