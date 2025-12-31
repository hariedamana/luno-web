const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
    constructor() {
        this.baseUrl = API_URL;
    }

    getAccessToken() {
        return localStorage.getItem('accessToken');
    }

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    setTokens(accessToken, refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const token = this.getAccessToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            // Handle token expiry
            if (response.status === 401) {
                try {
                    const data = await response.json();
                    if (data.code === 'TOKEN_EXPIRED') {
                        const refreshed = await this.refreshToken();
                        if (refreshed) {
                            // Retry with new token
                            headers['Authorization'] = `Bearer ${this.getAccessToken()}`;
                            const retryResponse = await fetch(url, { ...options, headers });
                            return this.handleResponse(retryResponse);
                        }
                    }
                } catch {
                    // JSON parse failed
                }
                // Clear tokens and redirect to login
                this.clearTokens();
                window.location.href = '/login';
                throw new Error('Authentication failed');
            }

            return this.handleResponse(response);
        } catch (error) {
            // Check if it's a network error (backend not running)
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
            }
            console.error('API Error:', error);
            throw error;
        }
    }

    async handleResponse(response) {
        // Check content type to avoid JSON parse errors
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            if (!response.ok) {
                throw new Error('Server error. Please ensure the backend is running.');
            }
            throw new Error('Invalid response from server');
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }
        return data;
    }

    async refreshToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return false;

        try {
            const response = await fetch(`${this.baseUrl}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                this.setTokens(data.accessToken, data.refreshToken);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    // Auth endpoints
    async register(email, password, name) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        });
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.setTokens(data.accessToken, data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    }

    async logout() {
        const refreshToken = this.getRefreshToken();
        try {
            await this.request('/auth/logout', {
                method: 'POST',
                body: JSON.stringify({ refreshToken }),
            });
        } finally {
            this.clearTokens();
        }
    }

    // User endpoints
    async getMe() {
        return this.request('/users/me');
    }

    async updateProfile(data) {
        return this.request('/users/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // Sessions endpoints
    async getSessions(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/sessions${query ? `?${query}` : ''}`);
    }

    async getSession(id) {
        return this.request(`/sessions/${id}`);
    }

    async createSession(data) {
        return this.request('/sessions', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateSession(id, data) {
        return this.request(`/sessions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteSession(id) {
        return this.request(`/sessions/${id}`, {
            method: 'DELETE',
        });
    }

    async deleteAllSessions() {
        return this.request('/sessions/all', {
            method: 'DELETE',
        });
    }

    async exportSession(id) {
        return this.request(`/sessions/${id}/export`, {
            method: 'POST',
        });
    }

    async transcribeSession(id) {
        return this.request(`/sessions/${id}/transcribe`, {
            method: 'POST',
        });
    }

    async generateTranscriptPdf(id) {
        return this.request(`/sessions/${id}/pdf`, {
            method: 'POST',
        });
    }

    // Modes endpoints
    async getModes() {
        return this.request('/modes');
    }

    async getMode(slug) {
        return this.request(`/modes/${slug}`);
    }

    async getModeWithSessions(slug) {
        return this.request(`/modes/${slug}/sessions`);
    }

    // Device endpoints
    async getDevice() {
        return this.request('/device');
    }

    async connectDevice() {
        return this.request('/device/connect', { method: 'POST' });
    }

    async disconnectDevice() {
        return this.request('/device/disconnect', { method: 'POST' });
    }

    async syncDevice() {
        return this.request('/device/sync', { method: 'POST' });
    }

    // Recorder endpoints
    async createRecorderSession(fileId, modeSlug, duration = 0) {
        return this.request('/recorder/session', {
            method: 'POST',
            body: JSON.stringify({ fileId, modeSlug, duration }),
        });
    }
}

export const api = new ApiService();
export default api;
