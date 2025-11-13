import styles from "./page.module.css";

import Hero from "@/components/Hero/Hero";
// import Popular from "@/components/Popular/Popular";
// import TravellersList from "@/components/TravellersList/TravellersList";
import About from "@/components/About/About";
import Join from "@/components/Join/Join";

export default function Home() {
  return (
    <>
      <Hero/>
      <About />
      {/* <Popular /> */}
      {/* <TravellersList /> */}
      <Join />
    </>
  );
}
