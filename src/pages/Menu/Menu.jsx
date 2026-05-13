// CafeMenu.jsx
import "./Menu.css";

export default function CafeMenu() {
  return (
    <div className="menu-page">
      <div className="container">
        <h1 className="title">Our Menu</h1>

        <div className="menu-grid">
          <div className="menu-card">
            <h2>Coffee</h2>
            <div className="menu-item"><span>Espresso</span><span>$3</span></div>
            <div className="menu-item"><span>Cappuccino</span><span>$4</span></div>
            <div className="menu-item"><span>Latte</span><span>$4.5</span></div>
          </div>

          <div className="menu-card">
            <h2>Desserts</h2>
            <div className="menu-item"><span>Chocolate Cake</span><span>$5</span></div>
            <div className="menu-item"><span>Cheesecake</span><span>$5.5</span></div>
            <div className="menu-item"><span>Croissant</span><span>$3.5</span></div>
          </div>

          <div className="menu-card">
            <h2>Drinks</h2>
            <div className="menu-item"><span>Fresh Juice</span><span>$4</span></div>
            <div className="menu-item"><span>Tea</span><span>$2.5</span></div>
            <div className="menu-item"><span>Smoothie</span><span>$5</span></div>
          </div>
          <div className="menu-card">
            <h2>Drinks</h2>
            <div className="menu-item"><span>Fresh Juice</span><span>$4</span></div>
            <div className="menu-item"><span>Tea</span><span>$2.5</span></div>
            <div className="menu-item"><span>Smoothie</span><span>$5</span></div>
          </div>
          <div className="menu-card">
            <h2>Drinks</h2>
            <div className="menu-item"><span>Fresh Juice</span><span>$4</span></div>
            <div className="menu-item"><span>Tea</span><span>$2.5</span></div>
            <div className="menu-item"><span>Smoothie</span><span>$5</span></div>
          </div>
          <div className="menu-card">
            <h2>Drinks</h2>
            <div className="menu-item"><span>Fresh Juice</span><span>$4</span></div>
            <div className="menu-item"><span>Tea</span><span>$2.5</span></div>
            <div className="menu-item"><span>Smoothie</span><span>$5</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}


