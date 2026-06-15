import { test, expect } from '@playwright/test'

test('landing page renders and shows API status', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('FlashDev Indie Game Forum')
  await expect(page.locator('text=API Status')).toBeVisible()
})
