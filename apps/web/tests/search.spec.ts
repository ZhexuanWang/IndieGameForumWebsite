import { test, expect, type Page } from '@playwright/test'

const password = 'Password123!'
const uniqueEmail = () => `search${Date.now()}@example.com`

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

test('search finds a project by keyword', async ({ page }) => {
  test.setTimeout(120000)

  const email = uniqueEmail()
  await register(page, { email, password })

  const keyword = `E2ESearch${Date.now()}`
  await page.goto('/projects/new')
  await page.getByLabel('Title').fill(`${keyword} Project`)
  await page.getByLabel('Description').fill('A searchable project description.')
  const [createResponse] = await Promise.all([
    page.waitForResponse(
      resp =>
        resp.url().includes('/projects') && resp.request().method() === 'POST',
    ),
    page.getByRole('button', { name: 'Create Project' }).click(),
  ])
  expect(createResponse.status()).toBe(201)

  await page.goto('/')
  await page.getByPlaceholder('Search...').fill(keyword)
  await page.keyboard.press('Enter')

  await page.waitForURL(`/search?q=${encodeURIComponent(keyword)}`, {
    timeout: 15000,
  })
  await expect(page.locator('h1')).toContainText('Search')
  await expect(page.getByText(`${keyword} Project`)).toBeVisible({ timeout: 10000 })
})
