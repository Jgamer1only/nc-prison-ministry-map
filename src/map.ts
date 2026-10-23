import L from 'leaflet'
import { getPrisonLocations } from './supabaseClient'

// Fix for marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export function initializeMap(container: HTMLElement) {
  // Initialize map centered on North Carolina
  const map = L.map(container).setView([35.63, -79.8], 7)

  // Add terrain tile layer with warm earth tones
  // Using OpenTopoMap which provides terrain styling
  L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
    maxZoom: 17,
    opacity: 0.85,
  }).addTo(map)

  // Add a subtle overlay for warm tones
  const overlayPane = map.createPane('overlay')
  if (overlayPane) {
    overlayPane.style.pointerEvents = 'none'
    overlayPane.style.opacity = '0.1'
  }

  const markers = new Map<string, L.Marker>()
  const prisonsReady = loadPrisons(map, markers)

  return {
    map,
    async focusPrison(name: string) {
      await prisonsReady
      const normalizedName = normalizeName(name)
      const marker = markers.get(normalizedName) || [...markers.entries()].find(([prisonName]) =>
        prisonName.includes(normalizedName) || normalizedName.includes(prisonName),
      )?.[1]

      if (!marker) {
        console.warn(`No map location found for ${name}`)
        return
      }

      map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 12), { duration: 0.8 })
      marker.openPopup()
    },
  }
}

async function loadPrisons(map: L.Map, markers: Map<string, L.Marker>) {
  try {
    const prisons = await getPrisonLocations()

    prisons.forEach((prison: any) => {
      if (prison.latitude && prison.longitude) {
        const marker = createPinMarker(prison.latitude, prison.longitude, prison.name)
        marker.addTo(map)
        markers.set(normalizeName(prison.name || ''), marker)

        // Add popup with prison information
        const popupContent = `
          <div class="popup-content">
            <h3>${prison.name || 'Prison'}</h3>
            ${prison.address ? `<p>${prison.address}</p>` : ''}
            ${prison.phone ? `<p>Phone: ${prison.phone}</p>` : ''}
            ${prison.website ? `<p><a href="${prison.website}" target="_blank">Website</a></p>` : ''}
            ${formatEvents(prison)}
          </div>
        `
        marker.bindPopup(popupContent)
      }
    })
  } catch (error) {
    console.error('Error loading prisons:', error)
  }
}

function normalizeName(name: string) {
  return name.toLowerCase().replace(/(correctional institution|correctional center|facility)/g, '').replace(/[^a-z0-9]/g, '')
}

function formatEvents(prison: any) {
  const events = Array.isArray(prison.events)
    ? prison.events
    : Array.isArray(prison.upcoming_events)
      ? prison.upcoming_events
      : []

  if (!events.length) return '<p class="popup-content__events">No upcoming events listed.</p>'

  const items = events.map((event: any) => `<li>${typeof event === 'string' ? event : event.title || event.name || 'Event'}</li>`).join('')
  return `<div class="popup-content__events"><strong>Upcoming events</strong><ul>${items}</ul></div>`
}

function createPinMarker(lat: number, lng: number, name: string) {
  // Create custom pin marker using SVG
  const svg = `
    <svg width="32" height="48" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#d4a574;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8b6f47;stop-opacity:1" />
        </linearGradient>
        <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.4"/>
        </filter>
      </defs>
      <!-- Pin shape -->
      <path d="M 16 0 C 16 0, 4 12, 4 20 C 4 28.8366, 9.23122 36, 16 36 C 22.76878 36, 28 28.8366, 28 20 C 28 12, 16 0, 16 0 Z"
            fill="url(#pinGradient)" filter="url(#pinShadow)" stroke="#6b5937" stroke-width="1"/>
      <!-- Inner highlight for depth -->
      <circle cx="16" cy="18" r="5" fill="#f0e6d2" opacity="0.6"/>
      <!-- Star shape inside pin -->
      <path d="M 16 12 L 18 17.5 L 24 17.5 L 19.5 21 L 21.5 26.5 L 16 23 L 10.5 26.5 L 12.5 21 L 8 17.5 L 14 17.5 Z"
            fill="#c59659" opacity="0.8"/>
    </svg>
  `

  const pinIcon = L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48],
  })

  return L.marker([lat, lng], {
    icon: pinIcon,
    title: name
  })
}
