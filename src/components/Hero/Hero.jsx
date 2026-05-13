import "./Hero.css";
import coffeeCup from "../../assets/img/coffeeCup.png";

export default function Hero() {
  return (
    <section className="hero">
      {/* Dark overlay */}
      <div className="hero__overlay" />

      {/* Content */}
      <div className="hero__content container">
        <p className="hero__tagline">NOW YOU CAN FEEL THE ENERGY</p>
        <h1 className="hero__title">
          Start your day with
          <br />a black Coffee
        </h1>
        <div>
          <button className="hero__btn">BUY NOW</button>
        </div>
      </div>

      {/* Coffee cup image */}
      <img src={coffeeCup} alt="Coffee Cup" className="hero__cup" />

      {/* Bottom torn white edge */}
      <div className="hero__torn" />
    </section>
  );
}
