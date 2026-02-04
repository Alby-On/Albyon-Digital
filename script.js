// 1. Configuración de Conexión
const SUPABASE_URL = "https://yxwcrueodtjjfkxjquyz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d2NydWVvZHRqamZreGpxdXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNjQwNzMsImV4cCI6MjA4NTc0MDA3M30.ySv6JljwPsl1FfwFVDy6AOXuZFSBFRw3sKOEXujs7lY";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('form-equipo');
const tablaCuerpo = document.getElementById('tabla-cuerpo');

// 2. Función para GUARDAR un equipo
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevoEquipo = {
        codigo_peoplesoft: document.getElementById('codigo_peoplesoft').value,
        nombre_equipo: document.getElementById('nombre_equipo').value,
        especificacion_tecnica: document.getElementById('especificacion_tecnica').value,
        lugar: document.getElementById('lugar').value,
        prioridad: document.getElementById('prioridad').value,
        frecuencia: document.getElementById('frecuencia').value,
        ultima_mantencion: document.getElementById('ultima_mantencion').value || null,
        vencimiento_calibracion: document.getElementById('vencimiento_calibracion').value || null,
        existencias_reales: parseInt(document.getElementById('existencias_reales').value),
        existencias_estandar: parseInt(document.getElementById('existencias_estandar').value)
    };

    const { data, error } = await supabase
        .from('equipos_mantencion')
        .insert([nuevoEquipo]);

    if (error) {
        alert("Error al guardar: " + error.message);
    } else {
        alert("Equipo guardado con éxito");
        form.reset();
        cargarEquipos(); // Recargar la tabla
    }
});

// 3. Función para CARGAR y MOSTRAR los equipos (Trazabilidad)
async function cargarEquipos() {
    const { data: equipos, error } = await supabase
        .from('equipos_mantencion')
        .select('*')
        .order('fecha_creacion', { ascending: false });

    if (error) {
        console.error("Error cargando datos:", error);
        return;
    }

    tablaCuerpo.innerHTML = ""; // Limpiar tabla

    equipos.forEach(equipo => {
        // Lógica de Brecha
        const tieneBrecha = equipo.existencias_reales < equipo.existencias_estandar;
        const badgeBrecha = tieneBrecha 
            ? `<span class="text-red-600 font-bold"><i class="fas fa-exclamation-triangle"></i> BRECHA (-${equipo.existencias_estandar - equipo.existencias_reales})</span>`
            : `<span class="text-green-600"><i class="fas fa-check"></i> Stock OK</span>`;

        tablaCuerpo.innerHTML += `
            <tr class="hover:bg-gray-50 border-b">
                <td class="p-4">
                    <div class="font-bold text-blue-800 uppercase">${equipo.nombre_equipo}</div>
                    <div class="text-[10px] text-gray-500">${equipo.codigo_peoplesoft || 'S/N'} | ${equipo.especificacion_tecnica || ''}</div>
                </td>
                <td class="p-4 text-gray-600">${equipo.lugar || 'No asignado'}</td>
                <td class="p-4">
                    <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">${equipo.prioridad} (${equipo.frecuencia})</span>
                </td>
                <td class="p-4">${equipo.ultima_mantencion || 'Pendiente'}</td>
                <td class="p-4 text-xs">${badgeBrecha}</td>
                <td class="p-4">
                    <button onclick="eliminarEquipo('${equipo.id}')" class="text-red-600 hover:text-red-900"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

// 4. Función para ELIMINAR
async function eliminarEquipo(id) {
    if(confirm("¿Estás seguro de eliminar este equipo?")) {
        const { error } = await supabase.from('equipos_mantencion').delete().eq('id', id);
        if (error) alert("Error al eliminar");
        else cargarEquipos();
    }
}

// Iniciar cargando los datos existentes
cargarEquipos();
