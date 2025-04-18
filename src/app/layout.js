// // src/app/layout.js
// import { Inter } from 'next/font/google';
// import './globals.css';
// import Head from 'next/head';
// import dynamic from 'next/dynamic';
// import ReduxProvider from '@/store/provider';
// import ThemeProviderWrapper from '@/store/themeProvider';
// import Footer from '@/components/footer';
// import Header from '@/components/header';

// // Dynamically import LoggedDataDisplay, disabling SSR
// const LoggedDataDisplay = dynamic(() => import('@/components/LoggedDataDisplay'), { ssr: false });

// export const viewport = {
//   width: 'device-width',
//   initialScale: 1,
//   minimumScale: 1,
//   maximumScale: 1,
// };

// export const metadata = {
//   title: 'Купить опто-волоконный кабель',
//   description:
//     'Купить волконно-оптический кабель, Купить телекоммуникационные шкафы, Купить силовые кабеля Купить электрический провод Купить оптические кросы Купить оптические муфты',
//   verification: {
//     google: 'Qmi_pB30aPPO__Ht7NT-D8VY8E8xKifhiMwMRybaur4',
//   },
// };


// export default function RootLayout({ children }) {
  
//   return (
//     <html lang="en">
//       <Head>
//         <meta
//           name="viewport"
//           content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0"
//         />
//         <script
//           async
//           src="https://www.googletagmanager.com/gtag/js?id=AW-16464823771"
//         ></script>
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               window.dataLayer = window.dataLayer || [];
//               function gtag(){dataLayer.push(arguments)}
//               gtag('js', new Date());
//               gtag('config', 'AW-16464823771');
//             `,
//           }}
//         />
//        <script src="https://widget.tiptoppay.kz/bundles/widget.js"></script>
//       </Head>
//       <body>
//         <ThemeProviderWrapper>
//           <ReduxProvider>
//          <Header />
//             <main>{children}</main>
//             <Footer />
//             <LoggedDataDisplay />
//           </ReduxProvider>
//         </ThemeProviderWrapper>
//       </body>
//     </html>
//   );
// }


import './globals.css';
import Head from 'next/head';
import ReduxProvider from '@/store/provider';
import ThemeProviderWrapper from '@/store/themeProvider';
import dynamic from 'next/dynamic';

// Dynamically import LoggedDataDisplay, disabling SSR
const LoggedDataDisplay = dynamic(() => import('@/components/LoggedDataDisplay'), { ssr: false });

// Импортируем клиентский RootLayout
import RootLayout from './RootLayout';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: 'Купить опто-волоконный кабель',
  description:
    'Купить волконно-оптический кабель, Купить телекоммуникационные шкафы, Купить силовые кабеля Купить электрический провод Купить оптические кросы Купить оптические муфты',
  verification: {
    google: 'Qmi_pB30aPPO__Ht7NT-D8VY8E8xKifhiMwMRybaur4',
  },
};

export default function ServerLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0"
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-16464823771"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments)}
              gtag('js', new Date());
              gtag('config', 'AW-16464823771');
            `,
          }}
        />
        <script src="https://widget.tiptoppay.kz/bundles/widget.js"></script>
      </Head>
      <body>
        <ThemeProviderWrapper>
          <ReduxProvider>
            <RootLayout>{children}</RootLayout>

          </ReduxProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}