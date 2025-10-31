import { tag, Component } from 'omi'
import type { ChatItem } from '../models/ChatItem'
import { tailwind } from '../tailwind'
import { useTheme, themeSignal } from '../utils/themeSignal'
import { sharedStyle } from '@/style/sharedStyle'
import { ZaloOAItem } from '@/models/zaloOAItem'
@tag('vb-ai-chat-item')
class VbAIChatItem extends Component<{ item: ZaloOAItem }> {

  static css = [tailwind, sharedStyle]
  private disposeTheme?: () => void

  install() {
    // Chỉ cần 1 dòng để có theme support!
    this.disposeTheme = useTheme(this)
  }

  uninstall() {
    this.disposeTheme?.()
  }
  render(props: { item: ZaloOAItem }) {
    const item = props.item
    return (
      
        <div class='flex items-center gap-2 p-2 border rounded-lg'>
          <div class='w-10 min-w-[40px] h-10 min-h-[40px] rounded-full'><img src={item.avatar} class='w-10 h-10 rounded-full' /></div>
          <div class='truncate w-[300px]'>
            <div class='truncate '>{item.name}</div>
            <div class='truncate text-xs'>{item.description}</div>
          </div>
        </div>
    )
  }
}

