// utils/themeSignal.ts
import { signal, effect } from 'omi'
// Hàm phát hiện theme hiện tại từ nhiều nguồn universal
function detectCurrentTheme(): string {
  // 0. Kiểm tra localStorage key trước tiên (Độ ưu tiên cao nhất)
  const localTheme = localStorage.getItem('vbot-console-active-theme-name-key')
  if (localTheme === 'dark' || localTheme === 'normal' || localTheme === 'system') {
    console.log('Theme detected from localStorage:', localTheme)
    return localTheme
  }

  // 1. Kiểm tra CSS custom property trên :root
  const rootStyle = getComputedStyle(document.documentElement)
  const primaryColor = rootStyle.getPropertyValue('--primary').trim()
  const bgColor = rootStyle.getPropertyValue('--vb-bg').trim() || rootStyle.getPropertyValue('background-color').trim()

  // Dark theme indicators
  if (primaryColor === '#3e87e0' || bgColor === '#141414' || bgColor === 'rgb(38, 38, 38)' || bgColor === '#2c3e50') {
    return 'dark'
  }

  // 2. Kiểm tra class trên document.documentElement
  const htmlElement = document.documentElement
  if (
    htmlElement.classList.contains('dark') ||
    htmlElement.classList.contains('dark-theme') ||
    htmlElement.classList.contains('theme-dark')
  ) {
    return 'dark'
  }

  // 3. Kiểm tra data-theme attribute
  const dataTheme = htmlElement.getAttribute('data-theme')
  if (dataTheme === 'dark') return 'dark'
  if (dataTheme === 'system') return 'system'

  // 4. Kiểm tra body class (một số framework dùng body)
  if (document.body?.classList.contains('dark') || document.body?.classList.contains('dark-theme')) {
    return 'dark'
  }

  // 5. Kiểm tra prefers-color-scheme nếu không tìm thấy
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'system'
  }

  // 6. Fallback to light
  return 'normal'
}

// Global theme signal
export const themeSignal = signal(detectCurrentTheme())
// Helper function để components dễ sử dụng
export function useTheme(component: any) {
  let disposed = false

  // Effect sẽ chạy mỗi khi themeSignal thay đổi
  const dispose = effect(() => {
    if (disposed) return

    const theme = themeSignal.value
    const hostElement = component as unknown as HTMLElement

    // Update host class
    hostElement.classList.remove('normal', 'dark', 'normal')
    if (theme === 'dark') {
      hostElement.classList.add('dark')
    } else if (theme === 'system') {
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (systemIsDark) {
        hostElement.classList.add('dark')
      }
    }

    // Trigger re-render
    component.update()
    console.log(`${component.constructor.name} updated theme:`, theme)
  })

  return () => {
    disposed = true
    dispose()
  }
}

// Listen to window events và sync với signal
window.addEventListener('theme-change', (e: CustomEvent) => {
  themeSignal.value = e.detail.theme
})

// Để debug dễ hơn
if (typeof window !== 'undefined') {
  ;(window as any).themeSignal = themeSignal
}
