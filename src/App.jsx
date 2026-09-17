import Masthead from "./sections/Masthead";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Research from "./sections/Research";
import Projects from "./sections/Projects";
import Publications from "./sections/Publications";
import Media from "./sections/Media";
import Awards from "./sections/Awards";
import Contact from "./sections/Contact";
import { profile } from "./data";

export default function App() {
  return (
    <>
      <Masthead />
      <div id="top" />

      <main className="shell">
        <Hero />
        <About />
        <Research />
        <Projects />
        <Publications />
        <Media />
        <Awards />
        <Contact />
      </main>

      <div className="shell credits">
        <span>{profile.footerLeft}</span>
        <span>{profile.footerRight}</span>
      </div>
    </>
  );
}
