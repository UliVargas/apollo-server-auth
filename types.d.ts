import 'express-session';

interface User {
  id: number;
  email: string;
  role: string;
  name: string;
}

declare module 'express-session' {
  interface Session {
    sessionId?: number;
    user: User
  }
}