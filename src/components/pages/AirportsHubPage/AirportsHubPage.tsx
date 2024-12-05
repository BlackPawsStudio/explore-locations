import Head from "next/head";
import { airportsHubDefaults } from "~/src/data/hubPagesDefaults";
import { countriesDefaults } from "~/src/data/hubPagesDefaults/countriesDefaults";
import { Footer } from "../../Footer";
import { Header } from "../../Header";
import { TopLocationsSection } from "../../shared/TopLocationsSection";
import { CountryLocationsSection } from "./subcomponents/CountryLocationsSection";
import { DescriptionSection } from "./subcomponents/DescriptionSection";
import { RouterSection } from "./subcomponents/RouterSection";

export const AirportsHubPage = () => {
  return (
    <>
      <Head>
        <title>{"Explore Popular Airports"}</title>
        <meta name="description" content={"SEO description"} />
      </Head>
      <Header />
      <main className="mb-6 min-h-screen">
        <RouterSection />
        <DescriptionSection />
        <TopLocationsSection
          locations={airportsHubDefaults}
          defaultOpen
          type="airports"
          numberOfTabsOpen={3}
        />
        {countriesDefaults.map((el, idx) => (
          <CountryLocationsSection
            name={el.name}
            locations={el.locations}
            key={idx}
            defaultOpen={idx < 2}
          />
        ))}
      </main>
      <Footer />
    </>
  );
};
