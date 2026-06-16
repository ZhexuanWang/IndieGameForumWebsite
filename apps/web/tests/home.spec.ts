import { test, expect } from '@playwright/test'

test('landing page renders and shows navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Built for Indie Games')
  await expect(page.locator('text=API Status')).toBeVisible()
  await expect(page.locator('nav')).toContainText('Projects')
  await expect(page.locator('nav')).toContainText('Forum')
  await expect(page.locator('nav')).toContainText('Marketplace')
})
