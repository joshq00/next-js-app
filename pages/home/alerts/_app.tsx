import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <ul>
    THIS IS A SUBAPP PAGE. BELIEVE THIS DOES NOT WORK
    </ul>

    <Component {...pageProps} />
    </>
}


