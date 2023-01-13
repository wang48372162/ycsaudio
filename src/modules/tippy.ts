import tippy from 'vue-tippy'
import type { UserModule } from '@/types'

export const install: UserModule = ({ app }) => {
  app.use(tippy, {
    defaultProps: {
      placement: 'bottom',
      hideOnClick: false,
    },
  })
}
