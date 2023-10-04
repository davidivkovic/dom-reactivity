import { signal } from "dom-reactivity"

const products = await fetch('/products/catalog.json').then(res => res.json())
const carts = JSON.parse(localStorage.getItem('carts')) ?? {}

Object.keys(carts).forEach(key => carts[key] = signal(carts[key]))

function delay() {
  const min = 30
  const max = 120
  const random = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(resolve => setTimeout(resolve, random))
}

function persist(cart) {
  recalulateCart(cart)
  cart?.id && carts[cart.id]({ ...cart })
  const c = Object.fromEntries(Object.entries(carts).map(([key, cart]) => [key, cart()]))
  localStorage.setItem('carts', JSON.stringify(c))
}

function recalulateCart(cart) {
  const subtotal = cart.lines.reduce((total, item) => total + item.cost.totalAmount.amount, 0)
  const tax = subtotal * 0.12
  
  cart.cost.totalTaxAmount.amount = tax
  cart.cost.totalAmount.amount = subtotal + tax

  cart.totalQuantity = cart.lines.reduce((total, item) => total + item.quantity, 0)
}

export async function createCart() {
  console.log('createCart')
  await delay()

  const cartId = Math.random().toString(36).slice(2, 16)
  const cart = {
    id: cartId,
    totalQuantity: 0,
    lines: [],
    cost: {
      totalAmount: {
        amount: 0,
        currencyCode: 'USD'
      },
      totalTaxAmount: {
        amount: 0,
        currencyCode: 'USD'
      },
    },
    checkoutUrl: '/checkout'
  }

  carts[cartId] = signal()
  persist(cart)

  return carts[cartId]()
}

export async function getCart(cartId) {
  await delay()
  return carts[cartId]
}

export async function addToCart(cartId, items) {
  console.log('addToCart', cartId, items)
  await delay()

  const cart = carts[cartId]?.()
  if (!cart) {
    throw new Error('Cart not found')
  }

  items.forEach(item => {
    const cartItem = cart.lines.find(cartItem => cartItem.merchandiseId === item.merchandiseId)
    if (cartItem) {
      cartItem.quantity += item.quantity
      cartItem.cost.totalAmount.amount += item.quantity * cartItem.merchandise.product.priceRange.maxVariantPrice.amount
    } 
    else {
      const product = products.find(p => p.variants.find(v => v.id === item.merchandiseId))
      if (!product) {
        throw new Error('Product not found')
      }
      
      const variant = product.variants.find(v => v.id === item.merchandiseId)
      if (!variant) {
        throw new Error('Variant not found')
      }
      
      cart.lines.push({
        id: Math.random().toString(36).slice(2, 16),
        cost: {
          totalAmount: {
            amount: product.priceRange.maxVariantPrice.amount * item.quantity,
            currencyCode: 'USD'
          },
          totalTaxAmount: {
            amount: 0,
            currencyCode: 'USD'
          },
        },
        quantity: item.quantity,
        merchandiseId: variant.id,
        merchandise: {
          product,
          selectedOptions: variant.selectedOptions,
          title: variant.selectedOptions.map(o => o.value).join(' - ')
        }
      })
    }
  })

  persist(cart)
}

export async function removeFromCart(cartId, lineIds) {
  await delay()

  const cart = carts[cartId]?.()
  if (!cart) {
    throw new Error('Cart not found')
  }

  cart.lines = cart.lines.filter(item => !lineIds.includes(item.id))

  persist(cart)
}

export async function updateCart(cartId, itemsToUpdate) {
  await delay()

  const cart = carts[cartId]?.()
  if (!cart) {
    throw new Error('Cart not found')
  }

  itemsToUpdate.forEach(item => {
    const cartItem = cart.lines.find(line => line.id === item.id)
    if (!cartItem) {
      throw new Error('Cart item not found')
    }
    cartItem.quantity = item.quantity
    cartItem.cost.totalAmount.amount = cartItem.quantity * cartItem.merchandise.product.priceRange.maxVariantPrice.amount
  })

  persist(cart)
}

export async function getProduct(handle) {
  await delay()
  return products.find(product => product.handle === handle)
}

export async function getProductRecommendations(handle) {
  await delay()
  return [...products]
    .sort(() => Math.random() - Math.random())
    .filter(p => p.handle != handle)
    .slice(0, 8)
}

export async function getCollectionProducts({ collection, sortKey, reverse, query }) {
  await delay()

  const sorter = (a, b) => {
    if (sortKey === 'BEST_SELLING') {
      return a.id - b.id
    }
    if (sortKey === 'CREATED_AT') {
      return new Date(a.createdAt) - new Date(b.createdAt)
    }
    if (sortKey === 'PRICE') {
      return a.price - b.price
    }
    return 0
  }

  let results = products
    .filter(product => product.collections?.includes(collection.toLowerCase()))
    .sort(sorter)

  if (query?.length) {
    results = results.filter(product => product.title.toLowerCase().includes(query.toLowerCase()))
  }

  return reverse ? results.reverse() : results
}

export function getProducts({ sortKey, reverse, searchValue }) {
  return getCollectionProducts({ collection: 'all', sortKey, reverse, query: searchValue })
}

export async function getCollections() {
  await delay()
  return [
    {
      title: "All",
      path: "/search/all",
    },
    {
      title: "Bags",
      path: "/search/bags",
    },
    // {
    //   title: "Drinkware",
    //   path: "/search/drinkware",
    // },
    // {
    //   title: "Electronics",
    //   path: "/search/electronics",
    // },
    // {
    //   title: "Footware",
    //   path: "/search/footware",
    // },
    {
      title: "Headwear",
      path: "/search/headwear",
    },
    {
      title: "Hoodies",
      path: "/search/hoodies",
    },
    // {
    //   title: "Jackets",
    //   path: "/search/jackets",
    // },
    // {
    //   title: "Kids",
    //   path: "/search/kids",
    // },
    // {
    //   title: "Pets",
    //   path: "/search/pets",
    // },
    {
      title: "Shirts",
      path: "/search/shirts",
    },
    {
      title: "Stickers",
      path: "/search/stickers",
    }
  ]
}