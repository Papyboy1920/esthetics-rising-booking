// ============================================================
// Esthetics Rising — South Dade Technical College
// Semilla: menú de servicios (lista de Ju, 11/6/2026) + ajustes
// de agenda. La fusión es aditiva: lo que Ju edite en /store
// nunca se sobrescribe (ver mergeCatalog en db.js).
// ============================================================

const CATALOG_VERSION = 2;

const SEED_CATALOG = {
  departments: [
    {
      id: "facials", name: "Facials", nameEs: "Faciales", img: "", categories: [
        { id: "facials-main", name: "Facials", items: [
          { id: "facial", name: "Facial", nameEs: "Tratamiento facial", price: 15, unit: "service", desc: "", img: "", active: true },
          { id: "machine-addon", name: "Machine Add-On · Microdermabrasion / High Frequency", nameEs: "Adicional de máquina · Microdermoabrasión / Alta frecuencia", price: 5, unit: "add-on", desc: "Add to any facial", img: "", active: true }
        ] }
      ]
    },
    {
      id: "waxing", name: "Waxing", nameEs: "Depilación con cera", img: "", categories: [
        { id: "waxing-main", name: "Waxing", items: [
          { id: "wax-sideburns", name: "Sideburns", nameEs: "Patillas", price: 10, unit: "service", desc: "", img: "", active: true },
          { id: "wax-lip", name: "Lip", nameEs: "Labio superior", price: 5, unit: "service", desc: "", img: "", active: true },
          { id: "wax-eyebrows", name: "Eyebrows", nameEs: "Cejas", price: 10, unit: "service", desc: "", img: "", active: true },
          { id: "wax-legs", name: "Legs", nameEs: "Piernas", price: 15, unit: "service", desc: "", img: "", active: true },
          { id: "wax-arms", name: "Arms", nameEs: "Brazos", price: 15, unit: "service", desc: "", img: "", active: true },
          { id: "wax-thighs", name: "Thighs", nameEs: "Muslos", price: 15, unit: "service", desc: "", img: "", active: true }
        ] }
      ]
    },
    {
      id: "lashes", name: "Lashes", nameEs: "Pestañas", img: "", categories: [
        { id: "lashes-main", name: "Lashes", items: [
          { id: "strip-lashes", name: "Strip Lashes", nameEs: "Pestañas en tira", price: 10, unit: "service", desc: "", img: "", active: true },
          { id: "cluster-lashes", name: "Cluster Lashes", nameEs: "Pestañas en racimo", price: 20, unit: "service", desc: "", img: "", active: true },
          { id: "ext-classic", name: "Lash Extensions — Classic", nameEs: "Extensiones de pestañas — Clásicas", price: 60, unit: "service", desc: "", img: "", active: true },
          { id: "ext-hybrid", name: "Lash Extensions — Hybrid", nameEs: "Extensiones de pestañas — Híbridas", price: 75, unit: "service", desc: "", img: "", active: true },
          { id: "ext-volume", name: "Lash Extensions — Volume", nameEs: "Extensiones de pestañas — Volumen", price: 90, unit: "service", desc: "", img: "", active: true }
        ] }
      ]
    },
    {
      id: "lash-brow", name: "Lash & Brow", nameEs: "Pestañas y cejas", img: "", categories: [
        { id: "lash-brow-main", name: "Lash & Brow", items: [
          { id: "lash-lift", name: "Lash Lift", nameEs: "Levantamiento de pestañas", price: 15, unit: "service", desc: "", img: "", active: true },
          { id: "lash-lift-tint", name: "Lash Lift + Tint", nameEs: "Levantamiento de pestañas + tinte", price: 20, unit: "service", desc: "", img: "", active: true },
          { id: "brow-lamination", name: "Brow Lamination", nameEs: "Laminado de cejas", price: 15, unit: "service", desc: "", img: "", active: true },
          { id: "brow-mapping-tint", name: "Brow Mapping & Tint (add-on)", nameEs: "Diseño y tinte de cejas (adicional)", price: 10, unit: "add-on", desc: "Add to brow lamination", img: "", active: true },
          { id: "combo-rising", name: "Combo — Lift & Tint + Lamination, Mapping & Tint", nameEs: "Combo — Levantamiento y tinte + laminado, diseño y tinte", price: 40, unit: "service", desc: "", img: "", active: true }
        ] }
      ]
    },
    {
      id: "makeup", name: "Luxury Makeup", nameEs: "Maquillaje de lujo", img: "", categories: [
        { id: "makeup-main", name: "Luxury Makeup", items: [
          { id: "makeup-day", name: "Day Makeup", nameEs: "Maquillaje de día", price: 30, unit: "service", desc: "", img: "", active: true },
          { id: "makeup-night", name: "Night Makeup", nameEs: "Maquillaje de noche", price: 40, unit: "service", desc: "", img: "", active: true }
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
