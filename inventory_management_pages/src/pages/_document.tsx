import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap'
        />
        <link rel='icon' href='favicon.svg' />
        <meta name='robots' content='noindex, nofollow' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <body>
        {/* <CssBaseLine /> */}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
