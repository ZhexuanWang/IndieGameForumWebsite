import { test, expect, type Page } from '@playwright/test'

const password = 'Password123!'
const uniqueEmail = () => `marketplace${Date.now()}@example.com`

async function register(
  page: Page,
  { email, password: pw }: { email: string; password: string },
) {
  await page.goto('/register')
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('••••••••').fill(pw)
  const [response] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/auth/register')),
    page.getByRole('button', { name: 'Sign up' }).click(),
  ])
  expect(response.status()).toBe(201)
  await page.waitForURL('/', { timeout: 15000 })
}

async function logout(page: Page) {
  await page.locator('[data-testid="user-menu"]').click()
  await page.locator('[data-testid="logout-button"]').click()
}

test('create a listing and send an inquiry between two users', async ({
  page,
}) => {
  test.setTimeout(120000)

  const sellerEmail = uniqueEmail()
  await register(page, { email: sellerEmail, password })

  await page.goto('/marketplace')
  await expect(page.locator('h1')).toContainText('Marketplace')
  await page.getByRole('link', { name: 'New Listing' }).click()
  await expect(page.locator('h1')).toContainText('Create Marketplace Listing')

  const title = `E2E Test Asset ${Date.now()}`
  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Description').fill('End-to-end test marketplace listing.')
  await page.getByLabel('Status').selectOption('published')
  await page.getByLabel('Price (USD)').fill('9.99')

  const [createResponse] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/marketplace/listings')),
    page.getByRole('button', { name: 'Create Listing' }).click(),
  ])
  expect(createResponse.status()).toBe(201)
  await page.waitForURL(/\/marketplace\/[^/]+$/, { timeout: 15000 })

  await expect(page.locator('h1')).toContainText(title)
  await expect(page.getByText('$9.99')).toBeVisible()
  await expect(page.getByText('Published')).toBeVisible()

  await logout(page)

  const buyerEmail = uniqueEmail()
  await register(page, { email: buyerEmail, password })

  await page.goto('/marketplace')
  await page.getByText(title).first().click()
  await expect(page.locator('h1')).toContainText(title)

  await page
    .getByPlaceholder('Write your message to the seller...')
    .fill('Is this asset still available?')
  await page.getByRole('button', { name: 'Send Inquiry' }).click()

  await expect(page.getByText('1 inquiries')).toBeVisible({ timeout: 10000 })

  await page.goto('/marketplace')
  await page.getByRole('link', { name: 'My Inquiries' }).click()
  await expect(page.locator('h1')).toContainText('My Inquiries')
  await expect(page.getByRole('link', { name: title })).toBeVisible()
})
