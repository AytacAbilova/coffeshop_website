import { useMemo, useState } from "react";
import { createReservation, getTables } from "../Admin/adminStorage";
import "./Reservation.css";

function Reservation() {
  const availableTables = useMemo(
    () => getTables().filter((t) => t && t.status === "available"),
    []
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("");
  const [phone, setPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    setSuccess("");

    const payload = {
      customer: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      },
      date,
      time,
      guests: Number(guests) || 0,
      tableNumber: tableNumber ? Number(tableNumber) : null,
      note: note.trim(),
    };

    if (!payload.customer.name) return;
    if (!payload.customer.phone) return;
    if (!payload.date || !payload.time) return;
    if (!payload.guests || payload.guests < 1) return;

    createReservation(payload);
    setName("");
    setEmail("");
    setDate("");
    setTime("");
    setGuests("");
    setPhone("");
    setTableNumber("");
    setNote("");
    setSuccess("Rezervasiyanız qəbul olundu. /myorders bölməsində görə bilərsiniz.");
  }

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
          <form className="reservationForm" onSubmit={onSubmit}>
            <h2>Make Reservation</h2>

            {success ? <div className="reservationNotice">{success}</div> : null}

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="doubleInput">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="doubleInput">
              <input
                type="number"
                min={1}
                placeholder="Guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                required
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="doubleInput">
              <select
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              >
                <option value="">Select table (optional)</option>
                {availableTables.map((t) => (
                  <option key={t.number} value={t.number}>
                    Table #{t.number}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Location (optional)"
                value="Baku"
                readOnly
              />
            </div>

            <textarea
              placeholder="Special Request"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>

            <button type="submit">BOOK A TABLE</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Reservation;
