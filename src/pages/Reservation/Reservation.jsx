import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  apiCreateReservation,
  apiGetTables,
  getAccessToken,
  getCurrentUser,
} from "../Admin/adminStorage";
import "./Reservation.css";

function Reservation() {
  const navigate = useNavigate();
  const user = useMemo(() => getCurrentUser(), []);

  const [tables, setTables] = useState([]);
  const availableTables = useMemo(
    () =>
      tables.filter(
        (t) => t && Number.isFinite(Number(t.id)) && Number(t.status) === 1
      ),
    [tables]
  );
  const [tablesLoading, setTablesLoading] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [durationHours, setDurationHours] = useState("2");
  const [tableId, setTableId] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setTablesLoading(true);
      const res = await apiGetTables();
      if (!alive) return;
      if (!res.ok) {
        setTables([]);
        setTablesLoading(false);
        return;
      }
      const list = Array.isArray(res.data) ? res.data : [];
      const normalized = list.map((t) => ({
        id: Number(t.id),
        number: Number(t.number),
        capacity: Number(t.capacity),
        status: Number(t.status),
      }));
      setTables(normalized);
      setTablesLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  function buildIsoLocal(dateStr, timeStr) {
    if (!dateStr || !timeStr) return "";
    const d = new Date(`${dateStr}T${timeStr}`);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString();
  }

  const endPreview = useMemo(() => {
    const startIso = buildIsoLocal(date, time);
    const hours = Number(durationHours) || 0;
    const startMs = startIso ? Date.parse(startIso) : NaN;
    if (!Number.isFinite(startMs) || hours <= 0) return "";
    const end = new Date(startMs + hours * 60 * 60 * 1000);
    return end.toLocaleString("az-AZ");
  }, [date, time, durationHours]);

  async function onSubmit(e) {
    e.preventDefault();
    setSuccess("");

    if (!getAccessToken()) {
      toast.error("Rezervasiya üçün əvvəlcə login olun.");
      navigate("/login");
      return;
    }

    const startIso = buildIsoLocal(date, time);
    const hours = Number(durationHours) || 0;
    const startMs = startIso ? Date.parse(startIso) : NaN;
    const endIso =
      Number.isFinite(startMs) && hours > 0
        ? new Date(startMs + hours * 60 * 60 * 1000).toISOString()
        : "";

    const tid = Number(tableId);
    if (!Number.isFinite(tid) || tid <= 0) return;
    if (!startIso || !endIso) return;

    const res = await apiCreateReservation({
      tableId: tid,
      startDatetime: startIso,
      endDatetime: endIso,
    });

    if (!res.ok) {
      toast.error("Rezervasiya alınmadı.");
      return;
    }

    setDate("");
    setTime("");
    setDurationHours("2");
    setTableId("");
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

            <div className="reservationProfile">
              <div>
                <p className="reservationProfileLabel">Customer</p>
                <p className="reservationProfileValue">
                  {user?.fullName || user?.customerFullName || user?.email || "Guest"}
                </p>
              </div>
              <div>
                <p className="reservationProfileLabel">Email</p>
                <p className="reservationProfileValue">{user?.email || "-"}</p>
              </div>
            </div>

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
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                required
              >
                <option value="1">1 saat</option>
                <option value="2">2 saat</option>
                <option value="3">3 saat</option>
                <option value="4">4 saat</option>
              </select>

              <input type="text" value={endPreview ? `Bitmə: ${endPreview}` : ""} readOnly />
            </div>

            <div className="doubleInput">
              <select
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                required
              >
                <option value="">
                  {tablesLoading ? "Tables yüklənir..." : "Select table"}
                </option>
                {availableTables.map((t) => (
                  <option key={t.id} value={t.id}>
                    Table #{t.number} · Seats: {t.capacity} · Status:{" "}
                    {t.status === 1 ? "Available" : t.status === 2 ? "Reserved" : "Occupied"}
                  </option>
                ))}
              </select>
              <input type="text" value="Baku" readOnly />
            </div>

            <button type="submit">BOOK A TABLE</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Reservation;
