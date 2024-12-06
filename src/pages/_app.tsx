import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/src/utils/api";

import "~/src/styles/globals.css";

import { Open_Sans } from "next/font/google";
import Head from "next/head";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

interface MyAppProps {
  session: Session | null;
  dehydratedState: unknown;
}

const MyApp: AppType<MyAppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className={`${openSans.variable}`}>
        <Head>
          <title>Explore Locations</title>
          <link rel="icon" href="/favicon.svg" />
        </Head>
        <div className="sticky left-0 top-0 z-[99999] w-full bg-white pt-1 text-center text-red-500">
          This is not an official website!!! Official website is closed, this is
          just a mock testing version
        </div>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
