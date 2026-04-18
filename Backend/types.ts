import { Socket } from "socket.io";

export interface UserPayload {
  userid: string;
  name: string;
  iat?: number;
}

export interface AuthenticatedSocket extends Socket {
  user: UserPayload;
}

export interface ChatMessage {
  to: string;
  from: string;
  content: string;
}

export interface FriendInfo {
  name: string;
  userid: string;
  connected: boolean;
}

export interface FriendRequest {
  from: string;
  to: string;
}
