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
        showLocationDetails(title, imageUrl, details, xPercent, yPercent);
    };

    markers.push({ title, imageUrl, details, xPercent, yPercent });
    mapArea.appendChild(marker);
}

// Show location details at click position
function showLocationDetails(title, imageUrl, details, x, y) {
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

    // Position detailBox relative to the clicked position
    const rect = mapImage.getBoundingClientRect();
    detailBox.style.position = 'absolute';
    detailBox.style.left = `${rect.left + x}px`;
    detailBox.style.top = `${rect.top + y}px`;

    document.body.appendChild(detailBox);
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
<div class="widget" style="display: flex; font-family: Arial, sans-serif; background: #f5f2e8; border: 2px solid #8c7b6b; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);">
    <div class="map-container" style="position: relative; width: 60%; border-right: 2px solid #8c7b6b;">
        <img id="mapImageWidget" src="${mapUrl}" alt="Map" style="width: 100%; height: auto; display: block; object-fit: contain;" />
        <div class="markers-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">`;

    markers.forEach(marker => {
        widgetContent += `
            <div class="widget-marker" style="position: absolute; left: ${marker.xPercent}%; top: ${marker.yPercent}%; transform: translate(-50%, -50%); cursor: pointer; background: rgba(255, 255, 255, 0.9); padding: 5px; border-radius: 5px; pointer-events: auto; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);" 
                onclick="showLocationDetails('${marker.title}', '${marker.imageUrl}', '${marker.details}')">
                ${marker.title}
            </div>`;
    });

    widgetContent += `
        </div>
    </div>
    <div class="sidebar" style="width: 40%; padding: 20px; border-left: 2px solid #8c7b6b; background-color: #ac9f84; border-radius: 0 10px 10px 0; position: relative;">
        <h2 style="margin-top: 0; color: #f7eee0; border-bottom: 2px solid #8c7b6b; padding-bottom: 10px; background-color: #291c0a; border-radius: 5px; padding: 10px; text-align: center;">Location Details</h2>
        <div id="locationDetails" style="margin-top: 10px; color: #4a3c2f; font-size: 14px; padding: 10px; border-radius: 5px; background-color: efe0cb; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); min-height: 150px;">Select a marker to view details</div>
        <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 5px; background: #8c7b6b;"></div>
    </div>
</div>
<script>
    function showLocationDetails(title, imageUrl, details) {
        const detailsContainer = document.getElementById('locationDetails');
        detailsContainer.innerHTML = '<h3 style="margin-bottom: 5px; color: #f7eee0; background-color: #4c4234; padding: 10px; border-radius: 5px; text-align: center;">' + title + '</h3>' + 
        (imageUrl ? '<div style="text-align: center;"><img src="' + imageUrl + '" style="height:300px; border-radius: 4px; margin-bottom: 10px;" alt="' + title + '" /></div>' : '') +
        '<p>' + details + '</p>';
    }
</script>`;

    const codeOutput = document.getElementById('codeOutput');
    const generatedCode = document.getElementById('generatedCode');
    generatedCode.value = widgetContent;
    codeOutput.style.display = 'block';
});
