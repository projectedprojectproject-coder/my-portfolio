import Masthead from "./sections/Masthead";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Featured from "./sections/Featured";
import Research from "./sections/Research";
import Projects from "./sections/Projects";
import Assignments from "./sections/Assignments";
import PromptDoc from "./sections/PromptDoc";
import Publications from "./sections/Publications";
import Media from "./sections/Media";
import Awards from "./sections/Awards";
import Changelog from "./sections/Changelog";
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
        <Featured />
        <Research />
        <Projects />
        <Assignments />
        <PromptDoc />
        <Publications />
        <Media />
        <Awards />
        <Changelog />
        <Contact />
      </main>

      <div className="shell credits">
        <span>{profile.footerLeft}</span>
        <span>{profile.footerRight}</span>
      </div>
    </>
  );
}
