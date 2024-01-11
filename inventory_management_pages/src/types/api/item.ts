import { FailResponse, SuccessResponse } from '@/types/api/common'
import { Item } from '@/types/entity/item'

export type RegisterItemResponse = (SuccessResponse & { item: Item }) | FailResponse

export type GetItemsResponse = (SuccessResponse & { items: Item[] }) | FailResponse

export type UpdateItemResponse = SuccessResponse | FailResponse

export type DeleteItemResponse = SuccessResponse | FailResponse
