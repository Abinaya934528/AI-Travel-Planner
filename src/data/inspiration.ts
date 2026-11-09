export interface InspirationCard {
  id: string
  title: string
  excerpt: string
  image: string
  destinationId: string
}

export const inspirationCards: InspirationCard[] = [
  {
    id: 'hill-escape',
    title: 'South India hill-station weekend',
    excerpt: 'Pair Ooty or Kodaikanal with a slow cafe day and a viewpoint sunrise.',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    destinationId: 'ooty',
  },
  {
    id: 'backwaters',
    title: 'Kerala at an unhurried pace',
    excerpt: 'A houseboat stretch, a hill night, and seafood on the coast.',
    image:
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    destinationId: 'kerala',
  },
  {
    id: 'desert-palaces',
    title: 'Jaipur after golden hour',
    excerpt: 'Forts in the morning, bazaars in the afternoon, rooftops at night.',
    image:
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    destinationId: 'jaipur',
  },
  {
    id: 'island-reset',
    title: 'Goa beyond the loudest beach',
    excerpt: 'Choose a south-coast village if you want quieter water and longer dinners.',
    image:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    destinationId: 'goa',
  },
]
