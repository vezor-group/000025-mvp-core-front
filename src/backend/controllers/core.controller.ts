export class CoreController {
	protected baseURL: string

	constructor() {
		this.baseURL = process.env.NEXT_PUBLIC_API_URL || ''
	}

	protected async fetch(
		endpoint: string,
		options?: RequestInit,
	): Promise<Response> {
		const url = `${this.baseURL}${endpoint}`
		return fetch(url, options)
	}

	protected async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
		const response = await this.fetch(endpoint, {
			method: 'GET',
			headers,
		})
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		return response.json()
	}

	protected async post<T>(
		endpoint: string,
		data?: unknown,
		headers?: HeadersInit,
	): Promise<T> {
		const response = await this.fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
			body: data ? JSON.stringify(data) : undefined,
		})
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		return response.json()
	}

	protected async put<T>(
		endpoint: string,
		data?: unknown,
		headers?: HeadersInit,
	): Promise<T> {
		const response = await this.fetch(endpoint, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
			body: data ? JSON.stringify(data) : undefined,
		})
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		return response.json()
	}

	protected async delete<T>(
		endpoint: string,
		headers?: HeadersInit,
	): Promise<T> {
		const response = await this.fetch(endpoint, {
			method: 'DELETE',
			headers,
		})
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		return response.json()
	}
}
