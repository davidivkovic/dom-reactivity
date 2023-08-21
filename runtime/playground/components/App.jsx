import { signal, Router, navigateTo, useParams, useQuery, Link, resource, lazy, effect } from '../../src/client'
import styles from './App.module.css'

const ProductDetails = lazy(() => import('./ProductDetails'))

function Home(props) {
  return (
    <>
      <h1>Home</h1>
      {props.children}
    </>
  ) 
}

function About() {
  return <h1>About</h1>
}

function Products(props) {
  const time = new Date().toISOString()
  return <>
    <h1>Products</h1>
    <h2>Time: {time}</h2>
    {props.children}
  </>
}

function ProductPrice(props) {
  const params = useParams()
  return <div>Price: {params().price}</div>
}

function NotFound() {
  return <h1>Not Found</h1>
}

function Layout(props) {
  return <div>
    <h1>Layout</h1>
    <div>{props.children}</div>
  </div>
}

function Data({params, query, preloaded }) {
  const [product] = resource(
    params, 
    p => {
      return p.id && fetch("https://dummyjson.com/products/" + p.id).then(r => r.json())
    },
    { preloaded }
  )
  return product
}

const routes = [
  {
    path: '/test',
    component: (props) => <div>Test<div>{props.children}</div></div>,
    children: [
      {
        path: '/test2',
        component: () => <div>Test2</div>,
      }
    ]
  },
  {
    path: '/top',
    component: () => <div>Top</div>,
  },
  {
    path: '/search',
    component: Home,
    children: [
      {
        path: '/',
        component: () => <div>Index</div>,
      },
      {
        path: '/about',
        component: About,
      },
      {
        path: '/products',
        component: Products,
        children: [
          {
            path: '/all',
            component: () => <div>All Products</div>,
          },
          {
            path: '/:id',
            component: ProductDetails,
            data: Data,
            children: [
              {
                path: '/:price',
                component: ProductPrice,
              }
            ]
          }
        ],
      },
      {
        path: '/*',
        component: NotFound,
      },
    ]
    
  },
]

export default function App() {

  const query = useQuery()
  const count = signal(0)
  const increment = () => count(c => c + 1)

  return (
    <div>
      {/* <ProductDetails>
        <h1>Hello</h1>
      </ProductDetails> */}
      <button onClick={increment}>Increment</button>
      <if condition={count() % 2 == 0} enterClass={styles.enter} exitClass={styles.exit}>
        <h1>My Awesome App</h1>
      </if>
      <div>
        <Link style={{'margin': '0 10px'}} href="/products/5" activeClass="test">/products/5</Link>
        <Link href="/products/6" activeClass="test"><div>/products/6</div></Link>
        <Link href="/test" activeClass="test">test</Link>
        <Link href="/test/test2" activeClass="test">test2</Link>
        <button onClick={() => navigateTo('/search/')}>Go to Home</button>
        <button onClick={() => navigateTo('/search/about')}>Go to About</button>
        <button onClick={() => navigateTo('/top')}>Go to Top</button>
        <button onClick={() => navigateTo('/search/products?tx=2')}>Go to Products</button>
        <button onClick={() => navigateTo('/search/products/all')}>Go to All Products</button>
        <button onMouseover={ProductDetails.preload} onClick={() => navigateTo('/search/products/1')}>Go to Product 1 Details</button>
        <button onClick={() => navigateTo('/search/products/2')}>Go to Product 2 Details</button>
        <button onClick={() => navigateTo('/search/products/1/12')}>Go to Product 1 Price</button>
        <button onClick={() => navigateTo('/404')}>Go to 404</button>
        <button onClick={() => {
          count(c => c + 1)
          query(q => ({ ...q, count: true }))
        }}
        >
          Change query ({JSON.stringify(query())})
        </button>
      </div>
      {/* Render the Router component */}
      <Router routes={routes} />
    </div>
  )
}