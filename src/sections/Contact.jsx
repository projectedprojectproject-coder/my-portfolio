import { contact, profile } from "../data";

export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="section-inner">
        <div className="section-mark">
          <span className="glyph">§</span>CONTACT
        </div>
        <div className="contact-block">
          <p className="contact-copy">{contact.copy}</p>
          <a className="contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </div>
      </div>
    </section>
  );
}
