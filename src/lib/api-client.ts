
interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';


export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    super(`Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function fetchClient<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...rest } = options;

  let url = `${BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const defaultHeaders: HeadersInit = {};

  if (rest.body) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    ...rest,
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorBody);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  // Check if response has content
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse response JSON", e);
    // Return text if it's not JSON? Or throw?
    // Assuming API always returns JSON if it sends content.
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
  }
}
