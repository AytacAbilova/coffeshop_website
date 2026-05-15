// Footer.jsx
import "./Footer.css";
import { FaFacebookF, FaTwitter, FaDribbble, FaBehance } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-overlay">
        <div className="footer-container">

          <div className="footer-col">
            <h3>About Us</h3>
            <p>
              We create a cozy atmosphere with the best coffee and desserts.
              Enjoy your time with us in a premium environment.
            </p>
            <p className="copyright">
              ©2026 All rights reserved | Made with ❤ by <span>Colorlib</span>
            </p>
          </div>

          <div className="footer-col center">
            <h3>Newsletter</h3>
            <p>Stay updated with our latest offers</p>
            <div className="newsletter">
              <input type="email" placeholder="Enter your email" />
              <button>→</button>
            </div>
          </div>

          <div className="footer-col">
            <h3>Follow Us</h3>
            <p>Let us be social</p>
            <div className="socials">
              <FaFacebookF />
              <FaTwitter />
              <FaDribbble />
              <FaBehance />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}


