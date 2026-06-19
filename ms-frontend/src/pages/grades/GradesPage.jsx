import { useState, useMemo } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

/* ---------- datos base ---------- */

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
    "Aguirre Soto Martín Ignacio",
    "Bahamondes Reyes Camila Sofía",
    "Cárcamo Vergara Joaquín Andrés",
    "Donoso Pizarro Florencia Antonia",
    "Espinoza Ramírez Benjamín Tomás",
    "Fuentealba Morales Isidora Belén",
    "Gajardo Tapia Matías Esteban",
    "Henríquez Cortés Valentina Paz",
    "Inostroza Bravo Sebastián Andrés",
    "Jara Contreras Constanza Javiera",
  ],
  "1° Medio B": [
    "Lagos Fernández Diego Alejandro",
    "Maldonado Rojas Antonia Fernanda",
    "Navarro Castillo Tomás Ignacio",
    "Olivares Sepúlveda Camila Andrea",
    "Pinto Gallardo Maximiliano José",
    "Quezada Muñoz Fernanda Isidora",
    "Reyes Sandoval Vicente Andrés",
    "Saavedra Toro Javiera Belén",
    "Tapia Riquelme Cristóbal Eduardo",
    "Urrutia Vásquez Martina Sofía",
  ],
  "2° Medio A": [
    "Alarcón Beltrán Felipe Andrés",
    "Bustos Carvajal Daniela Paz",
    "Contreras Lara Agustín Nicolás",
    "Díaz Cáceres Florencia Isabel",
    "Escobar Pino Lucas Benjamín",
    "Flores Vega Catalina Antonia",
    "González Araya Bastián Ignacio",
    "Herrera Soto Valeria Constanza",
    "Ibarra Muñoz Joaquín Esteban",
    "Jiménez Rivas Antonella Fernanda",
  ],
  "2° Medio B": [
    "Lara Quiroz Matías Alonso",
    "Mella Figueroa Josefa Belén",
    "Núñez Ortiz Sebastián Tomás",
    "Ortega Salazar Camila Constanza",
    "Pérez Aguilar Vicente Maximiliano",
    "Ramos Bahamonde Isidora Antonia",
    "Sepúlveda Lagos Cristóbal Andrés",
    "Toledo Méndez Florencia Paz",
    "Valdés Soto Benjamín Andrés",
    "Zúñiga Pacheco Valentina Sofía",
  ],
  "3° Medio A": [
    "Alcayaga Alcayaga Álvaro Andrés",
    "Álvarez Fernández Maicol Exequiel",
    "Campillay Bordones Claudio Alejandro",
    "Campillay Flores Tais Ariana",
    "Campillay Olmos Jayson Maykol",
    "Carmona Campillay Walter Bastián",
    "Fritis Muñoz Katryna Estefanía",
    "Garvizo Santibáñez Fernanda Alejandra",
    "Henríquez Bordones Ignacio Maximiliano",
    "Iturra Campillay Renata Belén",
  ],
  "3° Medio B": [
    "Bravo Sánchez Constanza Belén",
    "Cortés Vidal Maximiliano Andrés",
    "Espinoza Tapia Fernanda Javiera",
    "Lobos Araya Ignacio Tomás",
    "Muñoz Cárdenas Valentina Paz",
    "Reyes Bustos Joaquín Esteban",
    "Salinas Pizarro Camila Antonia",
    "Torres Lagos Benjamín Andrés",
    "Vergara Olmos Isidora Fernanda",
    "Yáñez Carrasco Martín Alonso",
  ],
  "4° Medio A": [
    "Araya Fuenzalida Tomás Vicente",
    "Bórquez Lillo Antonia Valentina",
    "Cisternas Pino Joaquín Andrés",
    "Duarte Sandoval Florencia Camila",
    "Estay Morales Lucas Benjamín",
    "Fernández Gallardo Catalina Sofía",
    "Guerrero Ríos Bastián Maximiliano",
    "Hidalgo Vergara Javiera Constanza",
    "Inzunza Toledo Cristóbal Ignacio",
    "Leiva Bahamondes Antonella Belén",
  ],
  "4° Medio B": [
    "Mancilla Quezada Sebastián Andrés",
    "Navarrete Rojas Valentina Antonia",
    "Ojeda Carvajal Matías Esteban",
    "Parra Espinoza Isidora Fernanda",
    "Quiroz Tapia Benjamín Tomás",
    "Rivas Contreras Camila Paz",
    "Soto Aguirre Agustín Nicolás",
    "Tapia Bustos Florencia Andrea",
    "Vásquez Lagos Vicente Maximiliano",
    "Zamora Pizarro Martina Josefa",
  ],
};

