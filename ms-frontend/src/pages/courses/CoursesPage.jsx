import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

// ============================================================
// MOCK DATA
// Esto simula lo que normalmente vendría de una base de datos.
// Cuando conectes el backend real, reemplaza estos arrays/objetos
// por llamadas a tu API.
// ============================================================

const NIVELES = ['1°', '2°', '3°', '4°']

const ASIGNATURAS = [
    'Lenguaje y Comunicación',
    'Matemática',
    'Historia, Geografía y Cs. Sociales',
    'Ciencias Naturales',
    'Inglés',
    'Educación Física',
    'Artes Visuales',
    'Música',
]

const PERIODOS = ['Primer Semestre', 'Segundo Semestre']

const SALAS_POR_ASIGNATURA = {
    'Lenguaje y Comunicación': 'Sala 12',
    'Matemática': 'Sala 5',
    'Historia, Geografía y Cs. Sociales': 'Sala 8',
    'Ciencias Naturales': 'Laboratorio 1',
    'Inglés': 'Sala 14',
    'Educación Física': 'Gimnasio',
    'Artes Visuales': 'Taller de Artes',
    'Música': 'Sala de Música',
}

const PROFESORES = [
    { id: 'p1', nombre: 'Nelson Muntz Sr.', asignaturas: ['Matemática'], email: 'nelson.muntz@colegio.cl' },
    { id: 'p2', nombre: 'Marge Simpson', asignaturas: ['Artes Visuales'], email: 'marge.simpson@colegio.cl' },
    { id: 'p3', nombre: 'Lisa Simpson', asignaturas: ['Música', 'Lenguaje y Comunicación'], email: 'lisa.simpson@colegio.cl' },
    { id: 'p4', nombre: 'Bart Simpson', asignaturas: ['Educación Física'], email: 'bart.simpson@colegio.cl' },
    { id: 'p5', nombre: 'Maggie Simpson', asignaturas: ['Ciencias Naturales'], email: 'maggie.simpson@colegio.cl' },
    { id: 'p6', nombre: 'Homer Simpson', asignaturas: ['Historia, Geografía y Cs. Sociales'], email: 'homer.simpson@colegio.cl' },
    { id: 'p7', nombre: 'Edna Krabappel', asignaturas: ['Lenguaje y Comunicación'], email: 'edna.krabappel@colegio.cl' },
    { id: 'p8', nombre: 'Seymour Skinner', asignaturas: ['Inglés', 'Historia, Geografía y Cs. Sociales'], email: 'seymour.skinner@colegio.cl' },
]

const ASIGNACION_PROFESORES_BASE = {
    'Lenguaje y Comunicación': 'p7',
    'Matemática': 'p1',
    'Historia, Geografía y Cs. Sociales': 'p6',
    'Ciencias Naturales': 'p5',
    'Inglés': 'p8',
    'Educación Física': 'p4',
    'Artes Visuales': 'p2',
    'Música': 'p3',
}

function asignaturaDelJefe(profesorJefeId) {
    const profesor = getProfesor(profesorJefeId)
    return profesor ? profesor.asignaturas[0] : null
}

function construirAsignaturasDelCurso(profesorJefeId) {
    const asignaturaJefe = asignaturaDelJefe(profesorJefeId)
    return {
    ...ASIGNACION_PROFESORES_BASE,
    ...(asignaturaJefe ? { [asignaturaJefe]: profesorJefeId } : {}),
    }
}

// Alumnos reales entregados por curso.
const ESTUDIANTES_POR_CURSO = {
    '1° Medio A': [
    'Aguirre Soto Martín Ignacio',
    'Bahamondes Reyes Camila Sofía',
    'Cárcamo Vergara Joaquín Andrés',
    'Donoso Pizarro Florencia Antonia',
    'Espinoza Ramírez Benjamín Tomás',
    'Fuentealba Morales Isidora Belén',
    'Gajardo Tapia Matías Esteban',
    'Henríquez Cortés Valentina Paz',
    'Inostroza Bravo Sebastián Andrés',
    'Jara Contreras Constanza Javiera',
    ],
    '1° Medio B': [
    'Lagos Fernández Diego Alejandro',
    'Maldonado Rojas Antonia Fernanda',
    'Navarro Castillo Tomás Ignacio',
    'Olivares Sepúlveda Camila Andrea',
    'Pinto Gallardo Maximiliano José',
    'Quezada Muñoz Fernanda Isidora',
    'Reyes Sandoval Vicente Andrés',
    'Saavedra Toro Javiera Belén',
    'Tapia Riquelme Cristóbal Eduardo',
    'Urrutia Vásquez Martina Sofía',
    ],
    '2° Medio A': [
    'Alarcón Beltrán Felipe Andrés',
    'Bustos Carvajal Daniela Paz',
    'Contreras Lara Agustín Nicolás',
    'Díaz Cáceres Florencia Isabel',
    'Escobar Pino Lucas Benjamín',
    'Flores Vega Catalina Antonia',
    'González Araya Bastián Ignacio',
    'Herrera Soto Valeria Constanza',
    'Ibarra Muñoz Joaquín Esteban',
    'Jiménez Rivas Antonella Fernanda',
    ],
    '2° Medio B': [
    'Lara Quiroz Matías Alonso',
    'Mella Figueroa Josefa Belén',
    'Núñez Ortiz Sebastián Tomás',
    'Ortega Salazar Camila Constanza',
    'Pérez Aguilar Vicente Maximiliano',
    'Ramos Bahamonde Isidora Antonia',
    'Sepúlveda Lagos Cristóbal Andrés',
    'Toledo Méndez Florencia Paz',
    'Valdés Soto Benjamín Andrés',
    'Zúñiga Pacheco Valentina Sofía',
    ],
    '3° Medio A': [
    'Alcayaga Alcayaga Álvaro Andrés',
    'Álvarez Fernández Maicol Exequiel',
    'Campillay Bordones Claudio Alejandro',
    'Campillay Flores Tais Ariana',
    'Campillay Olmos Jayson Maykol',
    'Carmona Campillay Walter Bastián',
    'Fritis Muñoz Katryna Estefanía',
    'Garvizo Santibáñez Fernanda Alejandra',
    'Henríquez Bordones Ignacio Maximiliano',
    'Iturra Campillay Renata Belén',
    ],
    '3° Medio B': [
    'Bravo Sánchez Constanza Belén',
    'Cortés Vidal Maximiliano Andrés',
    'Espinoza Tapia Fernanda Javiera',
    'Lobos Araya Ignacio Tomás',
    'Muñoz Cárdenas Valentina Paz',
    'Reyes Bustos Joaquín Esteban',
    'Salinas Pizarro Camila Antonia',
    'Torres Lagos Benjamín Andrés',
    'Vergara Olmos Isidora Fernanda',
    'Yáñez Carrasco Martín Alonso',
    ],
    '4° Medio A': [
    'Araya Fuenzalida Tomás Vicente',
    'Bórquez Lillo Antonia Valentina',
    'Cisternas Pino Joaquín Andrés',
    'Duarte Sandoval Florencia Camila',
    'Estay Morales Lucas Benjamín',
    'Fernández Gallardo Catalina Sofía',
    'Guerrero Ríos Bastián Maximiliano',
    'Hidalgo Vergara Javiera Constanza',
    'Inzunza Toledo Cristóbal Ignacio',
    'Leiva Bahamondes Antonella Belén',
    ],
    '4° Medio B': [
    'Mancilla Quezada Sebastián Andrés',
    'Navarrete Rojas Valentina Antonia',
    'Ojeda Carvajal Matías Esteban',
    'Parra Espinoza Isidora Fernanda',
    'Quiroz Tapia Benjamín Tomás',
    'Rivas Contreras Camila Paz',
    'Soto Aguirre Agustín Nicolás',
    'Tapia Bustos Florencia Andrea',
    'Vásquez Lagos Vicente Maximiliano',
    'Zamora Pizarro Martina Josefa',
    ],
}

