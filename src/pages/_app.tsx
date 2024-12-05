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
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);