import apiClient from "@/lib/axios";
import type { User } from "./types";

export const userService = {
  async getMe(): Promise<User> {
    const payload = (await apiClient.get("user/me")) as User;

    if (!payload) {
      throw new Error("Profile data is undefined");
    }

    return payload;
  },
};
