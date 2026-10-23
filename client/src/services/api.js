const API_BASE_URL = '/api';

class ApiService {
  getToken() {
    return localStorage.getItem('eatlays_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('eatlays_token', token);
    } else {
      localStorage.removeItem('eatlays_token');
    }
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.errors = data.errors || [];
        throw error;
      }

      return data;
    } catch (err) {
      throw err;
    }
  }

  // Auth endpoints
  async register(name, email, password, confirmPassword) {
    return this.request('/auth/register', {
      method: 'POST',
      body: { name, email, password, confirmPassword },
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async getMe() {
    return this.request('/auth/me', { method: 'GET' });
  }

  async logout() {
    this.setToken(null);
    return this.request('/auth/logout', { method: 'POST' }).catch(() => ({}));
  }

  // Outlets endpoints
  async getOutlets(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/outlets${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async getOutletById(id) {
    return this.request(`/outlets/${id}`, { method: 'GET' });
  }

  async getCategories(outletId) {
    const query = outletId ? `?outletId=${outletId}` : '';
    return this.request(`/outlets/categories${query}`, { method: 'GET' });
  }

  // Student orders
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: orderData,
    });
  }

  async getMyOrders() {
    return this.request('/orders/my-orders', { method: 'GET' });
  }

  async getOrderById(id) {
    return this.request(`/orders/${id}`, { method: 'GET' });
  }

  // Vendor endpoints
  async getVendorOrders(status) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/vendor/orders${query}`, { method: 'GET' });
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/vendor/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { status },
    });
  }

  async getVendorOutlet() {
    return this.request('/vendor/outlet', { method: 'GET' });
  }

  async updateOutletStatus(statusData) {
    return this.request('/vendor/outlet/status', {
      method: 'PATCH',
      body: statusData,
    });
  }

  async getVendorMenuItems() {
    return this.request('/vendor/menu-items', { method: 'GET' });
  }

  async createMenuItem(itemData) {
    return this.request('/vendor/menu-items', {
      method: 'POST',
      body: itemData,
    });
  }

  async updateMenuItem(id, itemData) {
    return this.request(`/vendor/menu-items/${id}`, {
      method: 'PATCH',
      body: itemData,
    });
  }

  async toggleItemAvailability(id) {
    return this.request(`/vendor/menu-items/${id}/availability`, {
      method: 'PATCH',
    });
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request('/admin/stats', { method: 'GET' });
  }

  async getAdminOutlets() {
    return this.request('/admin/outlets', { method: 'GET' });
  }

  async createAdminOutlet(data) {
    return this.request('/admin/outlets', {
      method: 'POST',
      body: data,
    });
  }

  async updateAdminOutlet(id, data) {
    return this.request(`/admin/outlets/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async getAdminUsers(role) {
    const query = role ? `?role=${role}` : '';
    return this.request(`/admin/users${query}`, { method: 'GET' });
  }

  async assignVendor(userId, outletId) {
    return this.request('/admin/assign-vendor', {
      method: 'POST',
      body: { userId, outletId },
    });
  }

  async getAdminOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/orders${query ? `?${query}` : ''}`, { method: 'GET' });
  }
}

export const api = new ApiService();
export default api;
