import { describe, expect, it } from 'vitest'
import { createInquirySchema, createListingSchema } from './validation'

describe('createListingSchema', () => {
  it('accepts a valid published sell listing', () => {
    const result = createListingSchema.safeParse({
      title: 'Pixel Art Pack',
      description: 'A collection of high quality pixel art sprites.',
      type: 'sell',
      status: 'published',
      price: 9.99,
    })
    expect(result.success).toBe(true)
  })

  it('rejects a title shorter than 3 characters', () => {
    const result = createListingSchema.safeParse({
      title: 'AB',
      description: 'Valid description text.',
      type: 'promo',
    })
    expect(result.success).toBe(false)
  })

  it('allows a buy listing without a price', () => {
    const result = createListingSchema.safeParse({
      title: 'Looking for composer',
      description: 'Need a composer for an RPG soundtrack.',
      type: 'buy',
      status: 'draft',
    })
    expect(result.success).toBe(true)
  })
})

describe('createInquirySchema', () => {
  it('accepts a non-empty message', () => {
    const result = createInquirySchema.safeParse({
      message: 'Is this still available?',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an empty message', () => {
    const result = createInquirySchema.safeParse({ message: '' })
    expect(result.success).toBe(false)
  })
})
