import './style.css'
import { initializeMap } from './map'
import { ministries } from './ministries'

const rootElement = document.getElementById('root')

if (rootElement) {
  rootElement.innerHTML = `
    <div class="app-shell">
      <header class="ministry-bar" aria-label="Ministry partners">
        <div class="ministry-bar__title">NC Prison Ministry Map</div>
        <nav class="ministry-nav" aria-label="Ministry menu"></nav>
      </header>
      <main id="map" aria-label="North Carolina prison map"></main>
    </div>
  `

  const mapElement = rootElement.querySelector<HTMLElement>('#map')
  const navElement = rootElement.querySelector<HTMLElement>('.ministry-nav')

  if (!mapElement || !navElement) throw new Error('Unable to start the map')

  const map = initializeMap(mapElement)

  ministries.forEach((ministry) => {
    const menu = document.createElement('details')
    menu.className = 'ministry-menu'

    const summary = document.createElement('summary')
    summary.textContent = ministry.name
    menu.append(summary)

    const panel = document.createElement('div')
    panel.className = 'ministry-menu__panel'

    if (ministry.website) {
      const website = document.createElement('a')
      website.className = 'ministry-menu__website'
      website.href = ministry.website
      website.target = '_blank'
      website.rel = 'noreferrer'
      website.textContent = 'Visit website ↗'
      panel.append(website)
    } else {
      const noWebsite = document.createElement('p')
      noWebsite.className = 'ministry-menu__notice'
      noWebsite.textContent = 'Website not available'
      panel.append(noWebsite)
    }

    const locationsTitle = document.createElement('p')
    locationsTitle.className = 'ministry-menu__label'
    locationsTitle.textContent = 'Serving at'
    panel.append(locationsTitle)

    if (ministry.prisons.length) {
      const locations = document.createElement('ul')
      ministry.prisons.forEach((prisonName) => {
        const item = document.createElement('li')
        const button = document.createElement('button')
        button.type = 'button'
        button.textContent = prisonName
        button.addEventListener('click', () => {
          map.focusPrison(prisonName)
          menu.open = false
        })
        item.append(button)
        locations.append(item)
      })
      panel.append(locations)
    } else {
      const noLocations = document.createElement('p')
      noLocations.className = 'ministry-menu__notice'
      noLocations.textContent = 'Locations have not been listed yet.'
      panel.append(noLocations)
    }

    menu.append(panel)
    menu.addEventListener('toggle', () => {
      if (!menu.open) return
      navElement.querySelectorAll('details').forEach((otherMenu) => {
        if (otherMenu !== menu) (otherMenu as HTMLDetailsElement).open = false
      })
    })
    navElement.append(menu)
  })

  // Store map instance globally for debugging
  ;(window as any).prisonsMap = map.map
}
