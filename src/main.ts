import './style.css'
import { initializeMap } from './map'

const rootElement = document.getElementById('root')

if (rootElement) {
  // Initialize the map
  const map = initializeMap(rootElement)

  // Store map instance globally for debugging
  (window as any).prisonsMap = map
}
