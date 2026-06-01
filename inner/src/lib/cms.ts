const BASE = process.env.CMS_URL ?? 'http://localhost:3000'

interface PaginatedResponse<T> {
  docs: T[]
}

export async function fetchCollection<T>(
  slug: string,
  locale = 'en',
  params?: Record<string, string>
): Promise<T[]> {
  try {
    const url = new URL(`${BASE}/api/${slug}`)
    url.searchParams.set('locale', locale)
    url.searchParams.set('limit', '200')
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    const res = await fetch(url.toString(), { cache: 'no-store' })
    if (!res.ok) return []
    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) return []
    const data: PaginatedResponse<T> = await res.json()
    return data.docs ?? []
  } catch {
    return []
  }
}

export async function fetchGlobal<T>(slug: string, locale = 'en'): Promise<T | null> {
  try {
    const url = new URL(`${BASE}/api/globals/${slug}`)
    url.searchParams.set('locale', locale)
    const res = await fetch(url.toString(), { cache: 'no-store' })
    if (!res.ok) return null
    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) return null
    return res.json()
  } catch {
    return null
  }
}
