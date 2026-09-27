import type { ImageMetadata } from 'astro'

import boardRu from './assets/screens/board-ru.png'
import boardUz from './assets/screens/board-uz.png'
import boardGridRu from './assets/screens/board-grid-ru.png'
import boardGridUz from './assets/screens/board-grid-uz.png'
import miniExtendRu from './assets/screens/mini-extend-ru.png'
import miniExtendUz from './assets/screens/mini-extend-uz.png'
import miniOrdersRu from './assets/screens/mini-orders-ru.png'
import miniOrdersUz from './assets/screens/mini-orders-uz.png'
import miniProductRu from './assets/screens/mini-product-ru.png'
import miniProductUz from './assets/screens/mini-product-uz.png'
import miniTermsRu from './assets/screens/mini-terms-ru.png'
import miniTermsUz from './assets/screens/mini-terms-uz.png'
import orderRu from './assets/screens/order-ru.png'
import orderUz from './assets/screens/order-uz.png'
import reportsRu from './assets/screens/reports-ru.png'
import reportsUz from './assets/screens/reports-uz.png'

/** The demo company the screenshots were taken from; its bot title on the phone frames. */
export const demoCompany = 'Прокат «Регистон»'

/**
 * Real screens of the ANJOM panel and Mini App, taken from the demo company
 * in each language — so a visitor reading Russian sees the Russian product.
 */
export interface Screens {
  board: ImageMetadata
  boardGrid: ImageMetadata
  order: ImageMetadata
  reports: ImageMetadata
  mini: Record<'product' | 'orders' | 'extend' | 'terms', ImageMetadata>
}

export const screens: Record<'uz' | 'ru', Screens> = {
  uz: {
    board: boardUz,
    boardGrid: boardGridUz,
    order: orderUz,
    reports: reportsUz,
    mini: { product: miniProductUz, orders: miniOrdersUz, extend: miniExtendUz, terms: miniTermsUz },
  },
  ru: {
    board: boardRu,
    boardGrid: boardGridRu,
    order: orderRu,
    reports: reportsRu,
    mini: { product: miniProductRu, orders: miniOrdersRu, extend: miniExtendRu, terms: miniTermsRu },
  },
}
