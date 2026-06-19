<<<<<<< Updated upstream
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
=======
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
>>>>>>> Stashed changes

const MOCK_GRADES = [
  { id: 1, nombre: 'Ana García',      nota1: 6.5, nota2: 5.8, nota3: 6.2, promedio: 6.2 },
  { id: 2, nombre: 'Carlos Pérez',    nota1: 4.5, nota2: 5.0, nota3: 4.8, promedio: 4.8 },
  { id: 3, nombre: 'Valentina López', nota1: 7.0, nota2: 6.8, nota3: 6.9, promedio: 6.9 },
  { id: 4, nombre: 'Diego Martínez',  nota1: 3.9, nota2: 4.2, nota3: 4.0, promedio: 4.0 },
  { id: 5, nombre: 'Sofía Rojas',     nota1: 5.5, nota2: 6.0, nota3: 5.8, promedio: 5.8 },
]

<<<<<<< Updated upstream
function colorNota(n) {
  if (n >= 6.0) return 'text-green-400'
  if (n >= 4.0) return 'text-yellow-400'
  return 'text-red-400'
}

export default function GradesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        <h1 className="text-xl font-bold mb-6">Calificaciones — 1°A</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="text-left px-5 py-3">Estudiante</th>
                <th className="text-center px-5 py-3">Nota 1</th>
                <th className="text-center px-5 py-3">Nota 2</th>
                <th className="text-center px-5 py-3">Nota 3</th>
                <th className="text-center px-5 py-3">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_GRADES.map(s => (
                <tr key={s.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3">{s.nombre}</td>
                  <td className={`px-5 py-3 text-center ${colorNota(s.nota1)}`}>{s.nota1}</td>
                  <td className={`px-5 py-3 text-center ${colorNota(s.nota2)}`}>{s.nota2}</td>
                  <td className={`px-5 py-3 text-center ${colorNota(s.nota3)}`}>{s.nota3}</td>
                  <td className={`px-5 py-3 text-center font-semibold ${colorNota(s.promedio)}`}>{s.promedio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  )
=======
const ASIGNATURAS = ["Biología", "Matemática", "Lenguaje", "Historia", "Inglés"];

const CURSOS = [
  "1° Medio A", "1° Medio B",
  "2° Medio A", "2° Medio B",
  "3° Medio A", "3° Medio B",
  "4° Medio A", "4° Medio B",
];

const PERIODOS = ["Primer Semestre", "Segundo Semestre"];

const TIPOS_EVAL = ["Prueba", "Trabajo", "Disertación", "Laboratorio", "Tarea", "Otro"];

const ESTUDIANTES = {
  "1° Medio A": [
    "Aguirre Soto Martín Ignacio", "Bahamondes Reyes Camila Sofía", "Cárcamo Vergara Joaquín Andrés",
    "Donoso Pizarro Florencia Antonia", "Espinoza Ramírez Benjamín Tomás", "Fuentealba Morales Isidora Belén",
    "Gajardo Tapia Matías Esteban", "Henríquez Cortés Valentina Paz", "Inostroza Bravo Sebastián Andrés",
    "Jara Contreras Constanza Javiera"
  ],
  "1° Medio B": [
    "Lagos Fernández Diego Alejandro", "Maldonado Rojas Antonia Fernanda", "Navarro Castillo Tomás Ignacio",
    "Olivares Sepúlveda Camila Andrea", "Pinto Gallardo Maximiliano José", "Quezada Muñoz Fernanda Isidora",
    "Reyes Sandoval Vicente Andrés", "Saavedra Toro Javiera Belén", "Tapia Riquelme Cristóbal Eduardo",
    "Urrutia Vásquez Martina Sofía"
  ],
  "2° Medio A": [
    "Alarcón Beltrán Felipe Andrés", "Bustos Carvajal Daniela Paz", "Contreras Lara Agustín Nicolás",
    "Díaz Cáceres Florencia Isabel", "Escobar Pino Lucas Benjamín", "Flores Vega Catalina Antonia",
    "González Araya Bastián Ignacio", "Herrera Soto Valeria Constanza", "Ibarra Muñoz Joaquín Esteban",
    "Jiménez Rivas Antonella Fernanda"
  ],
  "2° Medio B": [
    "Lara Quiroz Matías Alonso", "Mella Figueroa Josefa Belén", "Núñez Ortiz Sebastián Tomás",
    "Ortega Salazar Camila Constanza", "Pérez Aguilar Vicente Maximiliano", "Ramos Bahamonde Isidora Antonia",
    "Sepúlveda Lagos Cristóbal Andrés", "Toledo Méndez Florencia Paz", "Valdés Soto Benjamín Andrés",
    "Zúñiga Pacheco Valentina Sofía"
  ],
  "3° Medio A": [
    "Alcayaga Alcayaga Álvaro Andrés", "Álvarez Fernández Maicol Exequiel", "Campillay Bordones Claudio Alejandro",
    "Campillay Flores Tais Ariana", "Campillay Olmos Jayson Maykol", "Carmona Campillay Walter Bastián",
    "Fritis Muñoz Katryna Estefanía", "Garvizo Santibáñez Fernanda Alejandra", "Henríquez Bordones Ignacio Maximiliano",
    "Iturra Campillay Renata Belén"
  ],
  "3° Medio B": [
    "Bravo Sánchez Constanza Belén", "Cortés Vidal Maximiliano Andrés", "Espinoza Tapia Fernanda Javiera",
    "Lobos Araya Ignacio Tomás", "Muñoz Cárdenas Valentina Paz", "Reyes Bustos Joaquín Esteban",
    "Salinas Pizarro Camila Antonia", "Torres Lagos Benjamín Andrés", "Vergara Olmos Isidora Fernanda",
    "Yáñez Carrasco Martín Alonso"
  ],
  "4° Medio A": [
    "Araya Fuenzalida Tomás Vicente", "Bórquez Lillo Antonia Valentina", "Cisternas Pino Joaquín Andrés",
    "Duarte Sandoval Florencia Camila", "Estay Morales Lucas Benjamín", "Fernández Gallardo Catalina Sofía",
    "Guerrero Ríos Bastián Maximiliano", "Hidalgo Vergara Javiera Constanza", "Inzunza Toledo Cristóbal Ignacio",
    "Leiva Bahamondes Antonella Belén"
  ],
  "4° Medio B": [
    "Mancilla Quezada Sebastián Andrés", "Navarrete Rojas Valentina Antonia", "Ojeda Carvajal Matías Esteban",
    "Parra Espinoza Isidora Fernanda", "Quiroz Tapia Benjamín Tomás", "Rivas Contreras Camila Paz",
    "Soto Aguirre Agustín Nicolás", "Tapia Bustos Florencia Andrea", "Vásquez Lagos Vicente Maximiliano",
    "Zamora Pizarro Martina Josefa"
  ]
};

function seedEvals() {
  return [
    { id: "e1", nombre: "Prueba N°1", tipo: "Prueba", fecha: "2026-03-20", descripcion: "Unidad 1", orden: 1 },
    { id: "e2", nombre: "Trabajo grupal", tipo: "Trabajo", fecha: "2026-04-10", descripcion: "Exposición unidad 2", orden: 2 }
  ];
}

function seedScores(curso) {
  const scores = {};
  ESTUDIANTES[curso].forEach((_, i) => {
    scores[i] = {
      e1: +(4 + Math.random() * 3).toFixed(1),
      e2: +(4 + Math.random() * 3).toFixed(1)
    };
  });
  return scores;
}

function makeKey(a, c, p) {
  return `${a}__${c}__${p}`;
}

function initialData() {
  const data = {};
  ASIGNATURAS.forEach(a => {
    CURSOS.forEach(c => {
      PERIODOS.forEach(p => {
        data[makeKey(a, c, p)] = {
          evaluations: seedEvals(),
          scores: seedScores(c)
        };
      });
    });
  });
  return data;
}

/* ---------- notas ---------- */

function clampNota(v) {
  if (v === "" || v === null || v === undefined) return "";
  let n = parseFloat(String(v).replace(",", "."));
  if (isNaN(n)) return "";
  if (n < 1) n = 1;
  if (n > 7) n = 7;
  return Math.round(n * 10) / 10;
}

function notaColor(n) {
  if (n === "" || n === undefined) return "#9499a6";
  if (n < 4) return "#c4283c";
  if (n < 5.5) return "#b8791a";
  return "#1f8a4c";
}

function notaBg(n) {
  if (n === "" || n === undefined) return "#f1f1f4";
  if (n < 4) return "#fbe4e6";
  if (n < 5.5) return "#fbecd6";
  return "#e3f5e9";
}

function promedio(scores, idx, evaluations) {
  const vals = evaluations
    .map(e => scores[idx]?.[e.id])
    .filter(v => v !== "" && v !== undefined);
  if (!vals.length) return "";
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

/* ---------- componente ---------- */

export default function LibroCalificaciones() {
  const [data, setData] = useState(initialData);
  const [asignatura, setAsignatura] = useState(ASIGNATURAS[0]);
  const [curso, setCurso] = useState(CURSOS[0]);
  const [periodo, setPeriodo] = useState(PERIODOS[0]);
  const [vista, setVista] = useState("asignatura");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // { studentIdx, evalId }
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);
  const [nuevaEval, setNuevaEval] = useState({
    nombre: "", tipo: TIPOS_EVAL[0], fecha: "", descripcion: ""
  });

  const key = makeKey(asignatura, curso, periodo);
  const current = data[key];
  const estudiantes = ESTUDIANTES[curso];

  function commitScore(i, e, value) {
    const v = clampNota(value);
    setData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        scores: {
          ...prev[key].scores,
          [i]: { ...prev[key].scores[i], [e]: v }
        }
      }
    }));
    setEditing(null);
  }

  function flashSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function addEvaluation() {
    if (!nuevaEval.nombre.trim()) return;
    const id = "e" + (Date.now() % 100000);
    setData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        evaluations: [
          ...prev[key].evaluations,
          { id, orden: prev[key].evaluations.length + 1, ...nuevaEval }
        ]
      }
    }));
    setNuevaEval({ nombre: "", tipo: TIPOS_EVAL[0], fecha: "", descripcion: "" });
    setModalOpen(false);
  }

  /* ---------- estilos ---------- */

  const card = {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e7e5f0",
    boxShadow: "0 2px 8px rgba(0,0,0,.05)"
  };

  const selectStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: "#fafafa",
    fontSize: 14
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 700,
    color: "#777",
    marginBottom: 5,
    display: "block"
  };

  const thStyle = {
    textAlign: "left",
    padding: "10px 12px",
    fontSize: 12,
    fontWeight: 700,
    color: "#6a6580",
    borderBottom: "2px solid #ece9f9",
    background: "#fafafe",
    whiteSpace: "nowrap"
  };

  const tdStyle = {
    padding: "8px 12px",
    borderBottom: "1px solid #f0eff6",
    fontSize: 14
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f5fb",
        fontFamily: "'Inter','Segoe UI',sans-serif",
        display: "flex"
      }}
    >
      <Navbar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <main style={{ flex: 1, padding: 16 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>

          {/* header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
              flexWrap: "wrap",
              gap: 10
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#5b3df0", letterSpacing: 0.5 }}>
                LIBRO DE CLASES
              </div>
              <h1 style={{ margin: 0, fontSize: 25, color: "#221c3a" }}>
                Calificaciones
              </h1>
            </div>

            <div style={{ background: "#ece9f9", padding: 4, borderRadius: 12 }}>
              <button
                onClick={() => setVista("asignatura")}
                style={{
                  padding: "8px 15px",
                  border: 0,
                  borderRadius: 9,
                  cursor: "pointer",
                  fontWeight: 600,
                  background: vista === "asignatura" ? "white" : "transparent",
                  boxShadow: vista === "asignatura" ? "0 1px 3px rgba(0,0,0,.1)" : "none"
                }}
              >
                Por asignatura
              </button>
              <button
                onClick={() => setVista("resumen")}
                style={{
                  padding: "8px 15px",
                  border: 0,
                  borderRadius: 9,
                  cursor: "pointer",
                  fontWeight: 600,
                  background: vista === "resumen" ? "white" : "transparent",
                  boxShadow: vista === "resumen" ? "0 1px 3px rgba(0,0,0,.1)" : "none"
                }}
              >
                Resumen
              </button>
            </div>
          </div>

          {/* filtros */}
          <div
            style={{
              ...card,
              padding: 14,
              marginBottom: 14,
              display: "grid",
              gridTemplateColumns: vista === "asignatura" ? "repeat(3,1fr)" : "repeat(2,1fr)",
              gap: 12
            }}
          >
            {vista === "asignatura" && (
              <div>
                <label style={labelStyle}>Asignatura</label>
                <select style={selectStyle} value={asignatura} onChange={e => setAsignatura(e.target.value)}>
                  {ASIGNATURAS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
            )}

            <div>
              <label style={labelStyle}>Curso</label>
              <select style={selectStyle} value={curso} onChange={e => setCurso(e.target.value)}>
                {CURSOS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Periodo</label>
              <select style={selectStyle} value={periodo} onChange={e => setPeriodo(e.target.value)}>
                {PERIODOS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* vista por asignatura */}
          {vista === "asignatura" && (
            <div style={{ ...card, overflow: "hidden" }}>
              <div
                style={{
                  padding: "14px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #f0eff6",
                  flexWrap: "wrap",
                  gap: 10
                }}
              >
                <div>
                  <h3 style={{ margin: 0, color: "#221c3a" }}>{asignatura}</h3>
                  <div style={{ fontSize: 12, color: "#8b87a0" }}>{curso} · {periodo}</div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {saved && (
                    <span style={{ fontSize: 12, color: "#1f8a4c", fontWeight: 700 }}>
                      ✓ Guardado
                    </span>
                  )}
                  <button
                    onClick={() => setModalOpen(true)}
                    style={{
                      background: "#fff",
                      color: "#5b3df0",
                      border: "1px solid #d8d2f7",
                      borderRadius: 10,
                      padding: "9px 14px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    + Evaluación
                  </button>
                  <button
                    onClick={flashSaved}
                    style={{
                      background: "#5b3df0",
                      color: "white",
                      border: 0,
                      borderRadius: 10,
                      padding: "9px 16px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: 40 }}>N°</th>
                      <th style={thStyle}>Estudiante</th>
                      {current.evaluations.map(e => (
                        <th key={e.id} style={{ ...thStyle, textAlign: "center" }}>{e.nombre}</th>
                      ))}
                      <th style={{ ...thStyle, textAlign: "center" }}>Prom.</th>
                    </tr>
                  </thead>

                  <tbody>
                    {estudiantes.map((n, i) => {
                      const prom = promedio(current.scores, i, current.evaluations);
                      return (
                        <tr key={i} style={{ background: i % 2 ? "#fbfaff" : "white" }}>
                          <td style={tdStyle}>{i + 1}</td>
                          <td style={tdStyle}>{n}</td>

                          {current.evaluations.map(e => {
                            const nota = current.scores[i]?.[e.id];
                            const isEditing = editing?.studentIdx === i && editing?.evalId === e.id;

                            return (
                              <td key={e.id} style={{ ...tdStyle, textAlign: "center" }}>
                                {isEditing ? (
                                  <input
                                    autoFocus
                                    value={draft}
                                    onChange={ev => setDraft(ev.target.value)}
                                    onBlur={() => commitScore(i, e.id, draft)}
                                    onKeyDown={ev => {
                                      if (ev.key === "Enter") commitScore(i, e.id, draft);
                                      if (ev.key === "Escape") setEditing(null);
                                    }}
                                    style={{
                                      width: 50,
                                      textAlign: "center",
                                      padding: 6,
                                      borderRadius: 8,
                                      border: "1px solid #5b3df0",
                                      outline: "none",
                                      fontSize: 14
                                    }}
                                  />
                                ) : (
                                  <button
                                    onClick={() => {
                                      setEditing({ studentIdx: i, evalId: e.id });
                                      setDraft(nota ?? "");
                                    }}
                                    style={{
                                      background: notaBg(nota),
                                      color: notaColor(nota),
                                      border: 0,
                                      borderRadius: 8,
                                      padding: "7px 12px",
                                      fontWeight: 700,
                                      cursor: "pointer",
                                      minWidth: 44
                                    }}
                                  >
                                    {nota ?? "—"}
                                  </button>
                                )}
                              </td>
                            );
                          })}

                          <td style={{ ...tdStyle, textAlign: "center", fontWeight: 800, color: notaColor(prom) }}>
                            {prom || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* vista resumen: todas las asignaturas para el curso/periodo elegido */}
          {vista === "resumen" && (
            <div style={{ ...card, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #f0eff6" }}>
                <h3 style={{ margin: 0, color: "#221c3a" }}>Resumen — {curso}</h3>
                <div style={{ fontSize: 12, color: "#8b87a0" }}>{periodo}</div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: 40 }}>N°</th>
                      <th style={thStyle}>Estudiante</th>
                      {ASIGNATURAS.map(a => (
                        <th key={a} style={{ ...thStyle, textAlign: "center" }}>{a}</th>
                      ))}
                      <th style={{ ...thStyle, textAlign: "center" }}>Prom. general</th>
                    </tr>
                  </thead>

                  <tbody>
                    {estudiantes.map((n, i) => {
                      const proms = ASIGNATURAS.map(a => {
                        const d = data[makeKey(a, curso, periodo)];
                        return promedio(d.scores, i, d.evaluations);
                      });
                      const validProms = proms.filter(p => p !== "");
                      const general = validProms.length
                        ? Math.round((validProms.reduce((x, y) => x + y, 0) / validProms.length) * 10) / 10
                        : "";

                      return (
                        <tr key={i} style={{ background: i % 2 ? "#fbfaff" : "white" }}>
                          <td style={tdStyle}>{i + 1}</td>
                          <td style={tdStyle}>{n}</td>
                          {proms.map((p, idx) => (
                            <td
                              key={idx}
                              style={{ ...tdStyle, textAlign: "center", fontWeight: 700, color: notaColor(p) }}
                            >
                              {p || "—"}
                            </td>
                          ))}
                          <td style={{ ...tdStyle, textAlign: "center", fontWeight: 800, color: notaColor(general) }}>
                            {general || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* modal: agregar evaluación */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(20,15,40,.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 16,
              padding: 22,
              width: 380,
              boxShadow: "0 10px 40px rgba(0,0,0,.2)"
            }}
          >
            <h3 style={{ margin: "0 0 14px", color: "#221c3a" }}>Nueva evaluación</h3>

            <label style={labelStyle}>Nombre</label>
            <input
              style={{ ...selectStyle, marginBottom: 12 }}
              value={nuevaEval.nombre}
              onChange={e => setNuevaEval({ ...nuevaEval, nombre: e.target.value })}
              placeholder="Ej: Prueba N°3"
            />

            <label style={labelStyle}>Tipo</label>
            <select
              style={{ ...selectStyle, marginBottom: 12 }}
              value={nuevaEval.tipo}
              onChange={e => setNuevaEval({ ...nuevaEval, tipo: e.target.value })}
            >
              {TIPOS_EVAL.map(t => <option key={t}>{t}</option>)}
            </select>

            <label style={labelStyle}>Fecha</label>
            <input
              type="date"
              style={{ ...selectStyle, marginBottom: 12 }}
              value={nuevaEval.fecha}
              onChange={e => setNuevaEval({ ...nuevaEval, fecha: e.target.value })}
            />

            <label style={labelStyle}>Descripción</label>
            <input
              style={{ ...selectStyle, marginBottom: 18 }}
              value={nuevaEval.descripcion}
              onChange={e => setNuevaEval({ ...nuevaEval, descripcion: e.target.value })}
              placeholder="Opcional"
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  padding: "9px 16px",
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
              <button
                onClick={addEvaluation}
                style={{
                  background: "#5b3df0",
                  color: "white",
                  border: 0,
                  borderRadius: 10,
                  padding: "9px 16px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      </div>
    </div>
  );
>>>>>>> Stashed changes
}