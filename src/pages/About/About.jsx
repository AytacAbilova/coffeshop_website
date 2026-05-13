import { useRef, useEffect, useState } from "react";
import coffeeImg from "../../assets/img/coffeeAbout.avif";
import "./About.css";

function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export default function AboutSection() {
  const [imgRef, imgVisible] = useFadeIn();
  const [txtRef, txtVisible] = useFadeIn();

  return (
    <section className="about-section">
      <div className="about-inner">
        {/* ── Image ── */}
        <div ref={imgRef} className={`abt-fade ${imgVisible ? "in" : ""}`}>
          <div className="about-img-wrap">
            <div className="about-img-frame">
             <div
  className="about-img-inner"
  style={{ backgroundImage: `url(${coffeeImg})` }}
></div>
            </div>
            <div className="about-img-border" />
            <div className="about-badge">
              <span className="about-badge-year">2006</span>
              <span className="about-badge-label">Since</span>
            </div>
          </div>
        </div>

        {/* ── Text ── */}
        <div
          ref={txtRef}
          className={`abt-fade abt-fade-d1 ${txtVisible ? "in" : ""}`}
        >
          <p className="about-tag">Who We Are</p>

          <h2 className="about-heading">
            A story brewed
            <br />
            with <em>love & craft</em>
          </h2>

          <p className="about-text">
            It all started with a single espresso machine in a sun-drenched
            kitchen in Lisbon. Lena Hartmann, a former architect, had fallen
            hopelessly in love with the craft of specialty coffee — and decided
            the world deserved to experience it differently.
          </p>

          <p className="about-text">
            Today, nearly two decades later, we still roast every batch by hand,
            still travel to origin farms ourselves, and still believe the best
            cup of coffee is the one made with care, not convenience.
          </p>

          <div className="about-divider">
            <div className="about-divider-dot" />
          </div>

          <p className="about-quote">
            "Coffee is not a commodity. It is a relationship — between soil and
            sun, farmer and roaster, barista and guest."
          </p>

          <button className="about-btn">Discover Our Menu →</button>
        </div>
      </div>
    </section>
  );
}
