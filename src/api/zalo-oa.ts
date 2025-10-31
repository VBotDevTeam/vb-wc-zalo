import { http } from './service'
import type { ZaloOAItem } from '@/models/zaloOAItem'

// Kiểu dữ liệu API trả (bạn chỉnh theo payload thực tế)
export interface EventCallItem {
  // ví dụ phỏng đoán: chỉnh field theo response thật
  speaker?: 'member' | 'customer' | string
  name?: string
  message?: string
  time?: string | number // timestamp hoặc ISO
}

export interface ApiResponse<T> {
  status: number
  msg: string
  data: T
  errorCode: number
}

export interface EventRecord {
  id: number
  eventType: string
  transId: string
  dataJson: string
}

export interface GetAllEventCallParams {
  transId: string
  eventType?: 'summary' | string
}

export interface GetAllZaloOAParams {
  p_code: string
}

// export async function getAllEventCall(params: GetAllEventCallParams): Promise<EventCallItem[]> {
//   // API yêu cầu truyền query: transId & eventType=summary
//   const data = await http.get('/api/module-ticket/webhook/getAllEventCall', {
//     params: {
//       transId: params.transId,
//       eventType: params.eventType,
//     },
//   })
//   // Giả sử API trả về mảng events (chỉnh lại nếu khác)
//   return Array.isArray(data) ? data : (data?.data ?? [])
// }

export async function getAllEventCall(
  params: GetAllEventCallParams
): Promise<ApiResponse<EventRecord[]>> {
  const res = await http.get<ApiResponse<EventRecord[]>>(
    '/api/module-ticket/webhook/getAllEventCall',
    {
      params: {
        transId: params.transId,
        eventType: params.eventType,
      },
    }
  )

  return res.data
}


export async function getAllZaloOAAPI(
  params: GetAllZaloOAParams
): Promise<{ data: ZaloOAItem[]; error: number }> {
  const res = await http.get<{ data: ZaloOAItem[]; error: number }>(
    '/api/module-zalo/oa/getAll',
    {
      params: {
        p_code: params.p_code,
      },
    }
  )

  return res.data
}


export async function connectOAAPI(
  params: {
    p_code: string
    callback_uri: string
  }
): Promise<{ data: ZaloOAItem[]; error: number }> {
  const res = await http.get<{ data: ZaloOAItem[]; error: number }>(
    '/oa/connect',
    {
      params: {
        p_code: params.p_code,
        callback_uri: params.callback_uri
      },
    }
  )

  return res.data
}

