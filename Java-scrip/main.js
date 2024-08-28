// Array para almacenar los recursos
let resources = [];

// Selecciona los elementos del DOM
const resourceForm = document.getElementById('resourceForm');
const resourceList = document.getElementById('resourceList');

// Función para cargar recursos desde el localStorage
function loadResources() {
    const storedResources = localStorage.getItem('resources');
    if (storedResources) {
        resources = JSON.parse(storedResources);
        renderResources();
    }
}

// Función para guardar recursos en el localStorage
function saveResources() {
    localStorage.setItem('resources', JSON.stringify(resources));
}

// Función para renderizar la lista de recursos
function renderResources() {
    resourceList.innerHTML = '';
    resources.forEach((resource, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';

        // Determinar el porcentaje de la barra de progreso basado en el estado
        let progressValue = 0;
        if (resource.state === 'en-progreso') {
            progressValue = 50;
        } else if (resource.state === 'terminado') {
            progressValue = 100;
        }

        li.innerHTML = `
            <div class="card mb-4 shadow-lg border-0 rounded-lg animate__animated animate__fadeIn">
                <div class="row g-0">
                    <div class="col-md-4 d-flex align-items-center justify-content-center bg-light rounded-start">
                        <div class="text-center p-4">
                            <h5 class="card-title text-primary fw-bold">${resource.title}</h5>
                            <p class="card-text"><span class="badge bg-primary text-capitalize">${resource.gender}</span></p>
                            <p class="card-text"><strong>Plataforma:</strong> ${resource.plataform}</p>
                            <p class="card-text"><strong>Formato:</strong> ${resource.format}</p>
                            <p class="card-text"><strong>Fecha:</strong> ${resource.date}</p>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                    <p class="card-text mb-1"><strong>Estado:</strong> ${formatState(resource.state)}</p>
                                    <div class="progress" role="progressbar" aria-label="Progreso" aria-valuenow="${progressValue}" aria-valuemin="0" aria-valuemax="100">
                                        <div class="progress-bar progress-bar-striped ${getProgressBarClass(resource.state)}" style="width: ${progressValue}%"></div>
                                    </div>
                                </div>
                                <div>
                                    ${renderStars(resource.rating)}
                                </div>
                            </div>
                            <p class="card-text mt-3"><strong>Reseña:</strong></p>
                            <p class="card-text">${resource.review || 'Sin reseña disponible.'}</p>
                            <div class="d-flex justify-content-end mt-3">
                                <button class="btn btn-sm btn-outline-warning me-2" onclick="editResource(${index})">Editar</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteResource(${index})">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        resourceList.appendChild(li);
    });
}

// Función para formatear el estado con texto capitalizado
function formatState(state) {
    switch(state) {
        case 'en-progreso':
            return 'En Progreso';
        case 'terminado':
            return 'Terminado';
        case 'pendiente':
            return 'Pendiente';
        default:
            return state;
    }
}

// Función para obtener la clase de la barra de progreso según el estado
function getProgressBarClass(state) {
    switch(state) {
        case 'en-progreso':
            return 'bg-info';
        case 'terminado':
            return 'bg-success';
        case 'pendiente':
            return 'bg-secondary';
        default:
            return 'bg-secondary';
    }
}

function isValidEndDate(date) {
    if (!date) return true;
    const today = new Date();
    const endDate = new Date(date);
    return endDate <= today;
}

// Función para añadir un recurso
resourceForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const gender = document.getElementById('gender').value;
    const plataform = document.getElementById('plataform').value;
    const format = document.getElementById('format').value;
    const date = document.getElementById('date').value;
    const state = document.getElementById('state').value;
    const review = document.getElementById('review').value;

    if (!isValidEndDate(date)) {
        alert('La fecha de terminación no puede ser una fecha futura.');
        return;
    }

    const resource = { 
        title, 
        gender, 
        plataform, 
        format, 
        date, 
        state, 
        rating: selectedRating,
        review
    };
    resources.push(resource);

    renderResources();
    saveResources(); // Guardar en localStorage
    resourceForm.reset();
    updateStarRating(0); // Reinicia las estrellas
    selectedRating = 0;
});

// Función para eliminar un recurso
function deleteResource(index) {
    resources.splice(index, 1);
    renderResources();
    saveResources(); // Guardar cambios en localStorage
}

// Función para editar un recurso
function editResource(index) {
    const resource = resources[index];
    document.getElementById('title').value = resource.title;
    document.getElementById('gender').value = resource.gender;
    document.getElementById('plataform').value = resource.plataform;
    document.getElementById('format').value = resource.format;
    document.getElementById('date').value = resource.date;
    document.getElementById('state').value = resource.state;
    document.getElementById('review').value = resource.review || '';
    selectedRating = resource.rating;
    updateStarRating(selectedRating);

    resources.splice(index, 1);
    renderResources();
    saveResources(); // Guardar cambios en localStorage
}

let selectedRating = 0; // Variable para almacenar la valoración seleccionada

// Añadir un Event Listener para cada estrella en el formulario
document.querySelectorAll('#rating .star').forEach(star => {
    star.addEventListener('click', function() {
        selectedRating = parseInt(this.getAttribute('data-value'));
        updateStarRating(selectedRating);
    });
});

// Función para actualizar el estado de las estrellas en el formulario
function updateStarRating(rating) {
    document.querySelectorAll('#rating .star').forEach(star => {
        if (parseInt(star.getAttribute('data-value')) <= rating) {
            star.classList.add('text-warning');
            star.classList.remove('text-muted');
        } else {
            star.classList.add('text-muted');
            star.classList.remove('text-warning');
        }
    });
}

// Función para renderizar las estrellas de la valoración en las tarjetas
function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star fs-5 ${i <= rating ? 'text-warning' : 'text-muted'}">&#9733;</span>`;
    }
    return stars;
}

const filterForm = document.getElementById('filterForm');
const filterState = document.getElementById('filterState');
const filterFormat = document.getElementById('filterFormat');
const filterPlataform = document.getElementById('filterPlataform');
const searchTitle = document.getElementById('searchTitle');

filterForm.addEventListener('submit', function(event) {
    event.preventDefault();
    filterResources();
});

function filterResources() {
    const filteredResources = resources.filter(resource => {
        const stateMatch = filterState.value === '' || resource.state === filterState.value;
        const formatMatch = filterFormat.value === '' || resource.format === filterFormat.value;
        const plataformMatch = filterPlataform.value === '' || resource.plataform === filterPlataform.value;
        const titleMatch = resource.title.toLowerCase().includes(searchTitle.value.toLowerCase());

        return stateMatch && formatMatch && plataformMatch && titleMatch;
    });

    renderFilteredResources(filteredResources);
}

function renderFilteredResources(filteredResources) {
    resourceList.innerHTML = '';
    filteredResources.forEach((resource, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';

        // Determinar el porcentaje de la barra de progreso basado en el estado
        let progressValue = 0;
        if (resource.state === 'en-progreso') {
            progressValue = 50;
        } else if (resource.state === 'terminado') {
            progressValue = 100;
        }

        li.innerHTML = `
        <div class="card mb-3 shadow-sm">
            <div class="row g-0">
                <div class="col-md-4 d-flex align-items-center justify-content-center bg-light">
                    <div class="text-center p-3">
                        <h5 class="card-title">${resource.title}</h5>
                        <p class="card-text"><span class="badge bg-secondary text-capitalize">${resource.gender}</span></p>
                        <p class="card-text"><strong>Plataforma:</strong> ${resource.plataform}</p>
                        <p class="card-text"><strong>Formato:</strong> ${resource.format}</p>
                        <p class="card-text"><strong>Fecha:</strong> ${resource.date}</p>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <p class="card-text mb-1"><strong>Estado:</strong> ${formatState(resource.state)}</p>
                                <div class="progress" role="progressbar" aria-label="Progreso" aria-valuenow="${progressValue}" aria-valuemin="0" aria-valuemax="100">
                                    <div class="progress-bar progress-bar-striped ${getProgressBarClass(resource.state)}" style="width: ${progressValue}%"></div>
                                </div>
                            </div>
                            <div>
                                ${renderStars(resource.rating)}
                            </div>
                        </div>
                        <p class="card-text mt-3"><strong>Reseña:</strong></p>
                        <p class="card-text">${resource.review || 'Sin reseña disponible.'}</p>
                        <div class="d-flex justify-content-end mt-3">
                            <button class="btn btn-sm btn-warning me-2" onclick="editResource(${index})">Editar</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteResource(${index})">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Función para obtener la clase de la barra de progreso según el estado
function getProgressBarClass(state) {
    return 'bg-primary'; // Siempre devolverá azul
}

    
    
    resourceList.appendChild(li);
});
}
// Cargar los recursos cuando se carga la página
window.onload = loadResources;
