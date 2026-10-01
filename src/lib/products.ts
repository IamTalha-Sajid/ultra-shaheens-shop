export type Product = {
  id: string
  name: string
  subtitle: string
  description: string
  image: string
  images?: string[]
  price: number
  originalPrice?: number
  badge: string
  sizes: string[]
  isCombo?: boolean
  discountNote?: string
  savings?: number
}

export const DELIVERY_CHARGE = 299
export const PREPAID_DISCOUNT_PCT = 5

export function prepaidPrice(price: number): number {
  return Math.round(price * (1 - PREPAID_DISCOUNT_PCT / 100))
}

export const products: Product[] = [
  {
    id: 'old-shirt',
    name: 'Ultra Shaheens Classic Shirt',
    subtitle: 'The Original — by iWEAR',
    description:
      'The shirt that started it all. Our classic Ultra Shaheens jersey — crafted by iWEAR — worn by the most passionate fans in Pakistani football.',
    image: '/Merch-01.png',
    price: 2199,
    badge: 'Classic',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'new-shirt',
    name: 'Ultra Shaheens 2026 Shirt',
    subtitle: 'New Drop — by COCO',
    description:
      'Fresh off the press. The latest Ultra Shaheens jersey, proudly sponsored by COCO, representing our continued journey with Pakistan football.',
    image: '/Merch-03.png',
    price: 2099,
    badge: 'New',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    discountNote: 'Buy this shirt and get the Classic iWEAR shirt for only Rs. 1,499',
  },
  {
    id: 'combo',
    name: 'Ultra Shaheens Combo Pack',
    subtitle: 'Best Value',
    description:
      'Get both shirts at a discounted bundle price — the iWEAR Classic and the COCO-sponsored 2025 edition. Own the complete Ultra Shaheens collection.',
    images: ['/Merch-01.png', '/Merch-03.png'],
    image: '/Merch-01.png',
    price: 3499,
    originalPrice: 4198,
    savings: 699,
    badge: 'Bundle Deal',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    isCombo: true,
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-PK')}`
}