function seedEvals() {
  return [
    { id: "e1", nombre: "Prueba N°1", tipo: "Prueba", fecha: "2026-03-20", descripcion: "Unidad 1", orden: 1 },
    { id: "e2", nombre: "Trabajo grupal", tipo: "Trabajo", fecha: "2026-04-10", descripcion: "Exposición unidad 2", orden: 2 },
  ];
}

function seedScores(curso) {
  const scores = {};
  ESTUDIANTES[curso].forEach((_, i) => {
    scores[i] = { e1: +(4 + Math.random() * 3).toFixed(1), e2: +(4 + Math.random() * 3).toFixed(1) };
  });
  return scores;
}

function makeKey(asignatura, curso, periodo) {
  return `${asignatura}__${curso}__${periodo}`;
}

function initialData() {
  const data = {};
  ASIGNATURAS.forEach((asig) => {
    CURSOS.forEach((curso) => {
      PERIODOS.forEach((per) => {
        data[makeKey(asig, curso, per)] = {
          evaluations: seedEvals(),
          scores: seedScores(curso),
        };
      });
    });
  });
  return data;
}

/* ---------- utilidades de notas ---------- */

function clampNota(v) {
  if (v === "" || v === null || v === undefined) return "";
  let n = parseFloat(String(v).replace(",", "."));
  if (isNaN(n)) return "";
  if (n < 1.0) n = 1.0;
  if (n > 7.0) n = 7.0;
  return Math.round(n * 10) / 10;
}

function notaColor(n) {
  if (n === "" || n === undefined || n === null) return "#b8bcc4";
  if (n < 4.0) return "#d64550";
  if (n < 5.5) return "#c98a1e";
  return "#2f9e5a";
}

function notaBg(n) {
  if (n === "" || n === undefined || n === null) return "transparent";
  if (n < 4.0) return "#fdecee";
  if (n < 5.5) return "#fdf3e2";
  return "#e9f7ee";
}

function promedio(scores, studentIdx, evaluations) {
  const vals = evaluations
    .map((ev) => scores[studentIdx]?.[ev.id])
    .filter((v) => v !== "" && v !== undefined && v !== null && !isNaN(v));
  if (vals.length === 0) return "";
  const avg = vals.reduce((a, b) => a + Number(b), 0) / vals.length;
  return Math.round(avg * 10) / 10;
}

/* ---------- componente principal ---------- */

