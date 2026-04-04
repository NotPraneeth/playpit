import { getAuthHeader } from "./getAuthHeader"

export async function apiFetch<T = any>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL!
    const authHeaders = await getAuthHeader()

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
            ...(options?.headers || {}),
        },
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(`API Error: ${res.status} - ${text}`)
    }

    return res.json()
}