import axios from 'axios'

export const http = axios.create({
  baseURL: 'https://api-sandbox-h01.vbot.vn/v1.0', // gốc API
  // baseURL: env.VITE_API_BASE,
  timeout: 15000,
})

// Request interceptor (nếu cần thêm header/token thì thêm ở đây)
http.interceptors.request.use(
  (config) => {
    // ví dụ: đính kèm token nếu có
    // const token = getTokenSomewhere()
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor: trả thẳng data
http.interceptors.response.use(
  (res) => res,
  (error) => {
    // log gọn để debug
    console.error('HTTP Error:', error?.response?.status, error?.message)
    return Promise.reject(error)
  },
)
