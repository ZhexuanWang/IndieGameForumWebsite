import { test, expect } from '@playwright/test'

const uniqueEmail = () => `test${Date.now()}@example.com`
const password = 'Password123!'

test('register, login and logout flow', async ({ page }) => {
  test.setTimeout(60000)
  const email = uniqueEmail()

  await page.goto('/register')
  await expect(page.locator('h1')).toContainText('Create account')

  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)

  const [registerResponse] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/auth/register')),
    page.click('button[type="submit"]'),
  ])

  expect(registerResponse.status()).toBe(201)
  await page.waitForURL('/', { timeout: 15000 })
  await expect(page.locator('h1')).toContainText('FlashDev Indie Game Forum')

  await page.locator('[data-testid="user-menu"]').click()
  await page.locator('[data-testid="logout-button"]').click()
  await expect(page.locator('a[href="/login"]')).toBeVisible()

  await page.goto('/login')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)

  const [loginResponse] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/auth/login')),
    page.click('button[type="submit"]'),
  ])

  expect(loginResponse.status()).toBe(200)
  await page.waitForURL('/', { timeout: 15000 })
  await expect(page.locator('a[href="/login"]')).toBeHidden()
  await page.locator('[data-testid="user-menu"]').click()
  await expect(page.locator('[data-testid="logout-button"]')).toBeVisible()
})
