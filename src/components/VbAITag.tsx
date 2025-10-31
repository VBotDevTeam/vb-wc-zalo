import { tag, Component } from 'omi'
import { tailwind } from '@/tailwind'
import { useTheme, themeSignal } from '@/utils/themeSignal'
import '@/icons/MingcuteAiFill'
import { sharedStyle } from '@/style/sharedStyle'

@tag('vb-ai-tag')
class VbAITag extends Component {
  static css = [tailwind, sharedStyle]

  private disposeTheme?: () => void

  install() {
    // Chỉ cần 1 dòng để có theme support!
    this.disposeTheme = useTheme(this)
  }

  uninstall() {
    this.disposeTheme?.()
  }

  render() {
    return (
      <div class='text-primary font-medium flex items-center justify-center gap-0.5'>AI<mingcute-ai-fill size="16" /> </div>
    )
  }
}
