import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'cursorai-code-studio-ysz2ttqp',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_7Ord7bBmK3-RxOARhQYPxC6MsPOQ7wIE',
  authRequired: false,
  auth: { mode: 'managed' },
})
