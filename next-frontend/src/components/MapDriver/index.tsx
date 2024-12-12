'use client'

import { useEffect, useRef } from 'react'
import { useMap } from '../../hooks/useMap'
import { socket } from '@/utils/socket-io'

export type MapDriverProps = {
  route_id: string | null
  startLocation: { lat: number; lng: number } | null
  endLocation: { lat: number; lng: number } | null
}

export function MapDriver({ route_id, startLocation, endLocation }: MapDriverProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const map = useMap(mapContainerRef)

  useEffect(() => {
    if (!map || !route_id || !startLocation || !endLocation) {
      return
    }

    if (socket.disconnected) {
      socket.connect()
    } else {
      socket.offAny()
    }

    socket.on('connect', () => {
      console.log('connected')
      socket.emit('server:new-points', { route_id })
    })

    socket.on(`server:new-points/${route_id}:list`, (data: { route_id: string; lat: number; lng: number }) => {
      if (!map.hasRoute(data.route_id)) {
        map.addRouteWithIcons({
          routeId: data.route_id,
          startMarkerOptions: {
            position: startLocation,

          },
          endMarkerOptions: {
            position: endLocation,
          },
          carMarkerOptions: {
            position: startLocation,
          }
        })
      }
      map.moveCar(data.route_id, { lat: data.lat, lng: data.lng })

    })

    return () => {
      socket.disconnect()
    }
  }, [route_id, map, startLocation, endLocation])

  return (
    <div className='w-2/3 h-full'>
      <div ref={mapContainerRef} />
    </div>
  )
}
