// import { tag, Component } from 'omi'
// import '@/components/VbAiChatItem'
// import { tailwind } from '@/tailwind'
// import { useTheme } from '@/utils/themeSignal'
// import { sharedStyle } from '@/style/sharedStyle'
// import { getAllZaloOAAPI } from '@/api/zalo-oa'
// import { ZaloOAItem } from './models/zaloOAItem'

// declare global {
//   interface Window {
//     handleZaloOAuthResult?: (success: boolean, message?: string) => void
//   }
// }

// type Props = {
//   projectCode: string
// }

// type State = {
//   loading: boolean
//   error: string | null
//   items: ZaloOAItem[]
//   projectCode: string 
//   oauthStatus: 'idle' | 'authorizing' | 'success' | 'error'
// }

// @tag('vb-wc-history-call-voice-to-text')
// export default class extends Component<Props> {
//   static css = [tailwind, sharedStyle]

//   state: State = {
//     loading: false,
//     error: null,
//     items: [],
//     projectCode: '',
//     oauthStatus: 'idle'
//   }

//   // Public method để trang cha có thể gọi
//   public openZaloOAPopup() {
//     this.handleAddZaloOAPopup()
//   }

//   private disposeTheme?: () => void
//   private popupCheckInterval?: number

//   install() {
//     this.disposeTheme = useTheme(this)
//     window.handleZaloOAuthResult = this.handleZaloOAuthResult
//   }

//   installed() {
//     console.log('Component installed with props:', this.props.projectCode)
    
//     // Kiểm tra OAuth callback ngay khi popup load trang này
//     this.checkOAuthResult()

//     this.addEventListener('props-updated', (e: any) => {
//       const projectCode = e.detail.projectCode
//       if (projectCode) {
//         this.state.projectCode = projectCode
//         this.state.error = null
//         this.loadData()
//       }
//     })

//     if (this.props.projectCode) {
//       this.state.projectCode = this.props.projectCode
//       this.loadData()
//     } else {
//       this.state.error = 'Đang chờ dữ liệu từ trang cha...'
//       this.update()
//     }
//   }

//   uninstall() {
//     this.disposeTheme?.()
//     if (this.popupCheckInterval) clearInterval(this.popupCheckInterval)
//     delete window.handleZaloOAuthResult
//   }

//   private async loadData() {
//     this.state.loading = true
//     this.state.error = null
//     this.update()

//     try {
//       const result = await getAllZaloOAAPI({p_code: this.state.projectCode})
//       this.state.items = result.data
//     } catch (err: any) {
//       this.state.error = err?.message || 'Không thể tải dữ liệu Zalo OA.'
//       this.state.items = []
//     } finally {
//       this.state.loading = false
//       this.update()
//     }
//   }

//   receiveProps(nextProps: Props) {
//     if (nextProps.projectCode !== this.props.projectCode) {
//       this.state.projectCode = nextProps.projectCode
//       this.loadData()
//     }
//   }

//   // Đây là hàm kiểm tra code OAuth khi popup load trang chính app
//   private checkOAuthResult() {
//     const currentUrl = new URL(window.location.href)
//     const code = currentUrl.searchParams.get('code')

//     // Nếu có code và đang là popup (window.opener tồn tại)
//     if (code && window.opener) {
//       const isSuccess = (code === '200')
//       const message = isSuccess ? 'Thêm liên kết OA thành công!' : 'Thêm liên kết OA thất bại!'

//       if (window.opener.handleZaloOAuthResult) {
//         window.opener.handleZaloOAuthResult(isSuccess, message)
//       }


//       // Tự đóng popup ngay
//       window.close()
//     }
//   }

//   private handleZaloOAuthResult = (success: boolean, message?: string) => {
//     if (this.popupCheckInterval) {
//       clearInterval(this.popupCheckInterval)
//       this.popupCheckInterval = undefined
//     }

//     if (success) {
//       this.state.oauthStatus = 'success'
//       this.state.error = null
//       this.update()
//       this.showNotification('🎉 ' + message, 'success')

//       this.loadData()
//       this.state.oauthStatus = 'idle'
//       this.update()
//     } else {
//       this.state.oauthStatus = 'error'
//       this.state.error = message || 'Thêm liên kết OA thất bại!'
//       this.update()
//       this.showNotification('❌ ' + this.state.error, 'error')

