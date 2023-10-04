import { Link } from 'dom-reactivity'
import config from 'lib/config'
import FooterMenu from 'components/layout/footer-menu'
import LogoSquare from 'components/logo-square'

const { COMPANY_NAME, SITE_NAME, footerMenu: menu } = config

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700'
  const copyrightName = COMPANY_NAME || SITE_NAME || ''

  return (
    <footer class="text-sm text-neutral-500 dark:text-neutral-400">
      <div class="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm dark:border-neutral-700 md:flex-row md:gap-12 md:px-4 xl:px-0">
        <div>
          <Link class="flex items-center gap-2 text-black dark:text-white md:pt-1" href="/">
            <LogoSquare size="sm" />
            <span class="uppercase">{SITE_NAME}</span>
          </Link>
        </div>
        <FooterMenu menu={menu} />
        <div class="md:ml-auto">
          <a
            class="flex h-8 w-max flex-none items-center justify-center rounded-md border border-neutral-200 bg-white text-xs text-black dark:border-neutral-700 dark:bg-black dark:text-white"
            aria-label="Deploy on Vercel"
            href="https://github.com/davidivkovic/dom-reactivity"
          >
            <span class="px-3">▲</span>
            <hr class="h-full border-r border-neutral-200 dark:border-neutral-700" />
            <span class="px-3">Deploy</span>
          </a>
        </div>
      </div>
      <div class="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div class="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 xl:px-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>
          <hr class="mx-4 hidden h-4 w-[1px] border-l border-neutral-400 md:inline-block" />
          <p>Designed in California</p>
          <p class="md:ml-auto">
            Crafted by{' '}
            <a href="https://vercel.com" class="text-black dark:text-white">
              ▲ Vercel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
