import { contact as contactDefaults, profile } from "../data";
import { useContact } from "../lib/useContact";

export default function Contact() {
  const contact = useContact();
  // 로딩중이거나(null) 행이 없으면(false) 기존 고정 문구를 쓴다.
  const copy = (contact && contact.copy) || contactDefaults.copy;
  const email = (contact && contact.email) || profile.email;

  return (
    <section id="contact" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>CONTACT
        </div>
        <div className="contact-block">
          <p className="contact-copy">{copy}</p>
          <a className="contact-email" href={`mailto:${email}`}>
            {email}
          </a>
        </div>
      </div>
    </section>
  );
}
