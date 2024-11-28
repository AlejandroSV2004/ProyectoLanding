const databaseURL = 'https://proylanding-default-rtdb.firebaseio.com/mundomascota2.json'

let ready = () => {
    console.log('DOM está listo');
    getData();
};

let getData = async () => {  

    try {
        const response = await fetch(databaseURL, { method: 'GET' });
        if (!response.ok) {
            alert('Error al obtener datos.');
            return;
        }

        const data = await response.json();

        if (data != null) {
            petTableBody.innerHTML = ''; // Limpia la tabla antes de llenarla
            let index = 1;

            for (let key in data) {
                const { nombremascota, tipomascota } = data[key];
                
                // Crear fila dinámica
                let rowTemplate = `
                    <tr>
                        <th>${index}</th>
                        <td>${nombremascota}</td>
                        <td>${tipomascota}</td>
                    </tr>`;
                
                petTableBody.innerHTML += rowTemplate;
                index++;
            }
        }
    } catch (error) {
        alert('Error al procesar datos.');
        console.error(error);
    }

}

let sendData = (form) => {
    // Obtén los datos del formulario
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()); // Convierte FormData a objeto
    data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' });

    fetch(databaseURL, {
        method: 'POST', // Método de la solicitud
        headers: {
            'Content-Type': 'application/json', // Especifica que los datos están en formato JSON
        },
        body: JSON.stringify(data), // Convierte los datos a JSON
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json(); // Procesa la respuesta como JSON
        })
        .then((result) => {
            alert('¡Gracias! Tus datos fueron enviados exitosamente.');
            form.reset();
            getData()
        })
        .catch((error) => {
            alert('Ocurrió un error al enviar los datos. Intenta de nuevo.');
            console.error(error);
        });
};

let loaded = () => {
    let myform = document.getElementById('form');

    myform.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault();

        const emailElements = document.querySelectorAll('.form-control-lg');
        let allValid = true;

        emailElements.forEach((emailElement) => {
            const emailText = emailElement.value;

            if (emailText.length === 0) {
                emailElement.animate(
                    [
                        { transform: 'translateX(0)' },
                        { transform: 'translateX(50px)' },
                        { transform: 'translateX(-50px)' },
                        { transform: 'translateX(0)' },
                    ],
                    {
                        duration: 400,
                        easing: 'linear',
                    }
                );
                emailElement.focus();
                allValid = false;
            }
        });

        if (allValid) {
            sendData(myform);
        }
    });
};

window.addEventListener('DOMContentLoaded', ready);
window.addEventListener('load', loaded);