let isFormOpen = false; // Flag to check if the form is open
let markers = []; // Array to store marker data

// Load map button functionality
document.getElementById('loadMap').addEventListener('click', () => {
    const mapUrl = document.getElementById('mapUrl').value.trim();
    const mapImage = document.getElementById('mapImage');

    if (mapUrl) {
        mapImage.src = mapUrl; // Set the new image source
        mapImage.style.display = 'none'; // Initially hide the image until loaded
        mapImage.onload = () => {
            document.getElementById('placeholder').style.display = 'none'; // Hide the placeholder
            mapImage.style.display = 'block'; // Show the image once loaded
        };
        mapImage.onerror = () => {
            alert('Could not load the map image. Please check the URL.');
        };
    } else {
        alert('Please enter a valid map URL.');
    }
});

// Map area and target tool setup
const mapArea = document.getElementById('mapArea');
const targetTool = document.getElementById('locationTarget');

// Toggle the active state of the location target button
targetTool.addEventListener('click', () => {
    targetTool.classList.toggle('active');
    targetTool.innerText = targetTool.classList.contains('active') ? 'Cancel' : 'Set A Location';
    mapArea.style.cursor = targetTool.classList.contains('active') ? 'crosshair' : 'default';
    isFormOpen = false; // Reset form state when toggling the target mode
});

// Show location form on map click
mapArea.addEventListener('click', (e) => {
    if (targetTool.classList.contains('active') && !isFormOpen) {
        const rect = mapImage.getBoundingClientRect();
        const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

        showLocationForm(xPercent, yPercent);
    }
});

// Show the location form with percentage-based coordinates
function showLocationForm(xPercent, yPercent, title = '', imageUrl = '', details = '') {
    if (isFormOpen) return;

    isFormOpen = true;

    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';

    const titleInput = document.createElement('input');
    titleInput.placeholder = "Enter location title";
    titleInput.className = 'form-input';
    titleInput.value = title;
    formContainer.appendChild(titleInput);

    const imageInput = document.createElement('input');
    imageInput.placeholder = "Enter image URL (optional)";
    imageInput.className = 'form-input';
    imageInput.value = imageUrl;
    formContainer.appendChild(imageInput);

    const detailsInput = document.createElement('textarea');
    detailsInput.placeholder = "Enter location details";
    detailsInput.className = 'form-input';
    detailsInput.value = details;
    formContainer.appendChild(detailsInput);

    const cancelButton = document.createElement('button');
    cancelButton.innerText = "Cancel";
    cancelButton.addEventListener('click', () => {
        formContainer.remove();
        isFormOpen = false;
        targetTool.classList.remove('active');
        targetTool.innerText = 'Set A Location';
        mapArea.style.cursor = 'default';
    });
    formContainer.appendChild(cancelButton);

    const addButton = document.createElement('button');
    addButton.innerText = "Add to Map";
    addButton.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const imageUrl = imageInput.value.trim();
        const details = detailsInput.value.trim();

        if (title) {
            addMarker(xPercent, yPercent, title, imageUrl, details);
            formContainer.remove();
            isFormOpen = false;
            targetTool.classList.remove('active');
            targetTool.innerText = 'Set A Location';
            mapArea.style.cursor = 'default';
        } else {
            alert('Please enter a location name.');
        }
    });
    formContainer.appendChild(addButton);

    formContainer.style.left = `${xPercent}%`;
    formContainer.style.top = `${yPercent}%`;
    formContainer.style.position = 'absolute';

    mapArea.appendChild(formContainer);
}

// Add marker using percentage-based positions
function addMarker(xPercent, yPercent, title, imageUrl, details) {
    const marker = document.createElement('div');
    marker.className = 'marker';
    marker.style.left = `${xPercent}%`;
    marker.style.top = `${yPercent}%`;
    marker.style.transform = 'translate(-50%, -50%)';
    marker.innerText = title;

    marker.onclick = function (e) {
        e.stopPropagation();
        // Get the coordinates of the marker click
        const rect = mapImage.getBoundingClientRect();
        const markerX = e.clientX - rect.left;
        const markerY = e.clientY - rect.top;

        // Show location details at the click position
        showLocationDetails(markerX, markerY, title, imageUrl, details);
    };

    markers.push({ title, imageUrl, details, xPercent, yPercent });
    mapArea.appendChild(marker);
}