const CURSOS_INICIALES = [
    { id: 1, nivel: '1°', letra: 'A', abreviacion: '1A-2026', profesorJefeId: 'p7' },
    { id: 2, nivel: '1°', letra: 'B', abreviacion: '1B-2026', profesorJefeId: 'p2' },
    { id: 3, nivel: '2°', letra: 'A', abreviacion: '2A-2026', profesorJefeId: 'p3' },
    { id: 4, nivel: '2°', letra: 'B', abreviacion: '2B-2026', profesorJefeId: 'p4' },
    { id: 5, nivel: '3°', letra: 'A', abreviacion: '3A-2026', profesorJefeId: 'p5' },
    { id: 6, nivel: '3°', letra: 'B', abreviacion: '3B-2026', profesorJefeId: 'p6' },
    { id: 7, nivel: '4°', letra: 'A', abreviacion: '4A-2026', profesorJefeId: 'p1' },
    { id: 8, nivel: '4°', letra: 'B', abreviacion: '4B-2026', profesorJefeId: 'p8' },
].map(c => ({
    ...c,
    profesoresPorAsignatura: construirAsignaturasDelCurso(c.profesorJefeId),
}))

// Alumnos: se generan a partir de ESTUDIANTES_POR_CURSO, conservando
// el orden, y se asignan al curso correspondiente.
const ALUMNOS_INICIALES = (() => {
    let contador = 1
    const lista = []
    CURSOS_INICIALES.forEach(curso => {
    const clave = `${curso.nivel} Medio ${curso.letra}`
    const nombres = ESTUDIANTES_POR_CURSO[clave] || []
    nombres.forEach(nombre => {
        lista.push({ id: `a${contador}`, indice: contador, nombre, nivel: curso.nivel, asignadoA: curso.id })
        contador++
    })
    })
    return lista
})()

// ============================================================
// HELPERS
// ============================================================

function getProfesor(profesorId) {
    return PROFESORES.find(p => p.id === profesorId)
}

function profesoresPorAsignaturaDisponibles(asignatura) {
    return PROFESORES.filter(p => p.asignaturas.includes(asignatura))
}

function nombreCurso(curso) {
    return `${curso.nivel} ${curso.letra}`
}

function compararCursos(a, b) {
    const indiceNivelA = NIVELES.indexOf(a.nivel)
    const indiceNivelB = NIVELES.indexOf(b.nivel)
    if (indiceNivelA !== indiceNivelB) return indiceNivelA - indiceNivelB
    const comparacionLetra = a.letra.localeCompare(b.letra)
    if (comparacionLetra !== 0) return comparacionLetra
    return a.abreviacion.localeCompare(b.abreviacion)
}

// Pseudo-random determinístico (mismo seed -> mismo valor siempre).
function pseudoRandom(seed) {
    const x = Math.sin(seed * 999.7) * 10000
    return x - Math.floor(x)
}

function hashCadena(str) {
    let h = 0
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 100000
    return h
}

function colorNota(n) {
    if (n === null || n === undefined) return '#9ca3af'
    if (n < 4.0) return '#f87171'
    if (n < 5.5) return '#facc15'
    return '#4ade80'
}

function bgNota(n) {
    if (n === null || n === undefined) return 'rgba(156,163,175,0.12)'
    if (n < 4.0) return 'rgba(248,113,113,0.12)'
    if (n < 5.5) return 'rgba(250,204,21,0.12)'
    return 'rgba(74,222,128,0.12)'
}

let nextCursoId = 100

// ============================================================
// GENERADORES DE DATA DERIVADA (notas, asistencia, horario, anotaciones, RUT, apoderado)
// ============================================================

function generarNotasAlumno(alumnoId, asignaturas, periodo) {
    const notas = {}
    asignaturas.forEach((asignatura, i) => {
    const seed = hashCadena(alumnoId + periodo) + i * 7.13
    notas[asignatura] = Math.round((4.0 + pseudoRandom(seed) * 3.0) * 10) / 10
    })
    return notas
}

