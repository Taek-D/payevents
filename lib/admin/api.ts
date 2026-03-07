export async function adminFetch(url: string, options?: RequestInit) {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "",
      ...options?.headers,
    },
  })
}
