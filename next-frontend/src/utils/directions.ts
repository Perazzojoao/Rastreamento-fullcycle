import { BASE_URL } from '@/api/api'

export async function searchDirections(source: string, destination: string) {
	const [sourceResponse, destinationResponse] = await Promise.all([
		fetch(`${BASE_URL}/places?text=${source}`, {
			cache: 'force-cache',
			next: {
				revalidate: 1 * 60 * 60, // 1 hour
			},
		}),
		fetch(`${BASE_URL}/places?text=${destination}`, {
			cache: 'force-cache',
			next: {
				revalidate: 1 * 60 * 60, // 1 hour
			},
		}),
	])

	if (!sourceResponse) {
		throw new Error('Fail to fetch source data')
	}
	if (!destinationResponse) {
		throw new Error('Fail to fetch destination data')
	}

	const [sourceData, destinationData] = await Promise.all([sourceResponse.json(), destinationResponse.json()])
	const placeSourceId = sourceData.candidates[0].place_id
	const placeDestinationId = destinationData.candidates[0].place_id

	const directionsResponse = await fetch(
		`${BASE_URL}/directions?originId=${placeSourceId}&destinationId=${placeDestinationId}`,
		{
			cache: 'force-cache',
			next: {
				revalidate: 1 * 60 * 60, // 1 hour
			},
		}
	)

	if (!directionsResponse.ok) {
		throw new Error('Fail to fetch directions data')
	}

	const directionsData = await directionsResponse.json()
	return {
		directionsData,
		placeSourceId,
		placeDestinationId,
	}
}