function generarAsistenciaAlumno(alumnoId) {
    const seed = hashCadena(alumnoId) + 3.31
    const porcentaje = Math.round(80 + pseudoRandom(seed) * 19)
    const ausencias = Math.max(0, Math.round((100 - porcentaje) / 3))
    const atrasos = Math.round(pseudoRandom(seed + 1) * 5)
    return { porcentaje, ausencias, atrasos }
}

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
const BLOQUES = ['08:00 - 08:45', '08:45 - 09:30', '09:45 - 10:30', '10:30 - 11:15', '11:30 - 12:15', '12:15 - 13:00']

function generarHorarioCurso(cursoId, profesoresPorAsignatura) {
    const asignaturasCurso = Object.keys(profesoresPorAsignatura)
    const horario = []
    let cursor = cursoId
    DIAS.forEach(dia => {
    BLOQUES.forEach(bloque => {
        const asignatura = asignaturasCurso[cursor % asignaturasCurso.length]
        cursor++
        horario.push({ dia, bloque, asignatura })
    })
    })
    return horario
}

const TIPOS_ANOTACION = ['Positiva', 'Negativa']
const TEXTOS_ANOTACION_POSITIVA = [
    'Destacada participación en clases.',
    'Ayudó a un compañero con la materia.',
    'Excelente trabajo en equipo durante la actividad grupal.',
    'Entregó todas las tareas a tiempo durante el mes.',
]
const TEXTOS_ANOTACION_NEGATIVA = [
    'Conversaciones reiteradas durante la clase.',
    'No trajo materiales solicitados con anticipación.',
    'Llegó atrasado a la primera hora.',
    'No entregó la tarea en la fecha indicada.',
]

function generarAnotacionesCurso(alumnosDelCurso, profesoresPorAsignatura) {
    const anotaciones = []
    alumnosDelCurso.forEach((alumno) => {
    const seed = hashCadena(alumno.id)
    const cantidad = Math.round(pseudoRandom(seed) * 2)
    for (let n = 0; n < cantidad; n++) {
        const esPositiva = pseudoRandom(seed + n + 0.5) > 0.45
        const asignaturas = Object.keys(profesoresPorAsignatura)
        const asignatura = asignaturas[Math.floor(pseudoRandom(seed + n + 2) * asignaturas.length)]
        const textos = esPositiva ? TEXTOS_ANOTACION_POSITIVA : TEXTOS_ANOTACION_NEGATIVA
        const texto = textos[Math.floor(pseudoRandom(seed + n + 4) * textos.length)]
        const dia = 1 + Math.floor(pseudoRandom(seed + n + 6) * 27)
        anotaciones.push({
        id: `${alumno.id}-${n}`,
        alumno: alumno.nombre,
        tipo: esPositiva ? TIPOS_ANOTACION[0] : TIPOS_ANOTACION[1],
        asignatura,
        fecha: `2026-04-${String(dia).padStart(2, '0')}`,
        descripcion: texto,
        })
    }
    })
    return anotaciones.sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
}

// ---- RUT chileno (dígito verificador real, módulo 11) ----
function calcularDigitoVerificador(numero) {
    let suma = 0
    let multiplo = 2
    const digitos = String(numero)
    for (let i = digitos.length - 1; i >= 0; i--) {
    suma += parseInt(digitos[i], 10) * multiplo
    multiplo = multiplo < 7 ? multiplo + 1 : 2
    }
    const resto = 11 - (suma % 11)
    if (resto === 11) return '0'
    if (resto === 10) return 'K'
    return String(resto)
}

function formatearRut(numero) {
    const digitos = String(numero)
    const dv = calcularDigitoVerificador(numero)
    let formateado = ''
    let contador = 0
    for (let i = digitos.length - 1; i >= 0; i--) {
    formateado = digitos[i] + formateado
    contador++
    if (contador % 3 === 0 && i !== 0) formateado = '.' + formateado
    }
    return `${formateado}-${dv}`
}

function generarRutAlumno(indiceGlobal) {
    const numero = 20100000 + indiceGlobal * 733
    return formatearRut(numero)
}

const NOMBRES_APODERADOS = ['María', 'Carlos', 'Patricia', 'Juan', 'Marcela', 'Pedro', 'Andrea', 'Luis', 'Carolina', 'José']

function quitarAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function generarApoderado(alumno) {
    const apellidoPaterno = alumno.nombre.split(' ')[0]
    const seed = hashCadena(alumno.id)
    const nombrePila = NOMBRES_APODERADOS[Math.floor(pseudoRandom(seed + 8) * NOMBRES_APODERADOS.length)]
    const nombreCompleto = `${nombrePila} ${apellidoPaterno}`
    const correo = `${quitarAcentos(nombrePila).toLowerCase()}.${quitarAcentos(apellidoPaterno).toLowerCase()}@gmail.com`
    const telefono = `+56 9 ${String(60000000 + (hashCadena(alumno.id) % 19999999)).slice(0, 8)}`
    return { nombre: nombreCompleto, correo, telefono }
}

function generarCorreoAlumno(alumno) {
    const partes = alumno.nombre.split(' ')
    const apellidoPaterno = quitarAcentos(partes[0] || '').toLowerCase()
    const primerNombre = quitarAcentos(partes[2] || partes[1] || '').toLowerCase()
    return `${primerNombre}.${apellidoPaterno}@colegio.cl`
}

function generarEstadoAlumno(alumno) {
    const seed = hashCadena(alumno.id)
    return pseudoRandom(seed + 20) > 0.92 ? 'Inactivo' : 'Activo'
}

// ============================================================
// COMPONENTES de las secciones de "Ver curso"
// ============================================================

function Stat({ label, value }) {
    return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-base font-semibold mt-0.5">{value}</p>
    </div>
    )
}

function Seccion({ titulo, children }) {
    return (
    <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-300 mb-2.5">{titulo}</h2>
        {children}
    </div>
    )
}

