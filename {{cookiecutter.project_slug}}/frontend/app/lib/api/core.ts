export const apiCore = {
  url: process.env.NEXT_PUBLIC_API_URL,
  headers(token: string) {
    return {
      "Cache-Control": "no-cache",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  },
};
