import { api } from './api'
import type {
  CreateInquiryDto,
  CreateListingDto,
  Inquiry,
  MarketListing,
  MarketListingStatus,
  MarketListingType,
  PaginatedResponse,
  UpdateInquiryStatusDto,
  UpdateListingDto,
} from '@flashdev/gameweb-shared'

export interface ListingQuery {
  type?: MarketListingType
  status?: MarketListingStatus
  search?: string
  page?: number
  limit?: number
}

export const marketplaceApi = {
  listings: (query: ListingQuery = {}) =>
    api
      .get<PaginatedResponse<MarketListing>>('/marketplace/listings', {
        params: query,
      })
      .then(r => r.data),

  getListing: (id: string) =>
    api.get<MarketListing>(`/marketplace/listings/${id}`).then(r => r.data),

  createListing: (dto: CreateListingDto) =>
    api.post<MarketListing>('/marketplace/listings', dto).then(r => r.data),

  updateListing: (id: string, dto: UpdateListingDto) =>
    api
      .patch<MarketListing>(`/marketplace/listings/${id}`, dto)
      .then(r => r.data),

  deleteListing: (id: string) =>
    api.delete(`/marketplace/listings/${id}`).then(r => r.data),

  createInquiry: (listingId: string, dto: CreateInquiryDto) =>
    api
      .post<Inquiry>(`/marketplace/listings/${listingId}/inquiries`, dto)
      .then(r => r.data),

  listInquiries: (listingId: string) =>
    api
      .get<Inquiry[]>(`/marketplace/listings/${listingId}/inquiries`)
      .then(r => r.data),

  myInquiries: () =>
    api.get<Inquiry[]>('/marketplace/inquiries/me').then(r => r.data),

  updateInquiryStatus: (id: string, dto: UpdateInquiryStatusDto) =>
    api
      .patch<Inquiry>(`/marketplace/inquiries/${id}/status`, dto)
      .then(r => r.data),
}
