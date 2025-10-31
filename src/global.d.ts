// Báo cho TypeScript biết rằng chúng ta đang mở rộng một kiểu có sẵn
declare global {
  // Mở rộng interface WindowEventMap có sẵn của trình duyệt
  interface WindowEventMap {
    // Định nghĩa sự kiện mới:
    // tên sự kiện là 'theme-change' và nó sẽ mang theo một CustomEvent
    // với detail là { theme: string }
    'theme-change': CustomEvent<{ theme: string }>
  }
}

// Thêm dòng export {} trống này để biến file này thành một module
// điều này là cần thiết trong một số cấu hình dự án.
export {}
