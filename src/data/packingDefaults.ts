import type { PackingCategory, PackingItem } from '../types'

const defaults: Array<{ label: string; category: PackingCategory }> = [
  { label: 'Passport / government ID', category: 'Documents' },
  { label: 'Tickets and hotel confirmations (offline copies)', category: 'Documents' },
  { label: 'Travel insurance details', category: 'Documents' },
  { label: 'Emergency contacts', category: 'Documents' },
  { label: 'Comfortable walking shoes', category: 'Clothing' },
  { label: 'Weather-appropriate layers', category: 'Clothing' },
  { label: 'Modest outfit for temples or religious sites', category: 'Clothing' },
  { label: 'Sleepwear', category: 'Clothing' },
  { label: 'Phone and charger', category: 'Electronics' },
  { label: 'Power bank', category: 'Electronics' },
  { label: 'Universal adaptor', category: 'Electronics' },
  { label: 'Earbuds', category: 'Electronics' },
  { label: 'Toothbrush and toothpaste', category: 'Toiletries' },
  { label: 'Sunscreen', category: 'Toiletries' },
  { label: 'Hand sanitiser', category: 'Toiletries' },
  { label: 'Personal hygiene items', category: 'Toiletries' },
  { label: 'Prescription medicines', category: 'Medicines' },
  { label: 'Basic first-aid kit', category: 'Medicines' },
  { label: 'Motion-sickness tablets (if needed)', category: 'Medicines' },
  { label: 'Reusable water bottle', category: 'Travel essentials' },
  { label: 'Daypack', category: 'Travel essentials' },
  { label: 'Umbrella or rain layer', category: 'Travel essentials' },
  { label: 'Snacks for transit', category: 'Travel essentials' },
]

export function createDefaultPackingList(): PackingItem[] {
  return defaults.map((item, index) => ({
    id: `default-${index}`,
    label: item.label,
    category: item.category,
    packed: false,
    custom: false,
  }))
}

export const PACKING_CATEGORIES: PackingCategory[] = [
  'Documents',
  'Clothing',
  'Electronics',
  'Toiletries',
  'Medicines',
  'Travel essentials',
]