export default function LibroCalificaciones() {
  const [data, setData] = useState(initialData);
  const [asignatura, setAsignatura] = useState(ASIGNATURAS[0]);
  const [curso, setCurso] = useState(CURSOS[0]);
  const [periodo, setPeriodo] = useState(PERIODOS[0]);
  const [vista, setVista] = useState("asignatura"); // 'asignatura' | 'resumen'
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // {studentIdx, evalId}
  const [draft, setDraft] = useState("");
  const [form, setForm] = useState({ nombre: "", tipo: TIPOS_EVAL[0], fecha: "", descripcion: "", orden: 1 });
  const [saved, setSaved] = useState(false);

  const key = makeKey(asignatura, curso, periodo);
  const current = data[key] || { evaluations: [], scores: {} };
  const estudiantes = ESTUDIANTES[curso];

  /* ----- acciones ----- */

  function commitScore(studentIdx, evalId, value) {
    const v = clampNota(value);
    setData((prev) => {
      const d = { ...prev };
      const block = { ...d[key] };
      const scores = { ...block.scores };
      scores[studentIdx] = { ...scores[studentIdx], [evalId]: v };
      block.scores = scores;
      d[key] = block;
      return d;
    });
    setEditing(null);
  }

  function openAddModal() {
    setForm({
      nombre: "",
      tipo: TIPOS_EVAL[0],
      fecha: "",
      descripcion: "",
      orden: current.evaluations.length + 1,
    });
    setModalOpen(true);
  }

  function saveEvaluation() {
    if (!form.nombre.trim()) return;
    const id = "e" + Date.now();
    setData((prev) => {
      const d = { ...prev };
      const block = { ...d[key] };
      block.evaluations = [...block.evaluations, { id, ...form, orden: Number(form.orden) || block.evaluations.length + 1 }]
        .sort((a, b) => a.orden - b.orden);
      d[key] = block;
      return d;
    });
    setModalOpen(false);
  }

  function flashSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  /* ----- resumen general (todas las asignaturas) ----- */

  const resumenGeneral = useMemo(() => {
    return estudiantes.map((nombre, idx) => {
      const porAsignatura = ASIGNATURAS.map((asig) => {
        const k = makeKey(asig, curso, periodo);
        const block = data[k] || { evaluations: [], scores: {} };
        return { asignatura: asig, promedio: promedio(block.scores, idx, block.evaluations) };
      });
      const validos = porAsignatura.map((p) => p.promedio).filter((v) => v !== "");
      const general = validos.length ? Math.round((validos.reduce((a, b) => a + b, 0) / validos.length) * 10) / 10 : "";
      return { nombre, idx, porAsignatura, general };
    });
  }, [data, curso, periodo, estudiantes]);

  /* ----- estilos compartidos ----- */

  const card = {
    background: "#ffffff",
    borderRadius: 16,
    border: "1px solid #e7e5f0",
    boxShadow: "0 1px 2px rgba(30,20,60,0.04)",
  };

  const selectStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #e0ddee",
    background: "#fbfaff",
    fontSize: 14,
    color: "#2b2640",
    outline: "none",
  };

  const labelStyle = { fontSize: 12, fontWeight: 600, color: "#7a7591", marginBottom: 6, display: "block", letterSpacing: 0.2 };

  return (
    <div style={{ minHeight: "100vh", background: "#f6f5fb", fontFamily: "'Inter', 'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, padding: "28px 18px", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* encabezado */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#7c5cff", letterSpacing: 1.2, textTransform: "uppercase" }}>Libro de clases</div>
            <h1 style={{ margin: "2px 0 0", fontSize: 24, fontWeight: 800, color: "#221c3a" }}>Calificaciones</h1>
          </div>
          <div style={{ display: "flex", gap: 6, background: "#ece9f9", padding: 4, borderRadius: 12 }}>
            {[
              { id: "asignatura", label: "Por asignatura" },
              { id: "resumen", label: "Resumen general" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setVista(t.id)}
                style={{
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 16px",
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 700,
                  background: vista === t.id ? "#ffffff" : "transparent",
                  color: vista === t.id ? "#5b3df0" : "#6c6688",
                  boxShadow: vista === t.id ? "0 1px 3px rgba(40,30,90,0.12)" : "none",
                  transition: "all .15s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* selectores */}
        <div style={{ ...card, padding: 18, marginBottom: 16, display: "grid", gridTemplateColumns: vista === "asignatura" ? "1fr 1fr 1fr" : "1fr 1fr", gap: 14 }}>
          {vista === "asignatura" && (
            <div>
              <label style={labelStyle}>Asignatura</label>
              <select style={selectStyle} value={asignatura} onChange={(e) => setAsignatura(e.target.value)}>
                {ASIGNATURAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label style={labelStyle}>Curso</label>
            <select style={selectStyle} value={curso} onChange={(e) => setCurso(e.target.value)}>
              {CURSOS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Periodo</label>
            <select style={selectStyle} value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
              {PERIODOS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {vista === "asignatura" ? (
          <AsignaturaView
            card={card}
            asignatura={asignatura}
            estudiantes={estudiantes}
            current={current}
            editing={editing}
            setEditing={setEditing}
            draft={draft}
            setDraft={setDraft}
            commitScore={commitScore}
            openAddModal={openAddModal}
            flashSaved={flashSaved}
            saved={saved}
          />
        ) : (
          <ResumenView card={card} resumen={resumenGeneral} curso={curso} periodo={periodo} />
        )}
      </div>
      </main>
      <Footer />

      {modalOpen && (
        <ModalAgregar
          form={form}
          setForm={setForm}
          onCancel={() => setModalOpen(false)}
          onSave={saveEvaluation}
        />
      )}
    </div>
  );
}

/* ---------- vista por asignatura ---------- */

function AsignaturaView({ card, asignatura, estudiantes, current, editing, setEditing, draft, setDraft, commitScore, openAddModal, flashSaved, saved }) {
  return (
    <div style={{ ...card, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: "1px solid #eeecf6" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#221c3a" }}>{asignatura}</div>
          <div style={{ fontSize: 12, color: "#8d87a3" }}>Escala de 1.0 a 7.0 · clic en una celda para editar</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {saved && <span style={{ fontSize: 12, color: "#2f9e5a", fontWeight: 700 }}>Guardado ✓</span>}
          <button
            onClick={() => { flashSaved(); }}
            style={{ border: "1px solid #e0ddee", background: "#fff", color: "#473f63", fontWeight: 700, fontSize: 13, padding: "9px 14px", borderRadius: 10, cursor: "pointer" }}
          >
            Guardar
          </button>
          <button
            onClick={openAddModal}
            style={{ border: "none", background: "#5b3df0", color: "#fff", fontWeight: 700, fontSize: 13, padding: "9px 16px", borderRadius: 10, cursor: "pointer", boxShadow: "0 2px 6px rgba(91,61,240,0.3)" }}
          >
            + Agregar evaluación
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: "#fafaff" }}>
              <th style={thStyle("left", 36)}>N°</th>
              <th style={thStyle("left", 220)}>Estudiante</th>
              {current.evaluations.map((ev) => (
                <th key={ev.id} style={thStyle("center", 90)}>
                  <div style={{ fontWeight: 800 }}>{ev.nombre}</div>
                  <div style={{ fontSize: 10.5, color: "#9d97b3", fontWeight: 500 }}>{ev.tipo}{ev.fecha ? ` · ${ev.fecha.slice(5)}` : ""}</div>
                </th>
              ))}
              <th style={thStyle("center", 90)}>Promedio</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((nombre, idx) => {
              const prom = promedio(current.scores, idx, current.evaluations);
              return (
                <tr key={idx} style={{ borderBottom: "1px solid #f1effa" }}>
                  <td style={tdStyle("left", "#a39dbb")}>{idx + 1}</td>
                  <td style={{ ...tdStyle("left", "#2b2640"), fontWeight: 600 }}>{nombre}</td>
                  {current.evaluations.map((ev) => {
                    const isEditing = editing && editing.studentIdx === idx && editing.evalId === ev.id;
                    const val = current.scores[idx]?.[ev.id];
                    return (
                      <td key={ev.id} style={{ padding: 4, textAlign: "center" }}>
                        {isEditing ? (
                          <input
                            autoFocus
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onBlur={() => commitScore(idx, ev.id, draft)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitScore(idx, ev.id, draft);
                              if (e.key === "Escape") setEditing(null);
                            }}
                            style={{
                              width: 56,
                              textAlign: "center",
                              padding: "6px 4px",
                              borderRadius: 8,
                              border: "1.5px solid #5b3df0",
                              outline: "none",
                              fontSize: 13.5,
                              fontWeight: 700,
                            }}
                          />
                        ) : (
                          <button
                            onClick={() => { setEditing({ studentIdx: idx, evalId: ev.id }); setDraft(val ?? ""); }}
                            style={{
                              width: 56,
                              padding: "6px 4px",
                              borderRadius: 8,
                              border: "1px solid transparent",
                              background: notaBg(val),
                              color: notaColor(val),
                              fontWeight: 700,
                              fontSize: 13.5,
                              cursor: "pointer",
                            }}
                          >
                            {val === undefined || val === "" ? "—" : val.toFixed(1)}
                          </button>
                        )}
                      </td>
                    );
                  })}
                  <td style={{ textAlign: "center" }}>
                    <span style={{ fontWeight: 800, color: notaColor(prom), fontSize: 14 }}>
                      {prom === "" ? "—" : prom.toFixed(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function thStyle(align, width) {
  return {
    textAlign: align,
    padding: "10px 12px",
    fontSize: 11.5,
    color: "#8d87a3",
    fontWeight: 700,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    minWidth: width,
    borderBottom: "1px solid #eeecf6",
  };
}
function tdStyle(align, color) {
  return { padding: "10px 12px", textAlign: align, color };
}

/* ---------- vista resumen general ---------- */

function ResumenView({ card, resumen, curso, periodo }) {
  return (
    <div style={{ ...card, overflow: "hidden" }}>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid #eeecf6" }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: "#221c3a" }}>{curso} · {periodo}</div>
        <div style={{ fontSize: 12, color: "#8d87a3" }}>Promedio de cada estudiante en todas las asignaturas</div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: "#fafaff" }}>
              <th style={thStyle("left", 36)}>N°</th>
              <th style={thStyle("left", 220)}>Estudiante</th>
              {ASIGNATURAS.map((a) => (
                <th key={a} style={thStyle("center", 90)}>{a}</th>
              ))}
              <th style={thStyle("center", 100)}>General</th>
            </tr>
          </thead>
          <tbody>
            {resumen.map((row) => (
              <tr key={row.idx} style={{ borderBottom: "1px solid #f1effa" }}>
                <td style={tdStyle("left", "#a39dbb")}>{row.idx + 1}</td>
                <td style={{ ...tdStyle("left", "#2b2640"), fontWeight: 600 }}>{row.nombre}</td>
                {row.porAsignatura.map((p) => (
                  <td key={p.asignatura} style={{ textAlign: "center" }}>
                    <span style={{
                      display: "inline-block", minWidth: 44, padding: "5px 8px", borderRadius: 8,
                      background: notaBg(p.promedio), color: notaColor(p.promedio), fontWeight: 700,
                    }}>
                      {p.promedio === "" ? "—" : p.promedio.toFixed(1)}
                    </span>
                  </td>
                ))}
                <td style={{ textAlign: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: 14.5, color: notaColor(row.general) }}>
                    {row.general === "" ? "—" : row.general.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: "12px 18px", fontSize: 12, color: "#8d87a3", borderTop: "1px solid #eeecf6" }}>
        Tip: cambia a la pestaña "Por asignatura" para editar o agregar notas; este resumen se actualiza solo.
      </div>
    </div>
  );
}

/* ---------- modal agregar evaluación ---------- */

function ModalAgregar({ form, setForm, onCancel, onSave }) {
  const inputStyle = {
    width: "100%",
    padding: "9px 11px",
    borderRadius: 9,
    border: "1px solid #e0ddee",
    fontSize: 13.5,
    outline: "none",
    boxSizing: "border-box",
    color: "#2b2640",
  };
  const label = { fontSize: 12, fontWeight: 700, color: "#6c6688", marginBottom: 5, display: "block" };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(20,15,40,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16,
    }}>
      <div style={{
        background: "#fff", borderRadius: 18, padding: 24, width: "100%", maxWidth: 420,
        boxShadow: "0 20px 50px rgba(20,15,40,0.25)",
      }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#221c3a" }}>Agregar evaluación</h2>
        <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "#8d87a3" }}>Se agregará como una nueva columna de notas.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={label}>Nombre</label>
            <input style={inputStyle} placeholder="Ej: Prueba N°3" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={label}>Tipo de evaluación</label>
              <select style={inputStyle} value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                {TIPOS_EVAL.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Fecha</label>
              <input type="date" style={inputStyle} value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={label}>Descripción</label>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 60 }} placeholder="Detalle u observaciones (opcional)" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          </div>
          <div>
            <label style={label}>Orden</label>
            <input type="number" min={1} style={inputStyle} value={form.orden} onChange={(e) => setForm({ ...form, orden: e.target.value })} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
          <button onClick={onCancel} style={{ border: "1px solid #e0ddee", background: "#fff", color: "#473f63", fontWeight: 700, fontSize: 13.5, padding: "10px 18px", borderRadius: 10, cursor: "pointer" }}>
            Cancelar
          </button>
          <button onClick={onSave} style={{ border: "none", background: "#5b3df0", color: "#fff", fontWeight: 700, fontSize: 13.5, padding: "10px 20px", borderRadius: 10, cursor: "pointer", boxShadow: "0 2px 6px rgba(91,61,240,0.3)" }}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}