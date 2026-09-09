import Masthead from "./sections/Masthead";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Research from "./sections/Research";
import Projects from "./sections/Projects";
import Publications from "./sections/Publications";
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
