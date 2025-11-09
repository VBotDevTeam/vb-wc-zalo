import { getAllZaloOAAPI } from '@/api/zalo-oa'
import '@/components/VbAiChatItem'
import { sharedStyle } from '@/style/sharedStyle'
import { tailwind } from '@/tailwind'
import { useTheme } from '@/utils/themeSignal'
import { Component, tag } from 'omi'
import { ZaloOAItem } from './models/zaloOAItem'


declare global {
  interface Window {
    handleZaloOAuthResult?: (success: boolean, message?: string) => void
  }
}


type Props = {
  projectCode: string
}


type State = {
  loading: boolean
  error: string | null
  items: ZaloOAItem[]
  projectCode: string
  oauthStatus: 'idle' | 'authorizing' | 'success' | 'error',
  imageErrors: { [key: number]: boolean }
}


@tag('vb-wc-zalo')
export default class extends Component<Props> {
  static css = [tailwind, sharedStyle]


  state: State = {
    loading: false,
    error: null,
    items: [],
    projectCode: '',
    oauthStatus: 'idle',
    imageErrors: {}
  }


  // Public method for parent page to call
  public openZaloOAPopup() {
    this.handleAddZaloOAPopup()
  }


  private disposeTheme?: () => void
  private popupCheckInterval?: number


  install() {
    this.disposeTheme = useTheme(this)
    window.handleZaloOAuthResult = this.handleZaloOAuthResult
  }


  installed() {
    console.log('Component installed with props:', this.props.projectCode)

    // Check OAuth callback when popup loads this page
    this.checkOAuthResult()


    this.addEventListener('props-updated', (e: any) => {
      const projectCode = e.detail.projectCode
      if (projectCode) {
        this.state.projectCode = projectCode
        this.state.error = null
        this.loadData()
      }
    })


    if (this.props.projectCode) {
      this.state.projectCode = this.props.projectCode
      this.loadData()
    } else {
      this.state.error = 'Waiting for data from parent page...'
      this.update()
    }
  }


  uninstall() {
    this.disposeTheme?.()
    if (this.popupCheckInterval) clearInterval(this.popupCheckInterval)
    delete window.handleZaloOAuthResult
  }


  private async loadData() {
    this.state.loading = true
    this.state.error = null
    this.update()


    try {
      const result = await getAllZaloOAAPI({ p_code: this.state.projectCode })
      this.state.items = result.data
    } catch (err: any) {
      this.state.error = err?.message || 'Unable to load Zalo OA data.'
      this.state.items = []
    } finally {
      this.state.loading = false
      this.update()
    }
  }


  receiveProps(nextProps: Props) {
    if (nextProps.projectCode !== this.props.projectCode) {
      this.state.projectCode = nextProps.projectCode
      this.loadData()
    }
  }


  // Check OAuth code when popup loads the main app page
  private checkOAuthResult() {
    const currentUrl = new URL(window.location.href)
    const code = currentUrl.searchParams.get('code')


    // If code exists and this is a popup (window.opener exists)
    if (code && window.opener) {
      const isSuccess = (code === '200')
      const message = isSuccess ? 'OA link added successfully!' : 'Failed to add OA link!'


      if (window.opener.handleZaloOAuthResult) {
        window.opener.handleZaloOAuthResult(isSuccess, message)
      }



      // Close popup immediately
      window.close()
    }
  }


  private handleZaloOAuthResult = (success: boolean, message?: string) => {
    if (this.popupCheckInterval) {
      clearInterval(this.popupCheckInterval)
      this.popupCheckInterval = undefined
    }


    if (success) {
      this.state.oauthStatus = 'success'
      this.state.error = null
      this.update()
      this.showNotification('🎉 ' + message, 'success')


      this.loadData()
      this.state.oauthStatus = 'idle'
      this.update()
    } else {
      this.state.oauthStatus = 'error'
      this.state.error = message || 'Failed to add OA link!'
      this.update()
      this.showNotification('❌ ' + this.state.error, 'error')


      this.state.oauthStatus = 'idle'
      this.state.error = null
      this.update()
    }
  }


  // private handleAddZaloOAPopup = () => {
  //   const oauthUrl = `https://zalo-sandbox.vbot.vn/oa/connect?p_code=${this.state.projectCode}&callback_uri=${window.location.href}/#/omi`


  //   const popup = window.open(oauthUrl, 'zalo-oauth', 'width=600,height=700,scrollbars=yes,resizable=yes')


