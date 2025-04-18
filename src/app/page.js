// "use client";

// import { usePathname } from 'next/navigation';
// import Header from '@/components/header';
// import Footer from '@/components/footer';

// export default function RootLayout({ children }) {
//   const pathname = usePathname();
//   const isAdminRoute = pathname?.startsWith('/admin');

//   console.log('RootLayout rendering, pathname:', pathname); // Отладка

//   return (
//     <>
//       {!isAdminRoute && <Header />}
//       <main>{children}</main>
//       {!isAdminRoute && <Footer />}
//     </>
//   );
// }


import Home from '@/components/home';

export default function HomePage() {
  return <Home />;
}