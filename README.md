# NC Prison Ministry Map

An interactive map application for locating and viewing information about North Carolina prisons.

## Features

- Terrain-based map with OpenTopoMap styling
- Custom pin-style markers for prison locations
- Responsive design for mobile and desktop
- Integration with Supabase for dynamic prison data
- Popup information cards with prison details

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Building

```bash
npm run build
```

This creates a production build in the `dist` folder.

### Environment Variables

Create a `.env.local` file with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

This project is configured for deployment on Vercel. The `vercel.json` file contains the build configuration.

### Deploying to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel project settings
4. Vercel will automatically build and deploy on each push

## Technologies Used

- TypeScript
- Vite
- Leaflet.js (mapping)
- Supabase (backend)
- OpenTopoMap (terrain tiles)

## License

MIT
