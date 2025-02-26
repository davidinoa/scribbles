import { createServerFn } from '@tanstack/start'

export const demoLogin = createServerFn({ method: 'POST' }).handler(
  async () => {
    const demoEmail = process.env.DEMO_USER_EMAIL
    const demoPassword = process.env.DEMO_USER_PASSWORD

    if (!demoEmail || !demoPassword) {
      throw new Error('Demo credentials not configured')
    }

    return {
      email: demoEmail,
      password: demoPassword,
    }
  },
)
