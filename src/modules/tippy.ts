import tippy from 'vue-tippy'
import type { UserModule } from '@/types'

export const install: UserModule = ({ isClient, app }) => {
  if (isClient) {
    app.use(tippy, {
      defaultProps: {
        placement: 'bottom',
        hideOnClick: false,
      },
    })
  }
}
