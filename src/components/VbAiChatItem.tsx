import { ZaloOAItem } from '@/models/zaloOAItem'
import { sharedStyle } from '@/style/sharedStyle'
import { Component, tag } from 'omi'
import { tailwind } from '../tailwind'
import { useTheme } from '../utils/themeSignal'
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

        <div class='truncate w-[300px]'>
          <div class='truncate '>{item.name}</div>
          <div class='truncate text-xs'>{item.description}</div>
        </div>
        <div class='w-10 min-w-[40px] h-10 min-h-[40px] rounded-full'>
          {/* <img src={item.avatar} class='w-10 h-10 rounded-full' /> */}
          <img src="https://s160-ava-talk.zadn.vn/f/2/4/e/4/160/63c3b55be8cb36635fb8e566025c59df.jpg" class='w-10 h-10 rounded-full' />
        </div>
        <div class='truncate w-[300px]'>
          <div class='truncate '>{item.name}</div>
          <div class='truncate text-xs'>{item.description}</div>
        </div>
        <div class='w-10 min-w-[40px] h-10 min-h-[40px] rounded-full'>
          {/* <img src={item.avatar} class='w-10 h-10 rounded-full' /> */}
          <img src="https://s160-ava-talk.zadn.vn/f/2/4/e/4/160/63c3b55be8cb36635fb8e566025c59df.jpg" class='w-10 h-10 rounded-full' />
        </div>
      </div>
    )
  }
}

