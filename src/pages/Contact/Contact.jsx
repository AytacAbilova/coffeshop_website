import "./Contact.css";

function Contact() {
  return (
    <section className="contactSection">
      <div className="contactContainer">

        {/* LEFT INFO */}
        <div className="contactInfo">
          <h2>Contact Us</h2>
          <p>
            We are here to help you with reservations, events or any questions.
            Feel free to reach out anytime.
          </p>

          <div className="infoBox">
            <h4>Location</h4>
            <span>Baku, Azerbaijan</span>
          </div>

          <div className="infoBox">
            <h4>Phone</h4>
            <span>+994 00 000 00 00</span>
          </div>

          <div className="infoBox">
            <h4>Email</h4>
            <span>coffee@cafe.com</span>
          </div>

          <div className="infoBox">
            <h4>Working Hours</h4>
            <span>08:00 AM - 11:00 PM</span>
          </div>
        </div>

        {/* RIGHT FORM */}
        <form className="contactForm">
          <h2>Send Message</h2>

          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <input type="text" placeholder="Subject" />

          <textarea placeholder="Your Message" rows="6"></textarea>

          <button type="submit">Send Message</button>
        </form>

      </div>
    </section>
  );
}

export default Contact;