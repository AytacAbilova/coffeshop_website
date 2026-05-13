import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      {/* Dark overlay */}
      <div className="hero__overlay" />

      {/* Content */}
      <div className="hero__content">
        <p className="hero__tagline">NOW YOU CAN FEEL THE ENERGY</p>
        <h1 className="hero__title">
          Start your day with
          <br />a black Coffee
        </h1>
        <button className="hero__btn">BUY NOW</button>
      </div>

      {/* Coffee cup image */}
      <img
        src="https://static.vecteezy.com/system/resources/previews/043/558/833/original/take-away-coffee-cup-mockup-on-isolated-transparent-background-free-png.png"
        alt="Coffee Cup"
        className="hero__cup"
      />

      {/* Bottom torn white edge */}
      <div className="hero__torn" />
      
    </section>
  );
}
