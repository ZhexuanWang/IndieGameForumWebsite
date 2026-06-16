import { test, expect, type Page } from '@playwright/test'

const password = 'Password123!'
const uniqueEmail = () => `projects${Date.now()}@example.com`

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

test('create a project with thumbnail and upload a project file', async ({
  page,
}) => {
  test.setTimeout(120000)

  const email = uniqueEmail()
  await register(page, { email, password })

  await page.goto('/projects/new')
  await expect(page.locator('h1')).toContainText('Create New Project')

  const title = `E2E Project ${Date.now()}`
  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Description').fill('End-to-end test project description.')

  const [thumbnailResponse] = await Promise.all([
    page.waitForResponse(
      resp =>
        resp.url().includes('/api/uploads') &&
        resp.request().method() === 'POST',
    ),
    page.getByTestId('thumbnail-input').setInputFiles({
      name: 'thumb.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-data'),
    }),
  ])
  expect(thumbnailResponse.status()).toBe(201)
  await expect(page.locator('img[src^="/uploads/"]')).toBeVisible({ timeout: 10000 })

  const [createResponse] = await Promise.all([
    page.waitForResponse(
      resp =>
        resp.url().includes('/projects') && resp.request().method() === 'POST',
    ),
    page.getByRole('button', { name: 'Create Project' }).click(),
  ])
  expect(createResponse.status()).toBe(201)
  await page.waitForURL(/\/projects\/[^/]+$/, { timeout: 15000 })

  await expect(page.locator('h1')).toContainText(title)
  await expect(page.locator(`img[alt="${title}"]`)).toBeVisible()

  const projectUrl = page.url()

  await page.getByRole('link', { name: 'Edit' }).click()
  await expect(page.locator('h1')).toContainText('Edit Project')

  await Promise.all([
    page.waitForResponse(
      resp =>
        resp.url().includes('/api/uploads') &&
        resp.request().method() === 'POST',
    ),
    page.getByTestId('project-file-input').setInputFiles({
      name: 'build.zip',
      mimeType: 'application/zip',
      buffer: Buffer.from('fake-zip-data'),
    }),
  ])
  await expect(page.getByText('build.zip')).toBeVisible({ timeout: 10000 })

  await page.goto(projectUrl)
  await expect(page.getByText('Downloads')).toBeVisible()
  await expect(page.getByText('build.zip')).toBeVisible()
})
