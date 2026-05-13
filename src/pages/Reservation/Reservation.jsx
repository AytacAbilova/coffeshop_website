// Reservation.jsx

import "./Reservation.css";

function Reservation() {
  return (
    <section className="reservation">
      <div className="overlay"></div>

      <div className="reservationContainer">
        <div className="reservationLeft">
          <span className="subTitle">BOOK YOUR TABLE</span>

          <h1>
            Reserve Your <br /> Coffee Time
          </h1>

          <p>
            Fresh coffee, relaxing atmosphere and delicious desserts.
            Reserve your place now and enjoy your special moments with us.
          </p>

          <div className="infoCards">
            <div className="card">
              <h3>Opening Hours</h3>
              <p>08:00 AM - 11:00 PM</p>
            </div>

            <div className="card">
              <h3>Location</h3>
              <p>Baku, Azerbaijan</p>
            </div>
          </div>
        </div>

        <div className="reservationRight">
          <form className="reservationForm">
            <h2>Make Reservation</h2>

            <input type="text" placeholder="Your Name" />

            <input type="email" placeholder="Email Address" />

            <div className="doubleInput">
              <input type="date" />

              <input type="time" />
            </div>

            <div className="doubleInput">
              <input type="number" placeholder="Guests" />

              <input type="tel" placeholder="Phone Number" />
            </div>

            <textarea placeholder="Special Request"></textarea>

            <button type="submit">BOOK A TABLE</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Reservation;