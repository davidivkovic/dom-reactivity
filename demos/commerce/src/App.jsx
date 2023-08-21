import Index from 'pages/index'
import Navbar from 'components/layout/navbar'
import Footer from 'components/layout/footer'

import { IndexData } from 'pages/index'
import { LayoutData } from 'pages/search/layout'
import { CollectionData } from 'pages/search/[collection]'
import { ProductData } from 'pages/products/[handle]'

import config from 'lib/config'
import { Router, lazy } from 'dom-reactivity'

const routes = [
  {
    path: '/',
    data: IndexData,
    component: Index
  },
  {
    path: '/search',
    data: LayoutData,
    component: lazy(() => import('pages/search/layout')),
    children: [
      {
        path: '/results',
        component: lazy(() => import('pages/search/page'))
      },
      {
        path: '/:c',
        data: CollectionData,
        component: lazy(() => import('pages/search/[collection]'))
      }
    ]
  },
  {
    path: '/product/:handle',
    data: ProductData,
    component: lazy(() => import('pages/products/[handle]'))
  },
  {
    path: '/checkout',
    component: lazy(() => import('pages/checkout'))
  },
  ...config.footerMenu.map(({ path }) => ({
    path,
    component: lazy(() => import(`pages/[page]`))
  }))
]

export default function App() {
  return (
    <div class="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
      <Navbar />
      <main>
        <Router routes={routes}/>
      </main>
      <Footer />
    </div>
  )
}