  //   if (!popup) {
  //     this.showNotification('❌ Popup was blocked. Please allow popups and try again.', 'error')
  //     return
  //   }


  //   this.state.oauthStatus = 'authorizing'
  //   this.update()


  //   this.monitorPopup(popup)
  // }


  private handleAddZaloOAPopup = () => {
    // Callback page URL (adjust to your actual domain)
    const callbackUrl = `${window.location.origin}/oauth-callback.html`

    // OAuth URL with callback_uri pointing to the callback page
    const oauthUrl = `https://zalo-sandbox.vbot.vn/oa/connect?p_code=${this.state.projectCode}&callback_uri=${encodeURIComponent(callbackUrl)}`


    console.log('Opening OAuth popup with URL:', oauthUrl)
    console.log('Callback URL:', callbackUrl)


    const popup = window.open(
      oauthUrl,
      'zalo-oauth',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    )


    if (!popup) {
      this.showNotification('❌ Popup was blocked. Please allow popups and try again.', 'error')
      return
    }


    this.state.oauthStatus = 'authorizing'
    this.update()


    this.monitorPopup(popup)
  }



  private monitorPopup(popup: Window) {
    this.popupCheckInterval = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(this.popupCheckInterval!)
          this.popupCheckInterval = undefined


          if (this.state.oauthStatus === 'authorizing') {
            this.state.oauthStatus = 'idle'
            this.update()
          }
        }
      } catch (e) {
        console.error('Error monitoring popup:', e)
      }
    }, 1000)
  }


  private showNotification(message: string, type: 'success' | 'error' = 'success') {
    const notification = document.createElement('div')
    const bgColor = type === 'success' ? '#4CAF50' : '#f44336'


    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; background: ${bgColor}; color: white;
      padding: 1rem 1.5rem; border-radius: 8px; z-index: 10000; font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: 300px;
    `
    notification.textContent = message
    document.body.appendChild(notification)


    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification)
      }
    }, type === 'error' ? 5000 : 3000)
  }


  // Hàm lấy chữ cái đầu tiên trong tên
  getFirstLetterAvatar = (name: string): string => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return '?'
    }

    const firstChar = name.trim().charAt(0).toUpperCase()

    // Bảng chuyển đổi tiếng Việt
    const accentMap: { [key: string]: string } = {
      À: 'A', Á: 'A', Â: 'A', Ã: 'A', Ă: 'A', Ạ: 'A', Ả: 'A',
      Ấ: 'A', Ầ: 'A', Ẩ: 'A', Ẫ: 'A', Ậ: 'A', Ắ: 'A', Ằ: 'A',
      Ẳ: 'A', Ẵ: 'A', Ặ: 'A', È: 'E', É: 'E', Ê: 'E', Ẹ: 'E',
      Ẻ: 'E', Ẽ: 'E', Ế: 'E', Ề: 'E', Ể: 'E', Ễ: 'E', Ệ: 'E',
      Ì: 'I', Í: 'I', Ĩ: 'I', Ỉ: 'I', Ị: 'I', Ò: 'O', Ó: 'O',
      Ô: 'O', Õ: 'O', Ơ: 'O', Ọ: 'O', Ỏ: 'O', Ố: 'O', Ồ: 'O',
      Ổ: 'O', Ỗ: 'O', Ộ: 'O', Ớ: 'O', Ờ: 'O', Ở: 'O', Ỡ: 'O',
      Ợ: 'O', Ù: 'U', Ú: 'U', Ũ: 'U', Ư: 'U', Ụ: 'U', Ủ: 'U',
      Ứ: 'U', Ừ: 'U', Ử: 'U', Ữ: 'U', Ự: 'U', Ỳ: 'Y', Ý: 'Y',
      Ỷ: 'Y', Ỹ: 'Y', Ỵ: 'Y', Đ: 'D'
    }

    return accentMap[firstChar] || firstChar
  }


  getBgColor = (name: string): string => {
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#6366f1', '#ef4444']
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }



  handleImageError = (index: number) => {
    this.state.imageErrors[index] = true
    this.update()
  }


  render() {
    const { loading, error, items, oauthStatus, imageErrors } = this.state
    const isWaiting = error === 'Waiting for data from parent page...'
    const hasItems = !loading && !isWaiting && items.length > 0
    const isEmpty = !loading && !error && items.length === 0
    const hasError = !loading && error && !isWaiting
    const isProcessing = oauthStatus === 'authorizing'


    return (
      <div class='flex flex-col gap-4 overflow-hidden h-full'>



        {oauthStatus === 'authorizing' && (
          <div class='bg-yellow-50 border-b border-yellow-200 p-3'>
            <div class='flex items-center gap-2 text-yellow-700'>
              <div class='animate-pulse w-4 h-4 bg-yellow-500 rounded-full'></div>
              <span class='text-sm'>⏳ Waiting to add OA link... (Popup is open)</span>
            </div>
          </div>
        )}


        {oauthStatus === 'success' && (
          <div class='bg-green-50 border-b border-green-200 p-3'>
            <div class='flex items-center gap-2 text-green-700'>
              <span class='text-sm'>✅ OA link added successfully! Reloading data...</span>
            </div>
          </div>
        )}


        {oauthStatus === 'error' && (
          <div class='bg-red-50 border-b border-red-200 p-3'>
            <div class='flex items-center justify-between text-red-700'>
              <span class='text-sm'>❌ {error}</span>
              <button
                class='text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded'
                onClick={() => {
                  this.state.oauthStatus = 'idle'
                  this.state.error = null
                  this.update()
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}





        <div class="flex-1 overflow-y-auto">
          {loading && (
            <div class='flex items-center gap-2 text-sm opacity-70'>
              <div class='animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full'></div>
              <span>Loading data...</span>
            </div>
          )}


          {hasItems && (
            <div class='flex flex-col bg-green'>
              <div class='h-[280px] overflow-y-auto'>
                <div class='grid grid-cols-2 gap-4 '>
                  {items.map((item, index) => (
                    <div class='flex items-center gap-2 p-2 border rounded-lg'>

                      <div class='w-10 min-w-[40px] h-10 min-h-[40px] rounded-full'>
                        {imageErrors[index] ? (
                          <div
                            class='w-full h-full text-white flex items-center justify-center font-semibold rounded-full'
                            style={{
                              backgroundColor: this.getBgColor(item.name),
                              fontSize: `${40 * 0.45}px`
                            }}
                          >
                            {this.getFirstLetterAvatar(item.name)}
                          </div>
                        ) : (
                          <img
                            src={item.avatar}
                            onError={() => this.handleImageError(index)}
                            class='w-10 h-10 rounded-full'
                            alt={item.name}
                          />
                        )}
                      </div>
                      <div class='truncate w-[300px]'>
                        <div class='truncate '>{item.name}</div>
                        <div class='truncate text-xs'>{item.description}</div>
                      </div>
                    </div>

                  ))}
                  {/* {items.map((item, index) => (
                    <user-avatar avatar={item.avatar} name={item.name} description={item.description} size={40} />

                  ))} */}
                  {/* {items.map((item, index) => (
                    <vb-ai-chat-item key={index} item={item} />
                  ))} */}


                </div>
              </div>
              <div class='pt-4 flex justify-end'>
                <button
                  class='px-4 py-2 rounded-[4px] text-sm font-medium transition-all bg-[var(--el-color-primary)]'
                  onClick={this.handleAddZaloOAPopup}
                  disabled={isProcessing}
                >
                  Add OA link
                </button>
              </div>
            </div>
          )}



          {isEmpty && (
            <div class='text-center py-8'>
              <div class='text-lg mb-2'>No Zalo OA yet</div>
              <div class='text-sm opacity-70 mb-6'>Grant permission to connect Zalo OA</div>


              <button
                class='px-4 py-2 rounded-[4px] text-sm font-medium transition-all bg-[var(--el-color-primary)]'
                onClick={this.handleAddZaloOAPopup}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div class="flex items-center gap-2">
                    <div class='animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full'></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div class="flex items-center gap-2">
                    <span>Add OA link </span>
                  </div>
                )}
              </button>
            </div>
          )}


          {hasError && (
            <div class='text-center py-8'>
              <div class='text-red-500 mb-4'>❌ {error}</div>
              <button
                class='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
                onClick={() => this.loadData()}
              >
                Try again
              </button>
            </div>
          )}


          {error === 'Waiting for data from parent page...' && (
            <div class='text-center py-8'>
              <div class='text-lg mb-2'>⏳</div>
              <div class='text-sm opacity-70'>Waiting for data from parent page...</div>
            </div>
          )}
        </div>
      </div>
    )
  }
}
