import { signal, Router, navigateTo, useParams, useQuery, Link, resource } from '../../src/client'

export default function ProductDetails(props) {
  const data = props.data
  const params = useParams()
  const time = new Date().toISOString()
  // console.log('ProductDetails', time)
  return <div>
    <h1>Product Details: {params().id}</h1>
    <h2>Time: {time}</h2>
    <if condition={!data.loading} fallback={<div>Loading...</div>}>
      <div style={{'max-width': '300px'}}>{JSON.stringify(data())}</div>
    </if>
    <h2>{props.children}</h2>
  </div>
}