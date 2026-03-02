import type { AppProps } from 'next/app'
import Link from 'next/link'

export default function MyApp({ Component, pageProps }: AppProps) {
  const links = [
    '/',
    '/home',
    '/home/alerts',
    '/home/alerts/1',
    '/env',
  ]
  return <>
    <ul>
    {links.map(l => <li key={l}><Link href={l}>Go To {l}</Link></li>)}
    </ul>

    <Component {...pageProps} />
    </>
}

