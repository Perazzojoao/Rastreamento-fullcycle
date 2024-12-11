'use server'

import { BASE_URL } from "@/api/api"
import { revalidateTag } from "next/cache"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createRouteAction(state: any, formData: FormData) {
  const { sourceId, destinationId } = Object.fromEntries(formData)

  const directionsResponse = await fetch(
    `${BASE_URL}/directions?originId=${sourceId}&destinationId=${destinationId}`, {
    cache: 'force-cache',
    next: {
      revalidate: 1 * 60 * 60, // 1 hour
    }
  })

  if (!directionsResponse.ok) {
    return { error: 'Fail to fetch directions data' }
  }

  const directionsData = await directionsResponse.json()

  const startAddress = directionsData.routes[0].legs[0].start_address
  const endAddress = directionsData.routes[0].legs[0].end_address
  const sourceIdResponse: string = directionsData.request.origin.placeId
  const destinationIdResponse: string = directionsData.request.destination.placeId

  const response = await fetch(`${BASE_URL}/routes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `${startAddress} - ${endAddress}`,
      source_id: sourceIdResponse.replace('place_id:', ''),
      destination_id: destinationIdResponse.replace('place_id:', ''),
    }),
  })

  if (!response.ok) {
    return { error: 'Fail to create route' }
  }

  revalidateTag('routes')

  return { success: true }
}