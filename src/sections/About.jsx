import { about } from "../data";
import { useSectionTitles } from "../lib/useSectionTitles";
import Clapperboard from "../components/Clapperboard";

// 소개 섹션: 제목(관리자 '제목' 탭에서 바꾼 값)과 클래퍼보드 카드만 보여준다.
export default function About() {
  const titles = useSectionTitles();

  return (
    <section id="about" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>ABOUT
        </div>
        <div>
          <h2>{titles.about || "소개"}</h2>
          <Clapperboard data={about} />
        </div>
      </div>
    </section>
  );
}
