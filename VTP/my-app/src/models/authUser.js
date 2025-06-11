class AuthUser {
    // Lưu token vào sessionStorage
    static saveToken(token) {
        if (!token) {
            console.error('No token provided to save');
            return;
        }
        sessionStorage.setItem('user', JSON.stringify(token)); 
    }

    // Lấy token từ sessionStorage
    static getToken() {
        const token = sessionStorage.getItem('token');
        try {
            return token ? JSON.parse(token) : null;
        } catch (error) {
            console.error('Error parsing token from sessionStorage:', error);
            return null;
        }
    }

    // Kiểm tra xem user có được xác thực không
    static isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = this.decodeToken(token);
            if (!payload || !payload.exp) {
                console.warn('Token payload missing expiration');
                return false;
            }
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp > currentTime; // True nếu token chưa hết hạn
        } catch (error) {
            console.error('Error validating token:', error);
            return false;
        }
    }

    // Giải mã token để lấy thông tin
    static decodeToken(token) {
        if (!token || typeof token !== 'string') {
            throw new Error('Invalid token format');
        }

        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Token must have 3 parts (header, payload, signature)');
        }

        const base64Url = parts[1]; // Lấy phần payload
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    }

    // Lấy username từ token
    static getUsername() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = this.decodeToken(token);
            return payload.username || payload.sub || null; // Linh hoạt với key username
        } catch (error) {
            console.error('Error decoding token for username:', error);
            return null;
        }
    }

    static getIdUser() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = this.decodeToken(token);
            return payload.id_user || payload.sub || null; // Linh hoạt với key username
        } catch (error) {
            console.error('Error decoding token for username:', error);
            return null;
        }
    }

    // Xử lý đăng xuất
    static logout() {
        sessionStorage.removeItem('token');
    }
}

export default AuthUser;