function SeccionInformacionGeneral({ curso, alumnosDelCurso }) {
    const cantidadAsignaturas = Object.keys(curso.profesoresPorAsignatura).length
    return (
    <Seccion titulo="Información general">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <Stat label="Nivel" value={curso.nivel} />
        <Stat label="Paralelo" value={curso.letra} />
        <Stat label="Abreviación" value={curso.abreviacion} />
        <Stat label="Alumnos" value={alumnosDelCurso.length} />
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-sm text-gray-400">
            Curso <span className="text-white font-medium">{nombreCurso(curso)}</span> con{' '}
            <span className="text-white font-medium">{cantidadAsignaturas}</span> asignaturas dictadas y{' '}
            <span className="text-white font-medium">{alumnosDelCurso.length}</span> alumnos matriculados
            durante el año 2026.
        </p>
        </div>
    </Seccion>
    )
}

function SeccionProfesorJefe({ profesorJefe, asignaturaDelJefe }) {
    return (
    <Seccion titulo="Profesor jefe">
        {!profesorJefe ? (
        <p className="text-sm text-gray-500">Este curso no tiene profesor jefe asignado.</p>
        ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-600/40 flex items-center justify-center text-blue-400 font-semibold shrink-0">
            {profesorJefe.nombre.split(' ').map(p => p[0]).slice(0, 2).join('')}
            </div>
            <div>
            <p className="font-medium">{profesorJefe.nombre}</p>
            <p className="text-sm text-gray-400 mt-0.5">{profesorJefe.email}</p>
            <p className="text-xs text-blue-400 mt-1">Dicta {asignaturaDelJefe} en este curso</p>
            </div>
        </div>
        )}
    </Seccion>
    )
}

function SeccionAsignaturasYProfesores({ profesoresPorAsignatura, asignaturaBloqueada }) {
    return (
    <Seccion titulo="Asignaturas y profesores">
        <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800 overflow-hidden">
        {ASIGNATURAS.map(asignatura => {
            const profesor = getProfesor(profesoresPorAsignatura[asignatura])
            const esDelJefe = asignatura === asignaturaBloqueada
            return (
            <div key={asignatura} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                <p className="text-sm truncate">{asignatura}</p>
                <p className="text-xs text-gray-500 mt-0.5">{SALAS_POR_ASIGNATURA[asignatura]}</p>
                {esDelJefe && <p className="text-xs text-blue-400 mt-0.5">Dictada por el profesor jefe</p>}
                </div>
                {profesor ? (
                <span className="text-xs bg-gray-800 border border-gray-700 px-2.5 py-1 rounded-lg whitespace-nowrap">
                    {profesor.nombre}
                </span>
                ) : (
                <span className="text-xs text-gray-500 whitespace-nowrap">Sin asignar</span>
                )}
            </div>
            )
        })}
        </div>
    </Seccion>
    )
}

