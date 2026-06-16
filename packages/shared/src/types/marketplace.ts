export type MarketListingType = 'sell' | 'buy' | 'promo' | 'host'

export type MarketListingStatus = 'draft' | 'published' | 'closed'

export type InquiryStatus = 'pending' | 'replied' | 'closed'

export interface MarketListing {
  id: string
  type: MarketListingType
  status: MarketListingStatus
  title: string
  description: string
  price: number | null
  sellerId: string
  seller: {
    id: string
    email: string
    displayName: string | null
    role: string
  }
  projectId: string | null
  project: {
    id: string
    title: string
    type: string
    status: string
  } | null
  inquiryCount: number
  createdAt: string
  updatedAt: string
}

export interface Inquiry {
  id: string
  listingId: string
  senderId: string
  sender: {
    id: string
    email: string
    displayName: string | null
    role: string
  }
  listing?: {
    id: string
    title: string
  }
  message: string
  status: InquiryStatus
  createdAt: string
  updatedAt: string
}

export interface CreateListingDto {
  title: string
  description: string
  type: MarketListingType
  price?: number
  projectId?: string
  status?: MarketListingStatus
}

export interface UpdateListingDto {
  title?: string
  description?: string
  type?: MarketListingType
  price?: number
  projectId?: string
  status?: MarketListingStatus
}

export interface CreateInquiryDto {
  message: string
}

export interface UpdateInquiryStatusDto {
  status: InquiryStatus
}
