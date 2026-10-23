export type Ministry = {
  name: string
  website?: string
  prisons: string[]
}

// Keep this list in one place so service locations can be updated without
// changing the navigation behavior.
export const ministries: Ministry[] = [
  { name: 'Forgiven Ministry', website: 'https://forgivenministry.org/', prisons: [] },
  { name: 'Summit Church', website: 'https://summitchurch.com/prison', prisons: [] },
  { name: 'Grace it Up', website: 'https://graceitup.org/', prisons: [] },
  {
    name: 'Jumpstart',
    website: 'https://www.jumpstartvision.org/serve-north-carolina',
    // Facilities published by JUMPSTART North Carolina as active locations.
    prisons: [
      'Davidson Correctional',
      'Columbus Correctional',
      'Greene Correctional',
      'Albemarle Correctional',
      'Piedmont Correctional',
      'Carteret Correctional',
      'Tabor Correctional',
      'Eastern Correctional',
      'Wake Correctional',
    ],
  },
  { name: 'Prison Alliance', website: 'https://prisonalliance.org/', prisons: [] },
  {
    name: 'Hope Community',
    prisons: ['Foothills Correctional', 'Lincolnton Correctional'],
  },
]
