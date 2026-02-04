// 1. Configuración de Conexión
const URL_DB = "https://yxwcrueodtjjfkxjquyz.supabase.co";
const KEY_DB = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d2NydWVvZHRqamZreGpxdXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNjQwNzMsImV4cCI6MjA4NTc0MDA3M30.ySv6JljwPsl1FfwFVDy6AOXuZFSBFRw3sKOEXujs7lY";

const _supabase = supabase.createClient(URL_DB, KEY_DB);

const form = document.getElementById('form-equipo');
const tablaCuerpo = document.getElementById('tabla-cuerpo');

// Función de captura robusta
function getVal(id) {
    const el = document.getElementById(id);
    if (!el) {
        console.warn(`Elemento con ID "${id}" no encontrado en el HTML.`);
        return null;
    }
    return el.value.trim();
}

// --- CÁLCULO AUTOMÁTICO DE VENCIMIENTO ---
function actualizarVencimiento() {
    const fechaInput = getVal('ultima_mantencion');
    const frecuencia = getVal('frecuencia');
    const vencimientoField = document.getElementById('vencimiento_calibracion');

    if (fechaInput && vencimientoField) {
        let fecha = new Date(fechaInput + 'T00:00:00');
        if (frecuencia === "Semestral") {
            fecha.setMonth(fecha.getMonth() + 6);
        } else {
            fecha.setFullYear(fecha.getFullYear() + 1);
        }
        vencimientoField.value = fecha.toISOString().split('T')[0];
    }
}

document.getElementById('ultima_mantencion')?.addEventListener('change', actualizarVencimiento);
document.getElementById('frecuencia')?.addEventListener('change', actualizarVencimiento);

// --- GUARDAR EQUIPO ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevoEquipo = {
        codigo_peoplesoft: getVal('codigo_peoplesoft'),
        nombre_equipo: getVal('nombre_equipo'),
        especificacion_tecnica: getVal('especificacion_tecnica'),
        actividad: getVal('actividad'),
        frecuencia: getVal('frecuencia'),
        prioridad: getVal('prioridad'),
        ultima_mantencion: getVal('ultima_mantencion') || null,
        realizada_por: getVal('realizada_por'),
        vencimiento_calibracion: getVal('vencimiento_calibracion') || null,
        instructivo_area: getVal('instructivo_area'),
        lugar: getVal('lugar'),
        existencias_reales: parseInt(getVal('existencias_reales')) || 0,
        existencias_estandar: parseInt(getVal('existencias_estandar')) || 0
    };

    // DEBUG: Mira esto en la consola (F12) antes de guardar
    console.log("Enviando a Supabase:", nuevoEquipo);

    const { error } = await _supabase
        .from('equipos_mantencion')
        .insert([nuevoEquipo]);

    if (error) {
        console.error("Error detallado:", error);
        alert("Error al guardar: " + error.message);
    } else {
        alert("¡Registro guardado exitosamente!");
        form.reset();
        // Restaurar nombre por defecto
        if(document.getElementById('realizada_por')) {
            document.getElementById('realizada_por').value = "Jaime Alfredo Jimenez Saldaña";
        }
        cargarEquipos();
    }
});

// --- CARGAR EQUIPOS ---
async function cargarEquipos() {
    const { data: equipos, error } = await _supabase
        .from('equipos_mantencion')
        .select('*')
        .order('fecha_creacion', { ascending: false });

    if (error) {
        console.error("Error al cargar:", error);
        return;
    }

    tablaCuerpo.innerHTML = ""; 

    equipos.forEach(equipo => {
        const tieneBrecha = equipo.existencias_reales < equipo.existencias_estandar;
        const hoy = new Date();
        const vencimiento = equipo.vencimiento_calibracion ? new Date(equipo.vencimiento_calibracion + 'T00:00:00') : null;
        const estaVencido = vencimiento && vencimiento < hoy;

        tablaCuerpo.innerHTML += `
            <tr class="hover:bg-gray-50 border-b border-gray-200">
                <td class="p-4">
                    <div class="font-bold text-blue-900 uppercase text-xs">${equipo.nombre_equipo}</div>
                    <div class="text-[10px] text-gray-500 leading-tight">${equipo.especificacion_tecnica || 'Sin detalles técnicos'}</div>
                </td>
                <td class="p-4">
                    <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        ${equipo.lugar || 'N/A'}
                    </span>
                </td>
                <td class="p-4 text-center">
                    <span class="px-2 py-1 bg-gray-100 rounded text-[10px] font-mono font-bold">${equipo.prioridad || '-'}</span>
                </td>
                <td class="p-4 text-[10px] ${estaVencido ? 'text-red-600 font-bold' : 'text-gray-700'}">
                    ${equipo.ultima_mantencion || '---'}
                    ${estaVencido ? '<br><span class="text-[8px]">[VENCIDO]</span>' : ''}
                </td>
                <td class="p-4 text-[10px]">
                    ${tieneBrecha 
                        ? `<span class="text-red-600 font-bold">BRECHA (${equipo.existencias_reales}/${equipo.existencias_estandar})</span>` 
                        : `<span class="text-green-600 font-medium">OK (${equipo.existencias_reales})</span>`}
                </td>
                <td class="p-4 text-right">
                    <button onclick="eliminarEquipo('${equipo.id}')" class="text-red-500 hover:text-red-700 transition">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

async function eliminarEquipo(id) {
    if(confirm("¿Confirmas la eliminación definitiva de este equipo?")) {
        const { error } = await _supabase.from('equipos_mantencion').delete().eq('id', id);
        if (error) alert("Error al eliminar");
        else cargarEquipos();
    }
}

cargarEquipos();