//       this.state.oauthStatus = 'idle'
//       this.state.error = null
//       this.update()
//     }
//   }

//   // private handleAddZaloOAPopup = () => {
//   //   const oauthUrl = `https://zalo-sandbox.vbot.vn/oa/connect?p_code=${this.state.projectCode}&callback_uri=${window.location.href}/#/omi`

//   //   const popup = window.open(oauthUrl, 'zalo-oauth', 'width=600,height=700,scrollbars=yes,resizable=yes')

//   //   if (!popup) {
//   //     this.showNotification('❌ Popup bị chặn. Vui lòng cho phép popup và thử lại.', 'error')
//   //     return
//   //   }

//   //   this.state.oauthStatus = 'authorizing'
//   //   this.update()

//   //   this.monitorPopup(popup)
//   // }

//   private handleAddZaloOAPopup = () => {
//   // URL của trang callback (điều chỉnh theo domain thực tế của bạn)
//     const callbackUrl = `${window.location.origin}/oauth-callback.html`
    
//     // URL OAuth với callback_uri trỏ tới trang callback
//     const oauthUrl = `https://zalo-sandbox.vbot.vn/oa/connect?p_code=${this.state.projectCode}&callback_uri=${encodeURIComponent(callbackUrl)}`

//     console.log('Mở popup OAuth với URL:', oauthUrl)
//     console.log('Callback URL:', callbackUrl)

//     const popup = window.open(
//       oauthUrl, 
//       'zalo-oauth', 
//       'width=600,height=700,scrollbars=yes,resizable=yes'
//     )

//     if (!popup) {
//       this.showNotification('❌ Popup bị chặn. Vui lòng cho phép popup và thử lại.', 'error')
//       return
//     }

//     this.state.oauthStatus = 'authorizing'
//     this.update()

//     this.monitorPopup(popup)
//   }


//   private monitorPopup(popup: Window) {
//     this.popupCheckInterval = setInterval(() => {
//       try {
//         if (popup.closed) {
//           clearInterval(this.popupCheckInterval!)
//           this.popupCheckInterval = undefined

//           if (this.state.oauthStatus === 'authorizing') {
//             this.state.oauthStatus = 'idle'
//             this.update()
//           }
//         }
//       } catch (e) {
//         console.error('Error monitoring popup:', e)
//       }
//     }, 1000)
//   }

//   private showNotification(message: string, type: 'success' | 'error' = 'success') {
//     const notification = document.createElement('div')
//     const bgColor = type === 'success' ? '#4CAF50' : '#f44336'

//     notification.style.cssText = `
//       position: fixed; top: 20px; right: 20px; background: ${bgColor}; color: white;
//       padding: 1rem 1.5rem; border-radius: 8px; z-index: 10000; font-size: 14px;
//       box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: 300px;
//     `
//     notification.textContent = message
//     document.body.appendChild(notification)

//     setTimeout(() => {
//       if (notification.parentNode) {
//         document.body.removeChild(notification)
//       }
//     }, type === 'error' ? 5000 : 3000)
//   }

//   render() {
//     const { loading, error, items, oauthStatus } = this.state
//     const isWaiting = error === 'Đang chờ dữ liệu từ trang cha...'
//     const hasItems = !loading && !isWaiting && items.length > 0
//     const isEmpty = !loading && !error && items.length === 0
//     const hasError = !loading && error && !isWaiting
//     const isProcessing = oauthStatus === 'authorizing'

//     return (
//         <div class='flex flex-col gap-4 overflow-hidden h-full'>
   

//           {oauthStatus === 'authorizing' && (
//             <div class='bg-yellow-50 border-b border-yellow-200 p-3'>
//               <div class='flex items-center gap-2 text-yellow-700'>
//                 <div class='animate-pulse w-4 h-4 bg-yellow-500 rounded-full'></div>
//                 <span class='text-sm'>⏳ Đang chờ thêm liên kết OA... (Popup đang mở)</span>
//               </div>
//             </div>
//           )}

