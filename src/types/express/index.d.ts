// to make the file a module and avoid the TypeScript error
export {};
interface FakeUser {
  _id: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: FakeUser;
    }
  }
}
