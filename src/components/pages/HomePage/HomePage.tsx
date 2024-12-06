import Head from "next/head";
import { Footer } from "../../Footer";
import { Header } from "../../Header";
import { DescriptionSection } from "./subcomponents/DescriptionSection";
import { MostPopularSection } from "./subcomponents/MostPopularSection";
import { NavigationSection } from "./subcomponents/NavigationSection";

export const HomePage = () => (
  <>
    <Head>
      <title>{"Explorelocations.com"}</title>
      <meta
        name="description"
        content={
          "This is not an official website. Original was closed, this is just a mock version"
        }
      />
    </Head>
    <Header />
    <main className="mb-6">
      <DescriptionSection />
      <NavigationSection />
      <MostPopularSection />
      {/* <SubscribeSection /> */}
    </main>
    <Footer />
  </>
);