//           {oauthStatus === 'success' && (
//             <div class='bg-green-50 border-b border-green-200 p-3'>
//               <div class='flex items-center gap-2 text-green-700'>
//                 <span class='text-sm'>✅ Thêm liên kết OA thành công! Đang tải lại dữ liệu...</span>
//               </div>
//             </div>
//           )}

//           {oauthStatus === 'error' && (
//             <div class='bg-red-50 border-b border-red-200 p-3'>
//               <div class='flex items-center justify-between text-red-700'>
//                 <span class='text-sm'>❌ {error}</span>
//                 <button 
//                   class='text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded'
//                   onClick={() => {
//                     this.state.oauthStatus = 'idle'
//                     this.state.error = null
//                     this.update()
//                   }}
//                 >
//                   Đóng
//                 </button>
//               </div>
//             </div>
//           )}

         

//           <div class="flex-1 overflow-y-auto">
//             {loading && (
//               <div class='flex items-center gap-2 text-sm opacity-70'>
//                 <div class='animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full'></div>
//                 <span>Đang tải dữ liệu...</span>
//               </div>
//             )}

//             {hasItems && (
//               <div class='flex flex-col bg-green'>
//                 <div class='h-[280px] overflow-y-auto'>
//                   <div class='grid grid-cols-2 gap-4 '>
//                     {items.map((item, index) => (
//                       <vb-ai-chat-item key={index} item={item} />
//                     ))}
                    
//                   </div>
//                 </div>
//                 <div class='pt-4 flex justify-end'>
//                     <button 
//                       class='px-4 py-2 rounded-[4px] text-sm font-medium transition-all bg-[var(--el-color-primary)]'
//                       onClick={this.handleAddZaloOAPopup}
//                       disabled={isProcessing}
//                     >
//                       Thêm liên kết OA
//                     </button>
//                   </div>
//               </div>
//             )}
            

//             {isEmpty && (
//               <div class='text-center py-8'>
//                 <div class='text-lg mb-2'>Chưa có Zalo OA nào</div>
//                 <div class='text-sm opacity-70 mb-6'>Hãy cấp quyền để kết nối Zalo OA</div>

//                 <button 
//                   class='px-4 py-2 rounded-[4px] text-sm font-medium transition-all bg-[var(--el-color-primary)]'
//                   onClick={this.handleAddZaloOAPopup}
//                   disabled={isProcessing}
//                 >
//                   {isProcessing ? (
//                     <div class="flex items-center gap-2">
//                       <div class='animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full'></div>
//                       <span>Đang xử lý...</span>
//                     </div>
//                   ) : (
//                     <div class="flex items-center gap-2">
//                       <span>Thêm liên kết OA</span>
//                     </div>
//                   )}
//                 </button>
//               </div>
//             )}

//             {hasError && (
//               <div class='text-center py-8'>
//                 <div class='text-red-500 mb-4'>❌ {error}</div>
//                 <button 
//                   class='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
//                   onClick={() => this.loadData()}
//                 >
//                   Thử lại
//                 </button>
//               </div>
//             )}

//             {error === 'Đang chờ dữ liệu từ trang cha...' && (
//               <div class='text-center py-8'>
//                 <div class='text-lg mb-2'>⏳</div>
//                 <div class='text-sm opacity-70'>Đang chờ dữ liệu từ trang cha...</div>
//               </div>
//             )}
//           </div>
//         </div>
//     )
//   }
// }


import { tag, Component } from 'omi'
import '@/components/VbAiChatItem'
import { tailwind } from '@/tailwind'
import { useTheme } from '@/utils/themeSignal'
import { sharedStyle } from '@/style/sharedStyle'
import { getAllZaloOAAPI } from '@/api/zalo-oa'
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
  oauthStatus: 'idle' | 'authorizing' | 'success' | 'error'
}


@tag('vb-wc-history-call-voice-to-text')
export default class extends Component<Props> {
  static css = [tailwind, sharedStyle]


  state: State = {
    loading: false,
    error: null,
    items: [],
    projectCode: '',
    oauthStatus: 'idle'
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
      const result = await getAllZaloOAAPI({p_code: this.state.projectCode})
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


  render() {
    const { loading, error, items, oauthStatus } = this.state
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
                      <vb-ai-chat-item key={index} item={item} />
                    ))}
                    
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
                      <span>Add OA link</span>
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
