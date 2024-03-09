import { obtenerPrecioDolarTarjeta } from './api.js';

function cargarProvincias() {
    fetch('iibbprovincias.json')
        .then(response => response.json())
        .then(data => {
            const selectProvincia = document.getElementById('provincia');
            data.provincias.forEach(provincia => {
                const option = document.createElement('option');
                option.value = provincia.nombre;
                option.textContent = `${provincia.nombre} - ${provincia.iibb}% IIBB`;
                selectProvincia.appendChild(option);
            });

            document.getElementById('calcularImpuestos').addEventListener('click', async function () {
                let valorEnDolares = parseFloat(document.getElementById('valorCompra').value.trim());

                const precioDolarOficial = await obtenerPrecioDolarTarjeta();
                const valorPesosSinImpuestos = valorEnDolares * precioDolarOficial;
                const valorIngresado = valorEnDolares * precioDolarOficial;

                const selectProvincia = document.getElementById('provincia');
                const provinciaSeleccionada = selectProvincia.options[selectProvincia.selectedIndex].value;

                const resultadoImpuestoPaisElemento = document.getElementById('resultadoImpuestoPais');
                const resultadoImpuestoGananciasElemento = document.getElementById('resultadoImpuestoGanancias');
                const resultadoImpuestoIVAElemento = document.getElementById('resultadoImpuestoIVA');
                const resultadoImpuestoIIBBElemento = document.getElementById('resultadoImpuestoIIBB');
                const totalElemento = document.getElementById('total');

                if (!provinciaSeleccionada) {
                    alert("Por favor, selecciona una provincia.");
                    return;
                }

                if (isNaN(valorIngresado) || valorIngresado <= 0) {
                    alert("Por favor, ingresa un valor válido mayor que cero.");
                    return;
                }

                try {
                    const porcentajeIIBB = obtenerPorcentajeIIBB(data, provinciaSeleccionada);

                    const impuestoPais = (valorIngresado * 8) / 100;
                    const impuestoGanancias = (valorIngresado * 30) / 100;
                    const impuestoIVA = (valorIngresado * 20.184) / 100;
                    const impuestoIIBB = (valorIngresado * porcentajeIIBB) / 100;
                    const total = valorPesosSinImpuestos + impuestoPais + impuestoGanancias + impuestoIVA + impuestoIIBB;

                    const impuestoPaisFormateado = impuestoPais.toFixed(2);
                    const impuestoGananciasFormateado = impuestoGanancias.toFixed(2);
                    const impuestoIVAFormateado = impuestoIVA.toFixed(2);
                    const impuestoIIBBFormateado = impuestoIIBB.toFixed(2);
                    const totalFormateado = total.toLocaleString('es-AR', {
                        style: 'currency',
                        currency: 'ARS'
                    });

                    resultadoImpuestoPaisElemento.innerText = `$${impuestoPaisFormateado}`;
                    resultadoImpuestoGananciasElemento.innerText = `$${impuestoGananciasFormateado}`;
                    resultadoImpuestoIVAElemento.innerText = `$${impuestoIVAFormateado}`;
                    resultadoImpuestoIIBBElemento.innerText = `$${impuestoIIBBFormateado}`;
                    totalElemento.innerText = totalFormateado;

                    document.getElementById('resultadosContainer').style.display = 'block';
                    document.getElementById('resultadoTotal').style.display = 'block';

                    if (window.innerWidth <= 768) {
                        const invitarBoton = document.getElementById('invitarBoton');
                        const computedStyles = getComputedStyle(invitarBoton);
                        const marginBottom = parseInt(computedStyles.marginBottom);
                        const newMarginBottom = marginBottom + 20;
                        invitarBoton.style.marginBottom = `${newMarginBottom}px`;
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });
        })
        .catch(error => console.error('Error al cargar las provincias:', error));
}

function obtenerPorcentajeIIBB(data, provinciaSeleccionada) {
    const provincia = data.provincias.find(provincia => provincia.nombre === provinciaSeleccionada);
    return provincia ? provincia.iibb : 0;
}

document.addEventListener('DOMContentLoaded', function () {
    cargarProvincias();
});
