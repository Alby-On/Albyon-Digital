// 1. Configuración de Conexión
const URL_DB = "https://yxwcrueodtjjfkxjquyz.supabase.co";
const KEY_DB = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d2NydWVvZHRqamZreGpxdXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNjQwNzMsImV4cCI6MjA4NTc0MDA3M30.ySv6JljwPsl1FfwFVDy6AOXuZFSBFRw3sKOEXujs7lY";

const _supabase = supabase.createClient(URL_DB, KEY_DB);

const form = document.getElementById('form-equipo');
const tablaCuerpo = document.getElementById('tabla-cuerpo');

// Función segura para obtener valores
const getVal = (id) => document.getElementById(id) ? document.getElementById(id).value : "";

// --- CÁLCULO AUTOMÁTICO DE VENCIMIENTO ---
function actualizarVencimiento() {
    const fechaInput = getVal('ultima_mantencion');
    const frecuencia = getVal('frecuencia');
    const vencimientoField = document.getElementById('vencimiento_calibracion');

    if (fechaInput && vencimientoField) {
        let fecha = new Date(fechaInput + 'T00:00:00'); // Evita desfase de zona horaria
        if (frecuencia === "Semestral") {
            fecha.setMonth(fecha.getMonth() + 6);
        } else {
            fecha.setFullYear(fecha.getFullYear() + 1);
        }
        vencimientoField.value = fecha.toISOString().split('T')[0];
    }
}

// Escuchadores para el cálculo automático
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
        instructivo_area: getVal('instructivo_area'),
        realizada_por: getVal('realizada_por'),
        lugar: getVal('lugar'),
        prioridad: getVal('prioridad'),
        frecuencia: getVal('frecuencia'),
        ultima_mantencion: getVal('ultima_mantencion') || null,
        vencimiento_calibracion: getVal('vencimiento_calibracion') || null,
        existencias_reales: parseInt(getVal('existencias_reales')) || 0,
        existencias_estandar: parseInt(getVal('existencias_estandar')) || 0
    };

    const { error } = await _supabase
        .from('equipos_mantencion')
        .insert([nuevoEquipo]);

    if (error) {
        alert("Error de Supabase: " + error.message);
    } else {
        alert("¡Guardado con éxito!");
        form.reset();
        // Recargar nombre por defecto tras reset
        document.getElementById('realizada_por').value = "Jaime Alfredo Jimenez Saldaña";
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
        console.error("Error:", error);
        return;
    }

    tablaCuerpo.innerHTML = ""; 

    equipos.forEach(equipo => {
        const tieneBrecha = equipo.existencias_reales < equipo.existencias_estandar;
        
        // Semáforo de Vencimiento
        const hoy = new Date();
        const vencimiento = equipo.vencimiento_calibracion ? new Date(equipo.vencimiento_calibracion + 'T00:00:00') : null;
        const estaVencido = vencimiento && vencimiento < hoy;

        tablaCuerpo.innerHTML += `
            <tr class="hover:bg-gray-50 border-b">
                <td class="p-4">
                    <div class="font-bold text-blue-800 uppercase text-xs">${equipo.nombre_equipo}</div>
                    <div class="text-[10px] text-gray-600 italic">${equipo.especificacion_tecnica || 'Sin especificación'}</div>
                    <div class="text-[9px] text-gray-400">ID: ${equipo.codigo_peoplesoft || 'N/A'}</div>
                </td>
                <td class="p-4">
                    <span class="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        ${equipo.lugar || '---'}
                    </span>
                </td>
                <td class="p-4">
                    <span class="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold">${equipo.prioridad}</span>
                </td>
                <td class="p-4 text-[10px] ${estaVencido ? 'text-red-600 font-bold' : ''}">
                    ${equipo.ultima_mantencion || '---'}
                    ${estaVencido ? '<br><span class="text-[8px] uppercase">[Vencido]</span>' : ''}
                </td>
                <td class="p-4 text-[10px]">
                    ${tieneBrecha 
                        ? `<span class="text-red-500 font-bold">BRECHA (${equipo.existencias_reales}/${equipo.existencias_estandar})</span>` 
                        : `<span class="text-green-500">OK (${equipo.existencias_reales})</span>`}
                </td>
                <td class="p-4">
                    <button onclick="eliminarEquipo('${equipo.id}')" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

async function eliminarEquipo(id) {
    if(confirm("¿Estás seguro de que deseas eliminar este registro técnico?")) {
        const { error } = await _supabase.from('equipos_mantencion').delete().eq('id', id);
        if (error) alert("Error al eliminar");
        else cargarEquipos();
    }
}

// Iniciar aplicación
cargarEquipos();