// Show location details at click position
function showLocationDetails(clientX, clientY, title, imageUrl, details) {
    // Remove any existing detail boxes before creating a new one
    const existingDetailBox = document.querySelector('.location-details-box');
    if (existingDetailBox) {
        existingDetailBox.remove();
    }

    const detailBox = document.createElement('div');
    detailBox.className = 'location-details-box';

    const titleElement = document.createElement('h3');
    titleElement.innerText = title;
    detailBox.appendChild(titleElement);

    if (imageUrl) {
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.style.width = '300px';
        imgElement.alt = title;
        detailBox.appendChild(imgElement);
    }

    const detailsElement = document.createElement('p');
    detailsElement.innerText = details;
    detailBox.appendChild(detailsElement);

    const exitButton = document.createElement('button');
    exitButton.innerText = 'Close';
    exitButton.addEventListener('click', () => {
        detailBox.remove();
    });
    detailBox.appendChild(exitButton);

    // Position the detail box based on click coordinates
    detailBox.style.position = 'absolute';
    detailBox.style.left = `${clientX + 10}px`; // Add some offset from click position
    detailBox.style.top = `${clientY}px`; // Align with the click position

    // Append the detail box to the map area (not the body)
    mapArea.appendChild(detailBox);
}

// Generate the widget code
document.getElementById('doneButton').addEventListener('click', () => {
    const mapImage = document.getElementById('mapImage');
    const mapUrl = mapImage.src;

    if (!mapUrl) {
        alert('Please load a map first.');
        return;
    }

    let widgetContent = `
<div class="widget" style="display: flex; flex-direction: column; font-family: Arial, sans-serif; background: #f5f2e8; border: 2px solid #8c7b6b; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);">
    <div class="map-container" style="position: relative; width: 100%; flex: 1;">
        <img id="mapImageWidget" src="${mapUrl}" alt="Map" style="width: 100%; height: auto; display: block; object-fit: contain;" />
        <div class="markers-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">`;

    markers.forEach(marker => {
        widgetContent += `
            <div class="widget-marker" style="position: absolute; left: ${marker.xPercent}%; top: ${marker.yPercent}%; transform: translate(-50%, -50%); cursor: pointer; background: rgba(255, 255, 255, 0.9); padding: 5px; border-radius: 5px; pointer-events: auto; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);" 
                onclick="showLocationDetails('${marker.title}', '${marker.imageUrl}', '${marker.details}', event)">
                ${marker.title}
            </div>`;
    });

    widgetContent += `
        </div>
    </div>
</div>
<style>
    /* Make the widget layout responsive */
    .widget {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .map-container {
        width: 100%;
    }
    .location-details-box {
        position: absolute;
        background: #f5f2e8;
        padding: 15px;
        border-radius: 10px;
        border: 2px solid #8c7b6b;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        max-width: 300px;
        z-index: 1000;
    }
    .location-details-box img {
        width: 100%;
        border-radius: 5px;
        margin-bottom: 10px;
    }
    .location-details-box button {
        display: block;
        width: 100%;
        margin-top: 10px;
        padding: 5px;
        background-color: #8c7b6b;
        color: #f7eee0;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .location-details-box button:hover {
        background-color: #705f50;
    }
    @media (max-width: 768px) {
        .widget {
            flex-direction: column;
        }
    }
</style>
<script>
    function showLocationDetails(title, imageUrl, details, event) {
        // Remove any existing detail boxes before creating a new one
        const existingDetailBox = document.querySelector('.location-details-box');
        if (existingDetailBox) {
            existingDetailBox.remove();
        }

        // Create a new detail box
        const detailBox = document.createElement('div');
        detailBox.className = 'location-details-box';

        // Add title
        const titleElement = document.createElement('h3');
        titleElement.style.margin = '0 0 5px';
        titleElement.style.color = '#4c4234';
        titleElement.style.textAlign = 'center';
        titleElement.textContent = title;
        detailBox.appendChild(titleElement);

        // Add image if available
        if (imageUrl) {
            const imageElement = document.createElement('img');
            imageElement.src = imageUrl;
            imageElement.alt = title;
            imageElement.style.width = '100%';
            imageElement.style.borderRadius = '5px';
            imageElement.style.marginBottom = '10px';
            detailBox.appendChild(imageElement);
        }

        // Add details
        const detailsElement = document.createElement('p');
        detailsElement.style.margin = '0';
        detailsElement.style.color = '#4a3c2f';
        detailsElement.textContent = details;
        detailBox.appendChild(detailsElement);

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.addEventListener('click', () => {
            detailBox.remove();
        });
        detailBox.appendChild(closeButton);

        // Position the detail box at the marker location relative to the map container
        const mapContainer = document.querySelector('.map-container');
        detailBox.style.left = \`\${event.clientX - mapContainer.getBoundingClientRect().left}px\`;
        detailBox.style.top = \`\${event.clientY - mapContainer.getBoundingClientRect().top}px\`;

        // Append the detail box to the map container
        mapContainer.appendChild(detailBox);
    }
</script>`;

    const codeOutput = document.getElementById('codeOutput');
    const generatedCode = document.getElementById('generatedCode');
    generatedCode.value = widgetContent;
    codeOutput.style.display = 'block';
});
