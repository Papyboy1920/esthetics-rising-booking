// ============================================================
// Esthetics Rising — South Dade Technical College
// Semilla: menú de servicios (lista de Ju, 11/6/2026) + ajustes
// de agenda. La fusión es aditiva: lo que Ju edite en /store
// nunca se sobrescribe (ver mergeCatalog en db.js).
// ============================================================

const CATALOG_VERSION = 1;

const SEED_CATALOG = {
  departments: [
    {
      id: "facials", name: "Facials", img: "", categories: [
        { id: "facials-main", name: "Facials", items: [
          { id: "facial", name: "Facial", price: 15, unit: "service", desc: "", img: "", active: true },
          { id: "machine-addon", name: "Machine Add-On · Microdermabrasion / High Frequency", price: 5, unit: "add-on", desc: "Add to any facial", img: "", active: true }
        ] }
      ]
    },
    {
      id: "waxing", name: "Waxing", img: "", categories: [
        { id: "waxing-main", name: "Waxing", items: [
          { id: "wax-sideburns", name: "Sideburns", price: 10, unit: "service", desc: "", img: "", active: true },
          { id: "wax-lip", name: "Lip", price: 5, unit: "service", desc: "", img: "", active: true },
          { id: "wax-eyebrows", name: "Eyebrows", price: 10, unit: "service", desc: "", img: "", active: true },
          { id: "wax-legs", name: "Legs", price: 15, unit: "service", desc: "", img: "", active: true },
          { id: "wax-arms", name: "Arms", price: 15, unit: "service", desc: "", img: "", active: true },
          { id: "wax-thighs", name: "Thighs", price: 15, unit: "service", desc: "", img: "", active: true }
        ] }
      ]
    },
    {
      id: "lashes", name: "Lashes", img: "", categories: [
        { id: "lashes-main", name: "Lashes", items: [
          { id: "strip-lashes", name: "Strip Lashes", price: 10, unit: "service", desc: "", img: "", active: true },
          { id: "cluster-lashes", name: "Cluster Lashes", price: 20, unit: "service", desc: "", img: "", active: true },
          { id: "ext-classic", name: "Lash Extensions — Classic", price: 60, unit: "service", desc: "", img: "", active: true },
          { id: "ext-hybrid", name: "Lash Extensions — Hybrid", price: 75, unit: "service", desc: "", img: "", active: true },
          { id: "ext-volume", name: "Lash Extensions — Volume", price: 90, unit: "service", desc: "", img: "", active: true }
        ] }
      ]
    },
    {
      id: "lash-brow", name: "Lash & Brow", img: "", categories: [
        { id: "lash-brow-main", name: "Lash & Brow", items: [
          { id: "lash-lift", name: "Lash Lift", price: 15, unit: "service", desc: "", img: "", active: true },
          { id: "lash-lift-tint", name: "Lash Lift + Tint", price: 20, unit: "service", desc: "", img: "", active: true },
          { id: "brow-lamination", name: "Brow Lamination", price: 15, unit: "service", desc: "", img: "", active: true },
          { id: "brow-mapping-tint", name: "Brow Mapping & Tint (add-on)", price: 10, unit: "add-on", desc: "Add to brow lamination", img: "", active: true },
          { id: "combo-rising", name: "Combo — Lift & Tint + Lamination, Mapping & Tint", price: 40, unit: "service", desc: "", img: "", active: true }
        ] }
      ]
    },
    {
      id: "makeup", name: "Luxury Makeup", img: "", categories: [
        { id: "makeup-main", name: "Luxury Makeup", items: [
          { id: "makeup-day", name: "Day Makeup", price: 30, unit: "service", desc: "", img: "", active: true },
          { id: "makeup-night", name: "Night Makeup", price: 40, unit: "service", desc: "", img: "", active: true }
        ] }
      ]
    }
  ]
};

// Ajustes de agenda editables en /store:
// openDays: 0=domingo ... 6=sábado. capacity: cupos por horario.
const SEED_SETTINGS = {
  openDays: [1, 2, 3, 4, 5],
  slots: ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"],
  capacity: 3
};

module.exports = { SEED_CATALOG, CATALOG_VERSION, SEED_SETTINGS };
