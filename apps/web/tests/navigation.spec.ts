import { test, expect } from '@playwright/test'

test('protected routes redirect anonymous users to login', async ({ page }) => {
  await page.goto('/projects/new')
  await page.waitForURL('/login')
  await expect(page.locator('h1')).toContainText('Welcome back')
})
