export const API_ENDPOINTS = {
  //
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  RITUAL: {
    BASE: "/ritual",
  },
  RITUAL_CATEGORY: {
    BASE: "/ritual-category",
  },
};

export const QUERY_KEYS = {
  ME: ["me"] as const,
  RITUALS: ["rituals"] as const,
  RITUAL_DETAIL: (id: string) => ["ritual", id] as const,
  RITUAL_CATEGORIES: ["ritual-categories"] as const,
} as const;
export const DIFFICULTY_LEVELS = [
  { value: "dễ", label: "Dễ" },
  { value: "trung bình", label: "Trung bình" },
  { value: "khó", label: "Khó" },
  { value: "rất khó", label: "Rất khó" },
] as const;
