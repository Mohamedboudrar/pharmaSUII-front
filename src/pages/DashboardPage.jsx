import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, Filter, MapPin, Phone, Star, Clock, ChevronRight, Navigation } from 'lucide-react';
import { pharmacies } from '../utils/pharmacyData';
import { calculateDistance } from "../utils/calculateDistance";

// Fix leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const pharmacyIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #0d9488, #0ea5e9);
    border: 3px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 4px 15px rgba(13,148,136,0.5);
    display: flex; align-items: center; justify-content: center;
  ">
    <span style="transform: rotate(45deg); font-size: 14px;">🏥</span>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const userIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative; width:20px; height:20px;">
    <div style="
      position:absolute; inset:0;
      background: #0d9488; border-radius:50%;
      border: 3px solid white;
      box-shadow: 0 0 0 4px rgba(13,148,136,0.3), 0 0 0 8px rgba(13,148,136,0.1);
    "></div>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const FlyTo = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15, { duration: 1.5 });
  }, [position, map]);
  return null;
};

const StatusBadge = ({ open }) => (
  <span className={`badge rounded-pill ${open ? 'text-bg-success' : 'text-bg-danger'}`}>
    {open ? '● Open' : '● Closed'}
  </span>
);

const DashboardPage = () => {
  const [userPos, setUserPos] = useState([34.033, -5.000]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [flyTo, setFlyTo] = useState(null);
  const [openFilter, setOpenFilter] = useState('ALL'); // ALL | OPEN | CLOSED
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        setUserPos([coords.latitude, coords.longitude]);
        setFlyTo([coords.latitude, coords.longitude]);
      },
      () => {}
    );
  }, []);

  const filtered = pharmacies

  .map((pharmacy) => {

    const distance =
      calculateDistance(
        userPos[0],
        userPos[1],
        pharmacy.lat,
        pharmacy.lng
      );

    return {
      ...pharmacy,
      distance,
      distanceValue:
        parseFloat(distance),
    };
  })

  // ONLY pharmacies within 15km
  .filter(
    (pharmacy) =>
      pharmacy.distanceValue <= 15
  )

	  // SEARCH FILTER
	  .filter(
	    (pharmacy) =>
	      pharmacy.name
	        .toLowerCase()
	        .includes(search.toLowerCase()) ||
	
	      pharmacy.address
	        .toLowerCase()
	        .includes(search.toLowerCase())
	  )

	  // OPEN / CLOSED FILTER
	  .filter((pharmacy) => {
	    if (openFilter === 'ALL') return true;
	    if (openFilter === 'OPEN') return !!pharmacy.open;
	    if (openFilter === 'CLOSED') return !pharmacy.open;
	    return true;
	  })
	
	  // SORT NEAREST FIRST
	  .sort(
	    (a, b) =>
	      a.distanceValue -
      b.distanceValue
  );

  const handlePharmacyClick = (pharmacy) => {
    setSelected(pharmacy);
    setFlyTo([pharmacy.lat, pharmacy.lng]);
  };

  return (
    <div className="ph-dashboard ph-dashboard--flush">
      <div className="row g-0 h-100">
        <div className="col-12 col-md-4 col-lg-3 ph-sidebar ph-drawer glass-strong d-flex flex-column">
          <div className="d-md-none d-flex justify-content-center pt-2 pb-1">
            <div
              aria-hidden="true"
              style={{
                width: 48,
                height: 5,
                borderRadius: 999,
                background: 'rgba(15, 23, 42, 0.18)',
              }}
            />
          </div>
          <div className="p-3 border-bottom">
            <div className="position-relative mb-2">
              <div className="position-absolute top-50 translate-middle-y ms-3 text-secondary">
                <Search size={18} />
              </div>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search pharmacies..."
                className="form-control ui-input ps-5"
              />
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2">
              <div className="small text-secondary">{filtered.length} pharmacies nearby</div>
              <div className="d-flex align-items-center gap-2">
                <select
                  className="form-select form-select-sm"
                  value={openFilter}
                  onChange={(e) => setOpenFilter(e.target.value)}
                  aria-label="Filter pharmacies by open or closed"
                >
                  <option value="ALL">All</option>
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                </select>
                
              </div>
            </div>
          </div>

          <div className="ph-sidebar-body p-3 d-grid gap-2 flex-grow-1">
            <AnimatePresence>
              {filtered.map((pharmacy, i) => {
                const active =
                    selected?.id === pharmacy.id;

                const nearest =
                    filtered[0]?.id === pharmacy.id;
                return (
                  <motion.div
                    key={pharmacy.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handlePharmacyClick(pharmacy)}
                    className="card border rounded-4"
                    style={{
                      cursor: 'pointer',
                      background: active ? 'var(--teal)' : 'rgba(255,255,255,0.86)',
                      borderColor: active ? 'rgba(13, 148, 136, 0.6)' : 'rgba(226, 232, 240, 0.9)',
                      color: active ? 'white' : 'inherit',
                    }}
                  >
                    <div className="card-body p-3">
                      <div className="d-flex align-items-start justify-content-between gap-2">
                        <div className="me-2">
                          <div className="fw-bold small">{pharmacy.name}</div>
                          <div className="small opacity-75 d-flex align-items-center gap-1 mt-1">
                            <MapPin size={14} />
                            <span>{pharmacy.address}</span>
                          </div>
                        </div>
                        <div className="text-end">
                          <StatusBadge open={pharmacy.open} />
                          <div className="small opacity-75 mt-1">{pharmacy.distance} Km</div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="d-flex align-items-center gap-1 small">
                          <Star size={14} className={active ? 'text-warning' : 'text-warning'} fill="currentColor" />
                          <span className="fw-semibold">{pharmacy.rating}</span>
                          <span className="opacity-75">({pharmacy.reviews})</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); navigate(`/pharmacy/${pharmacy.id}`); }}
                          className={`btn btn-sm ${active ? 'btn-light' : 'btn-outline-success'}`}
                          style={!active ? { borderColor: 'rgba(13, 148, 136, 0.35)', color: 'var(--teal)' } : undefined}
                        >
                          Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div className="col position-relative h-100 ph-mapcol">
          <MapContainer
            center={userPos}
            zoom={14}
            className="w-100 h-100"
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {flyTo && <FlyTo position={flyTo} />}

          {/* User location */}
          <Marker position={userPos} icon={userIcon}>
            <Popup>
              <div className="text-center p-1">
                <p className="fw-bold mb-0" style={{ color: 'var(--teal)' }}>📍 You are here</p>
              </div>
            </Popup>
          </Marker>
          <Circle
            center={userPos}
            radius={300}
            pathOptions={{ color: '#0d9488', fillColor: '#0d9488', fillOpacity: 0.08, weight: 1.5 }}
          />

          {/* Pharmacy markers */}
          {filtered.map(pharmacy => (
            <Marker key={pharmacy.id} position={[pharmacy.lat, pharmacy.lng]} icon={pharmacyIcon}>
              <Popup>
                <div className="p-2" style={{ minWidth: 220 }}>
                  <div className="d-flex align-items-center justify-content-between mb-2 gap-2">
                    <h3 className="h6 fw-bold mb-0">{pharmacy.name}</h3>
                    <StatusBadge open={pharmacy.open} />
                  </div>
                  <p className="small text-secondary mb-2">{pharmacy.address}</p>
                  <p className="small text-secondary d-flex align-items-center gap-1 mb-3">
                    <Clock size={14} /> {pharmacy.hours}
                  </p>
                  <button
                    onClick={() => navigate(`/pharmacy/${pharmacy.id}`)}
                    className="btn btn-sm w-100 text-white"
                    style={{ backgroundColor: 'var(--teal)', borderColor: 'var(--teal)' }}
                  >
                    View Details & Upload Rx
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating location button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setFlyTo([...userPos])}
          className="btn glass rounded-4 border position-absolute d-flex align-items-center justify-content-center"
          style={{ width: 48, height: 48, right: 16, bottom: 16 }}
        >
          <Navigation size={18} style={{ color: 'var(--teal)' }} />
        </motion.button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