function SeccionHorario({ horario }) {
    return (
    <Seccion titulo="Horario">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto">
        <table className="w-full text-xs">
            <thead>
            <tr className="border-b border-gray-800 text-gray-500">
                <th className="text-left px-3 py-2.5 whitespace-nowrap">Bloque</th>
                {DIAS.map(dia => (
                <th key={dia} className="text-left px-3 py-2.5 whitespace-nowrap">{dia}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {BLOQUES.map(bloque => (
                <tr key={bloque} className="border-b border-gray-800/60">
                <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">{bloque}</td>
                {DIAS.map(dia => {
                    const clase = horario.find(h => h.dia === dia && h.bloque === bloque)
                    return (
                    <td key={dia} className="px-3 py-2.5 align-top">
                        {clase ? (
                        <div>
                            <p className="text-gray-200">{clase.asignatura}</p>
                            <p className="text-gray-500 mt-0.5">{SALAS_POR_ASIGNATURA[clase.asignatura]}</p>
                        </div>
                        ) : (
                        <span className="text-gray-600">—</span>
                        )}
                    </td>
                    )
                })}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </Seccion>
    )
}

function SeccionAsistencia({ alumnosDelCurso }) {
    return (
    <Seccion titulo="Asistencia">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto">
        <table className="w-full text-xs">
            <thead>
            <tr className="border-b border-gray-800 text-gray-500">
                <th className="text-left px-3 py-2.5">Alumno</th>
                <th className="text-center px-3 py-2.5">% Asistencia</th>
                <th className="text-center px-3 py-2.5">Ausencias</th>
                <th className="text-center px-3 py-2.5">Atrasos</th>
            </tr>
            </thead>
            <tbody>
            {alumnosDelCurso.map(alumno => {
                const { porcentaje, ausencias, atrasos } = generarAsistenciaAlumno(alumno.id)
                const color = porcentaje >= 90 ? '#4ade80' : porcentaje >= 80 ? '#facc15' : '#f87171'
                return (
                <tr key={alumno.id} className="border-b border-gray-800/60">
                    <td className="px-3 py-2.5 whitespace-nowrap">{alumno.nombre}</td>
                    <td className="text-center px-3 py-2.5 font-semibold" style={{ color }}>{porcentaje}%</td>
                    <td className="text-center px-3 py-2.5 text-gray-300">{ausencias}</td>
                    <td className="text-center px-3 py-2.5 text-gray-300">{atrasos}</td>
                </tr>
                )
            })}
            </tbody>
        </table>
        </div>
    </Seccion>
    )
}

function SeccionAnotaciones({ anotaciones }) {
    return (
    <Seccion titulo="Anotaciones">
        {anotaciones.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">No hay anotaciones registradas para este curso.</p>
        ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800 overflow-hidden">
            {anotaciones.map(a => (
            <div key={a.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{a.alumno}</p>
                <span
                    className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                    a.tipo === 'Positiva'
                        ? 'bg-green-600/15 text-green-400 border border-green-600/30'
                        : 'bg-red-600/15 text-red-400 border border-red-600/30'
                    }`}
                >
                    {a.tipo}
                </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{a.descripcion}</p>
                <p className="text-xs text-gray-500 mt-1">{a.asignatura} · {a.fecha}</p>
            </div>
            ))}
        </div>
        )}
    </Seccion>
    )
}

// Tarjetas de navegación hacia las pantallas dedicadas de Alumnos y Notas
function TarjetaNavegacion({ titulo, descripcion, onClick }) {
    return (
    <button
        onClick={onClick}
        className="text-left bg-gray-900 border border-gray-800 hover:border-blue-600/60 hover:bg-gray-900/70 rounded-xl p-5 transition-colors group"
    >
        <div className="flex items-center justify-between">
        <p className="font-medium">{titulo}</p>
        <span className="text-gray-500 group-hover:text-blue-400 transition-colors">→</span>
        </div>
        <p className="text-sm text-gray-400 mt-1">{descripcion}</p>
    </button>
    )
}

// ============================================================
// PÁGINA: Ver curso (sin pestañas, todo en una sola vista)
// ============================================================

function PaginaVerCurso({ curso, alumnos, onVolver, onEditar, onVerAlumnos, onVerNotas }) {
    const profesorJefe = getProfesor(curso.profesorJefeId)
    const asignaturaBloqueada = profesorJefe ? asignaturaDelJefe(curso.profesorJefeId) : null
    const alumnosDelCurso = alumnos
    .filter(a => a.asignadoA === curso.id)
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    const horario = generarHorarioCurso(curso.id, curso.profesoresPorAsignatura)
    const anotaciones = generarAnotacionesCurso(alumnosDelCurso, curso.profesoresPorAsignatura)

    return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8">
        <button onClick={onVolver} className="text-sm text-gray-400 hover:text-gray-200 mb-6 flex items-center gap-1">
            ← Volver a cursos
        </button>

        <div className="flex items-start justify-between gap-4 mb-8">
            <div>
            <p className="text-xs text-blue-400 font-medium uppercase tracking-wide mb-1">Ver curso</p>
            <h1 className="text-xl font-bold">
                Curso {nombreCurso(curso)}{' '}
                <span className="text-gray-500 text-sm font-normal">({curso.abreviacion})</span>
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">Profesor jefe: {profesorJefe?.nombre || '—'}</p>
            </div>
            <button
            onClick={onEditar}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
            Editar curso
            </button>
        </div>

        <SeccionInformacionGeneral curso={curso} alumnosDelCurso={alumnosDelCurso} />
        <SeccionProfesorJefe profesorJefe={profesorJefe} asignaturaDelJefe={asignaturaBloqueada} />
        <SeccionAsignaturasYProfesores
            profesoresPorAsignatura={curso.profesoresPorAsignatura}
            asignaturaBloqueada={asignaturaBloqueada}
        />
        <SeccionHorario horario={horario} />

        <Seccion titulo="Alumnos y notas">
            <div className="grid sm:grid-cols-2 gap-3">
            <TarjetaNavegacion
                titulo="Alumnos"
                descripcion={`Ver listado completo con RUT, apoderado y datos de contacto (${alumnosDelCurso.length} alumnos).`}
                onClick={onVerAlumnos}
            />
            <TarjetaNavegacion
                titulo="Notas"
                descripcion="Ver resumen general de calificaciones por asignatura y promedio."
                onClick={onVerNotas}
            />
            </div>
        </Seccion>

        <SeccionAsistencia alumnosDelCurso={alumnosDelCurso} />
        <SeccionAnotaciones anotaciones={anotaciones} />
        </main>
        <Footer />
    </div>
    )
}

// ============================================================
// PÁGINA: Alumnos del curso (RUT, apoderado, correo, estado)
// ============================================================

function PaginaAlumnosCurso({ curso, alumnos, onVolver }) {
    const alumnosDelCurso = alumnos
    .filter(a => a.asignadoA === curso.id)
    .sort((a, b) => a.nombre.localeCompare(b.nombre))

    return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        <button onClick={onVolver} className="text-sm text-gray-400 hover:text-gray-200 mb-6 flex items-center gap-1">
            ← Volver al curso
        </button>

        <div className="flex items-center justify-between mb-6">
            <div>
            <h1 className="text-xl font-bold">Alumnos — Curso {nombreCurso(curso)}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{alumnosDelCurso.length} alumnos matriculados</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-sm px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
            + Agregar
            </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                <th className="text-left px-5 py-3 whitespace-nowrap">Nombre</th>
                <th className="text-left px-5 py-3 whitespace-nowrap">RUT</th>
                <th className="text-left px-5 py-3 whitespace-nowrap">Correo alumno</th>
                <th className="text-left px-5 py-3 whitespace-nowrap">Apoderado</th>
                <th className="text-left px-5 py-3 whitespace-nowrap">Correo apoderado</th>
                <th className="text-left px-5 py-3 whitespace-nowrap">Teléfono</th>
                <th className="text-left px-5 py-3 whitespace-nowrap">Estado</th>
                </tr>
            </thead>
            <tbody>
                {alumnosDelCurso.map(alumno => {
                const apoderado = generarApoderado(alumno)
                const estado = generarEstadoAlumno(alumno)
                return (
                    <tr key={alumno.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">{alumno.nombre}</td>
                    <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{generarRutAlumno(alumno.indice)}</td>
                    <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{generarCorreoAlumno(alumno)}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{apoderado.nombre}</td>
                    <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{apoderado.correo}</td>
                    <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{apoderado.telefono}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${estado === 'Activo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {estado}
                        </span>
                    </td>
                    </tr>
                )
                })}
            </tbody>
            </table>
        </div>
        </main>
        <Footer />
    </div>
    )
}

// ============================================================
// PÁGINA: Resumen general de calificaciones del curso
// ============================================================

function PaginaNotasCurso({ curso, alumnos, onVolver }) {
    const [periodo, setPeriodo] = useState(PERIODOS[0])
    const alumnosDelCurso = alumnos
    .filter(a => a.asignadoA === curso.id)
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    const asignaturas = Object.keys(curso.profesoresPorAsignatura)

    const selectStyle = {
    background: '#1f2937',
    border: '1px solid #374151',
    color: '#fff',
    fontSize: 13,
    borderRadius: 8,
    padding: '6px 10px',
    outline: 'none',
    }

    return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
        <button onClick={onVolver} className="text-sm text-gray-400 hover:text-gray-200 mb-6 flex items-center gap-1">
            ← Volver al curso
        </button>

        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div>
            <h1 className="text-xl font-bold">Resumen general de calificaciones</h1>
            <p className="text-gray-400 text-sm mt-0.5">
                Curso {nombreCurso(curso)} · Promedio de cada alumno en todas las asignaturas
            </p>
            </div>
            <select style={selectStyle} value={periodo} onChange={e => setPeriodo(e.target.value)}>
            {PERIODOS.map(p => (
                <option key={p} value={p}>{p}</option>
            ))}
            </select>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-xs">
                <thead>
                <tr className="border-b border-gray-800 text-gray-500">
                    <th className="text-left px-4 py-3 whitespace-nowrap">Alumno</th>
                    {asignaturas.map(a => (
                    <th key={a} className="text-center px-3 py-3 whitespace-nowrap">{a.split(',')[0]}</th>
                    ))}
                    <th className="text-center px-4 py-3 whitespace-nowrap">Promedio general</th>
                </tr>
                </thead>
                <tbody>
                {alumnosDelCurso.map(alumno => {
                    const notas = generarNotasAlumno(alumno.id, asignaturas, periodo)
                    const valores = Object.values(notas)
                    const promedio = Math.round((valores.reduce((a, b) => a + b, 0) / valores.length) * 10) / 10
                    return (
                    <tr key={alumno.id} className="border-b border-gray-800/60">
                        <td className="px-4 py-2.5 whitespace-nowrap">{alumno.nombre}</td>
                        {asignaturas.map(a => (
                        <td key={a} className="text-center px-3 py-2.5">
                            <span
                            className="inline-block min-w-[44px] px-2 py-1 rounded-lg font-medium"
                            style={{ background: bgNota(notas[a]), color: colorNota(notas[a]) }}
                            >
                            {notas[a].toFixed(1)}
                            </span>
                        </td>
                        ))}
                        <td className="text-center px-4 py-2.5">
                        <span className="font-bold" style={{ color: colorNota(promedio) }}>
                            {promedio.toFixed(1)}
                        </span>
                        </td>
                    </tr>
                    )
                })}
                </tbody>
            </table>
            </div>
            <div className="px-4 py-3 text-xs text-gray-500 border-t border-gray-800">
            Tip: vuelve al curso para acceder al detalle por asignatura y registrar nuevas evaluaciones.
            </div>
        </div>
        </main>
        <Footer />
    </div>
    )
}

// ============================================================
// COMPONENTE: Selector de alumnos (usado en crear/editar)
// ============================================================

function SelectorAlumnos({ nivel, cursoId, alumnos, seleccionados, onToggle }) {
    if (!nivel) {
    return <p className="text-sm text-gray-500 italic">Selecciona un nivel para ver los alumnos disponibles.</p>
    }
    const disponibles = alumnos.filter(a => a.nivel === nivel)
    if (disponibles.length === 0) {
    return <p className="text-sm text-gray-500 italic">No hay alumnos registrados en {nivel} todavía.</p>
    }
    return (
    <div className="border border-gray-700 rounded-lg max-h-48 overflow-y-auto divide-y divide-gray-800">
        {disponibles.map(alumno => {
        const ocupadoPorOtro = alumno.asignadoA !== null && alumno.asignadoA !== cursoId
        const checked = seleccionados.includes(alumno.id)
        return (
            <label
            key={alumno.id}
            className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer ${
                ocupadoPorOtro ? 'opacity-50' : 'hover:bg-gray-800'
            }`}
            >
            <span className="flex items-center gap-2">
                <input
                type="checkbox"
                checked={checked}
                disabled={ocupadoPorOtro}
                onChange={() => onToggle(alumno.id)}
                className="accent-blue-600"
                />
                {alumno.nombre}
            </span>
            {ocupadoPorOtro && <span className="text-xs text-gray-500">ya asignado</span>}
            </label>
        )
        })}
    </div>
    )
}

// ============================================================
// COMPONENTE: Malla de asignaturas del curso (formulario)
// ============================================================

function MallaAsignaturas({ asignaciones, asignaturaBloqueada, profesorJefe, onCambiarProfesor }) {
    return (
    <div className="border border-gray-700 rounded-lg divide-y divide-gray-800">
        {ASIGNATURAS.map(asignatura => {
        const esLaDelJefe = asignatura === asignaturaBloqueada
        const disponibles = profesoresPorAsignaturaDisponibles(asignatura)
        const profesorIdActual = esLaDelJefe ? profesorJefe?.id || '' : asignaciones[asignatura] || ''

        return (
            <div key={asignatura} className="flex items-center justify-between gap-3 px-3 py-2.5">
            <div className="min-w-0">
                <p className="text-sm truncate">{asignatura}</p>
                {esLaDelJefe && <p className="text-xs text-blue-400 mt-0.5">Dictada por el profesor jefe</p>}
            </div>
            {esLaDelJefe ? (
                <select
                value={profesorJefe?.id || ''}
                disabled
                style={{ width: '144px', minWidth: '144px', maxWidth: '144px' }}
                className="bg-gray-800/60 border border-gray-700 text-gray-300 text-xs rounded-lg px-2.5 py-1.5 shrink-0 truncate disabled:opacity-100 disabled:cursor-not-allowed"
                >
                <option value={profesorJefe?.id || ''}>{profesorJefe?.nombre}</option>
                </select>
            ) : (
                <select
                value={profesorIdActual}
                onChange={e => onCambiarProfesor(asignatura, e.target.value)}
                disabled={disponibles.length === 0}
                style={{ width: '144px', minWidth: '144px', maxWidth: '144px' }}
                className="bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 truncate"
                >
                <option value="">{disponibles.length === 0 ? 'Sin profesores' : 'Sin asignar'}</option>
                {disponibles.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
                </select>
            )}
            </div>
        )
        })}
    </div>
    )
}

// ============================================================
// COMPONENTE: Formulario de curso (compartido por crear y editar)
// ============================================================

function FormularioCurso({ valorInicial, alumnos, onGuardar, onCancelar, modoEdicion }) {
    const [nivel, setNivel] = useState(valorInicial?.nivel || '')
    const [letra, setLetra] = useState(valorInicial?.letra || '')
    const [abreviacion, setAbreviacion] = useState(valorInicial?.abreviacion || '')
    const [profesorJefeId, setProfesorJefeId] = useState(valorInicial?.profesorJefeId || '')
    const [asignaciones, setAsignaciones] = useState(valorInicial?.profesoresPorAsignatura || {})
    const [alumnosSeleccionados, setAlumnosSeleccionados] = useState(
    valorInicial ? alumnos.filter(a => a.asignadoA === valorInicial.id).map(a => a.id) : []
    )

    const profesorJefe = getProfesor(profesorJefeId)
    const asignaturaBloqueada = profesorJefe ? asignaturaDelJefe(profesorJefeId) : null

    function handleCambiarJefe(nuevoProfesorJefeId) {
    const asignaturaAnterior = asignaturaBloqueada
    const nuevaAsignatura = nuevoProfesorJefeId ? asignaturaDelJefe(nuevoProfesorJefeId) : null
    setAsignaciones(prev => {
        const siguiente = { ...prev }
        if (asignaturaAnterior) delete siguiente[asignaturaAnterior]
        if (nuevaAsignatura) siguiente[nuevaAsignatura] = nuevoProfesorJefeId
        return siguiente
    })
    setProfesorJefeId(nuevoProfesorJefeId)
    }

    function handleCambiarProfesorAsignatura(asignatura, profesorId) {
    setAsignaciones(prev => {
        const siguiente = { ...prev }
        if (profesorId) siguiente[asignatura] = profesorId
        else delete siguiente[asignatura]
        return siguiente
    })
    }

    function toggleAlumno(alumnoId) {
    setAlumnosSeleccionados(prev =>
        prev.includes(alumnoId) ? prev.filter(id => id !== alumnoId) : [...prev, alumnoId]
    )
    }

    const formValido = nivel && letra && abreviacion && profesorJefeId

    function handleSubmit(e) {
    e.preventDefault()
    if (!formValido) return
    onGuardar({
        nivel,
        letra: letra.toUpperCase(),
        abreviacion,
        profesorJefeId,
        profesoresPorAsignatura: asignaciones,
        alumnosSeleccionados,
    })
    }

    return (
    <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm text-gray-400 mb-1.5">Nivel</label>
            <select
            value={nivel}
            onChange={e => setNivel(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
            <option value="">Selecciona un nivel</option>
            {NIVELES.map(n => (
                <option key={n} value={n}>{n}</option>
            ))}
            </select>
        </div>
        <div>
            <label className="block text-sm text-gray-400 mb-1.5">Letra / paralelo</label>
            <input
            type="text"
            maxLength={1}
            value={letra}
            onChange={e => setLetra(e.target.value.replace(/[^a-zA-Z]/g, ''))}
            placeholder="A"
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 uppercase"
            />
        </div>
        </div>

        <div>
        <label className="block text-sm text-gray-400 mb-1.5">Abreviación / ID del curso</label>
        <input
            type="text"
            value={abreviacion}
            onChange={e => setAbreviacion(e.target.value)}
            placeholder="Ej: 1A-2026"
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Identificador único usado internamente para referenciar el curso.</p>
        </div>

        <div>
        <label className="block text-sm text-gray-400 mb-1.5">Profesor jefe</label>
        <select
            value={profesorJefeId}
            onChange={e => handleCambiarJefe(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
        >
            <option value="">Selecciona un profesor jefe</option>
            {PROFESORES.map(p => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
        </select>
        {profesorJefe && (
            <p className="text-xs text-gray-500 mt-1">Dictará {asignaturaBloqueada} en este curso.</p>
        )}
        </div>

        <div>
        <label className="block text-sm text-gray-400 mb-1.5">Asignaturas y profesores</label>
        <MallaAsignaturas
            asignaciones={asignaciones}
            asignaturaBloqueada={asignaturaBloqueada}
            profesorJefe={profesorJefe}
            onCambiarProfesor={handleCambiarProfesorAsignatura}
        />
        <p className="text-xs text-gray-500 mt-1">La asignatura del profesor jefe queda fija. Elige el profesor jefe primero.</p>
        </div>

        <div>
        <label className="block text-sm text-gray-400 mb-1.5">
            Alumnos del curso
            {alumnosSeleccionados.length > 0 && (
            <span className="text-gray-500"> ({alumnosSeleccionados.length} seleccionados)</span>
            )}
        </label>
        <SelectorAlumnos
            nivel={nivel}
            cursoId={valorInicial?.id ?? null}
            alumnos={alumnos}
            seleccionados={alumnosSeleccionados}
            onToggle={toggleAlumno}
        />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
        <button
            type="button"
            onClick={onCancelar}
            className="text-sm text-gray-400 hover:text-gray-200 px-4 py-2 rounded-lg transition-colors"
        >
            Cancelar
        </button>
        <button
            type="submit"
            disabled={!formValido}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
            {modoEdicion ? 'Guardar cambios' : 'Crear curso'}
        </button>
        </div>
    </form>
    )
}

// ============================================================
// COMPONENTE: Página "Nuevo curso" (vista separada)
// ============================================================

function PaginaNuevoCurso({ alumnos, onGuardar, onVolver }) {
    return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-8">
        <button onClick={onVolver} className="text-sm text-gray-400 hover:text-gray-200 mb-6 flex items-center gap-1">
            ← Volver a cursos
        </button>
        <div className="mb-6">
            <h1 className="text-xl font-bold">Nuevo curso</h1>
            <p className="text-gray-400 text-sm mt-0.5">Completa la información para crear un curso nuevo.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <FormularioCurso alumnos={alumnos} onGuardar={onGuardar} onCancelar={onVolver} modoEdicion={false} />
        </div>
        </main>
        <Footer />
    </div>
    )
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function CoursesPage() {
    const [cursos, setCursos] = useState(CURSOS_INICIALES)
    const [alumnos, setAlumnos] = useState(ALUMNOS_INICIALES)
    const [cursoEditandoId, setCursoEditandoId] = useState(null)
    const [cursoVistaId, setCursoVistaId] = useState(null)
    const [vista, setVista] = useState('lista') // 'lista' | 'nuevo' | 'ver' | 'alumnos' | 'notas'

    function aplicarAsignacionAlumnos(cursoId, alumnosSeleccionados) {
    setAlumnos(prev =>
        prev.map(a => {
        if (alumnosSeleccionados.includes(a.id)) return { ...a, asignadoA: cursoId }
        if (a.asignadoA === cursoId) return { ...a, asignadoA: null }
        return a
        })
    )
    }

    function handleCrearCurso(datos) {
    const nuevoId = nextCursoId++
    const nuevoCurso = {
        id: nuevoId,
        nivel: datos.nivel,
        letra: datos.letra,
        abreviacion: datos.abreviacion,
        profesorJefeId: datos.profesorJefeId,
        profesoresPorAsignatura: datos.profesoresPorAsignatura,
    }
    setCursos(prev => [...prev, nuevoCurso])
    aplicarAsignacionAlumnos(nuevoId, datos.alumnosSeleccionados)
    setVista('lista')
    }

    function handleEditarCurso(cursoId, datos) {
    setCursos(prev =>
        prev.map(c =>
        c.id === cursoId
            ? {
                ...c,
                nivel: datos.nivel,
                letra: datos.letra,
                abreviacion: datos.abreviacion,
                profesorJefeId: datos.profesorJefeId,
                profesoresPorAsignatura: datos.profesoresPorAsignatura,
            }
            : c
        )
    )
    aplicarAsignacionAlumnos(cursoId, datos.alumnosSeleccionados)
    setCursoEditandoId(null)
    }

    const cursosOrdenados = [...cursos].sort(compararCursos)
    const cursoActivo = cursos.find(c => c.id === cursoVistaId)

    if (vista === 'nuevo') {
    return <PaginaNuevoCurso alumnos={alumnos} onGuardar={handleCrearCurso} onVolver={() => setVista('lista')} />
    }

    if (vista === 'ver' && cursoActivo) {
    return (
        <PaginaVerCurso
        curso={cursoActivo}
        alumnos={alumnos}
        onVolver={() => setVista('lista')}
        onEditar={() => {
            setVista('lista')
            setCursoEditandoId(cursoActivo.id)
        }}
        onVerAlumnos={() => setVista('alumnos')}
        onVerNotas={() => setVista('notas')}
        />
    )
    }

    if (vista === 'alumnos' && cursoActivo) {
    return <PaginaAlumnosCurso curso={cursoActivo} alumnos={alumnos} onVolver={() => setVista('ver')} />
    }

    if (vista === 'notas' && cursoActivo) {
    return <PaginaNotasCurso curso={cursoActivo} alumnos={alumnos} onVolver={() => setVista('ver')} />
    }

    return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6 gap-4">
            <div>
            <h1 className="text-xl font-bold">Gestión de Cursos</h1>
            <p className="text-gray-400 text-sm mt-0.5">Administración de cursos del colegio</p>
            </div>
            <button
            onClick={() => setVista('nuevo')}
            className="bg-blue-600 hover:bg-blue-500 text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
            + Nuevo curso
            </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-4">
            {cursosOrdenados.map((curso, i) => {
            const profesorJefe = getProfesor(curso.profesorJefeId)
            const enEdicion = cursoEditandoId === curso.id
            const cantidadAlumnos = alumnos.filter(a => a.asignadoA === curso.id).length
            const cantidadAsignaturas = Object.keys(curso.profesoresPorAsignatura).length

            return (
                <div key={curso.id} className={i < cursosOrdenados.length - 1 ? 'border-b border-gray-800' : ''}>
                <div className="px-5 py-4 flex items-center justify-between">
                    <div>
                    <h2 className="font-medium">
                        Curso {nombreCurso(curso)}{' '}
                        <span className="text-gray-500 text-xs font-normal">({curso.abreviacion})</span>
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Profesor jefe: {profesorJefe?.nombre || '—'}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                        {cantidadAsignaturas} asignatura{cantidadAsignaturas !== 1 ? 's' : ''} con profesor · {cantidadAlumnos} alumno{cantidadAlumnos !== 1 ? 's' : ''}
                    </p>
                    </div>
                    <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCursoEditandoId(enEdicion ? null : curso.id)}
                        className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs px-3 py-2 rounded-lg transition-colors"
                    >
                        {enEdicion ? 'Cerrar' : 'Editar'}
                    </button>
                    <button
                        onClick={() => {
                        setCursoVistaId(curso.id)
                        setVista('ver')
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-xs px-3 py-2 rounded-lg transition-colors"
                    >
                        Ver curso
                    </button>
                    </div>
                </div>

                {enEdicion && (
                    <div className="px-5 pb-5 pt-1 bg-gray-950/40 border-t border-gray-800">
                    <FormularioCurso
                        valorInicial={curso}
                        alumnos={alumnos}
                        onGuardar={datos => handleEditarCurso(curso.id, datos)}
                        onCancelar={() => setCursoEditandoId(null)}
                        modoEdicion={true}
                    />
                    </div>
                )}
                </div>
            )
            })}

            {cursosOrdenados.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-10">No hay cursos registrados todavía.</p>
            )}
        </div>
        </main>
        <Footer />
    </div>
    )
}