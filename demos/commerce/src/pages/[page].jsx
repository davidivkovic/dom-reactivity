import Prose from 'components/prose'
import config from "lib/config"

const { footerMenu, SITE_NAME } = config

export default function Page() {

  const page = {
    title: footerMenu.find(({ path }) => path === window.location.pathname)?.title,
    body: `
      <p>
        The sun dipped below the horizon, casting a warm orange glow across the tranquil landscape. A gentle breeze rustled the leaves of the trees, creating a soft whispering melody. Birds perched on branches, their songs filling the air with a symphony of nature. As twilight settled in, the stars emerged one by one, twinkling like diamonds on a velvet canvas.
      </p>
      <p>
        In a quaint village nestled between rolling hills, life bustled in harmony with the rhythm of the seasons. The aroma of freshly baked bread wafted from the bakery, enticing passersby with its inviting scent. Children laughed and played in the cobbled streets, their joy infectious to all who encountered them. The village square buzzed with activity as vendors displayed their wares, creating a vibrant tapestry of colors and textures.
      </p>
    `,
    updatedAt: 1690000000000
  }

  document.title = `${page.title} | ${SITE_NAME}`

  return (
    <div class="w-full">
      <div class="mx-8 max-w-2xl py-20 sm:mx-auto">
        <h1 class="mb-8 text-5xl font-bold">{page.title}</h1>
        <Prose class="mb-8" html={page.body} />
        <p class="text-sm">
          {`This document was last updated on ${new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).format(new Date(page.updatedAt))}.`}
        </p>
      </div>
    </div>
  )
}