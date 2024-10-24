let isFormOpen = false; // Flag to check if the form is open
let markers = []; // Array to store marker data

// Load map button functionality
document.getElementById('loadMap').addEventListener('click', () => {
    const mapUrl = document.getElementById('mapUrl').value;
    const mapImage = document.getElementById('mapImage');
    mapImage.src = mapUrl;
    mapImage.style.display = 'block'; // Show the map image once loaded
});

const mapImage = document.getElementById('mapImage');
const placeholder = document.getElementById('placeholder');

// Example: Set the map image source
mapImage.src = 'path/to/your/map/image.jpg'; // Change this to your actual image path

// When the image loads, hide the placeholder and show the image
mapImage.onload = function() {
    placeholder.style.display = 'none'; // Hide the placeholder
    mapImage.style.display = 'block'; // Show the image
};


// Map area and target tool setup
const mapArea = document.getElementById('mapArea');
const targetTool = document.getElementById('locationTarget');

// Toggle the active state of the location target button
targetTool.addEventListener('click', () => {
    targetTool.classList.toggle('active');
    targetTool.innerText = targetTool.classList.contains('active') ? 'Cancel' : 'Set A Location';
    isFormOpen = false; // Reset form state when toggling the target mode
});

// Show location form on map click
mapArea.addEventListener('click', (e) => {
    if (targetTool.classList.contains('active') && !isFormOpen) {
        // Get the map image's bounding rectangle
        const mapImage = document.getElementById('mapImage');
        const rect = mapImage.getBoundingClientRect();

        // Calculate the x and y coordinates relative to the image
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        showLocationForm(x, y);
    }
});

// Show the location form
function showLocationForm(x, y, title = '', imageUrl = '', details = '') {
    if (isFormOpen) return; // Prevent multiple forms

    isFormOpen = true; // Set the form open flag to true

    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';

    // Create title input
    const titleInput = document.createElement('input');
    titleInput.placeholder = "Enter location title";
    titleInput.className = 'form-input';
    titleInput.value = title;
    formContainer.appendChild(titleInput);

    // Create image URL input
    const imageInput = document.createElement('input');
    imageInput.placeholder = "Enter image URL (optional)";
    imageInput.className = 'form-input';
    imageInput.value = imageUrl;
    formContainer.appendChild(imageInput);

    // Create details input
    const detailsInput = document.createElement('textarea');
    detailsInput.placeholder = "Enter location details";
    detailsInput.className = 'form-input';
    detailsInput.value = details;
    formContainer.appendChild(detailsInput);

    // Create buttons
    const cancelButton = document.createElement('button');
    cancelButton.innerText = "Cancel";
    cancelButton.addEventListener('click', () => {
        formContainer.remove();
        isFormOpen = false;
        targetTool.classList.remove('active');
        targetTool.innerText = 'Location Target';
    });
    formContainer.appendChild(cancelButton);

    const addButton = document.createElement('button');
    addButton.innerText = "Add to Map";
    addButton.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const imageUrl = imageInput.value.trim();
        const details = detailsInput.value.trim();

        if (title) {
            addMarker(x, y, title, imageUrl, details);
            formContainer.remove();
            isFormOpen = false;
            targetTool.classList.remove('active');
            targetTool.innerText = 'Location Target';
        }
    });
    formContainer.appendChild(addButton);

    formContainer.style.left = `${x}px`;
    formContainer.style.top = `${y}px`;
    formContainer.style.position = 'absolute';

    mapArea.appendChild(formContainer);
}

// Add marker to the map
function addMarker(x, y, title, imageUrl, details) {
    const marker = document.createElement('div');
    marker.className = 'marker';
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    marker.innerText = title;

    marker.onclick = function () {
        showLocationDetails(title, imageUrl, details, marker, x, y);
    };

    markers.push({ title, imageUrl, details, x, y });
    mapArea.appendChild(marker);
}

function showLocationDetails(title, imageUrl, details, markerElement, x, y) {
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

    // Edit button to show the form again
    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => {
        showLocationForm(x, y, title, imageUrl, details);
        detailBox.remove();
    });
    detailBox.appendChild(editButton);

    // Close button to remove the detail box
    const exitButton = document.createElement('button');
    exitButton.innerText = 'Close';
    exitButton.addEventListener('click', () => {
        detailBox.remove();
    });
    detailBox.appendChild(exitButton);

    // Position detailBox based on marker's position
    const mapImage = document.getElementById('mapImage');
    const rect = mapImage.getBoundingClientRect();
    detailBox.style.position = 'absolute';
    detailBox.style.left = `${x + rect.left}px`; // Correct position based on image
    detailBox.style.top = `${y + rect.top}px`; // Correct position based on image

    // Ensure detail box doesn't go off-screen
    if (parseInt(detailBox.style.left) + detailBox.offsetWidth > window.innerWidth) {
        detailBox.style.left = `${window.innerWidth - detailBox.offsetWidth - 10}px`;
    }
    if (parseInt(detailBox.style.top) + detailBox.offsetHeight > window.innerHeight) {
        detailBox.style.top = `${window.innerHeight - detailBox.offsetHeight - 10}px`;
    }

    // Append the detail box to the body
    document.body.appendChild(detailBox);
}



// Handle the "I am done" button click
document.getElementById('doneButton').addEventListener('click', () => {
    const mapImage = document.getElementById('mapImage');
    const mapUrl = mapImage.src;

    const originalWidth = mapImage.naturalWidth;
    const originalHeight = mapImage.naturalHeight;

    let widgetContent = `
    <div class="widget" style="display: flex; font-family: Arial, sans-serif; background: #f5f2e8; border: 2px solid #8c7b6b; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);">
        <div class="map-container" style="position: relative; width: 60%; border-right: 2px solid #8c7b6b;">
            <img id="mapImageWidget" src="${mapUrl}" alt="Map" style="width: 100%; height: auto; display: block;" />
            <div class="markers-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">`;

    markers.forEach(marker => {
        // Fine-tune calculations to align markers correctly
        const left = (marker.x / originalWidth) * 100; // Convert to percentage
        const top = (marker.y / originalHeight) * 100; // Convert to percentage

        widgetContent += `
            <div class="widget-marker" style="position: absolute; left: ${left}%; top: ${top}%; transform: translate(-50%, -50%); cursor: pointer; background: rgba(255, 255, 255, 0.9); padding: 5px; border-radius: 5px; pointer-events: auto; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);"
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
    codeOutput.innerHTML = `
        <h2>Copy this code:</h2>
        <textarea style="width: 100%; height: 200px;">${widgetContent}</textarea>`;
    codeOutput.style.display = 'block';

    markers = [];
    isFormOpen = false;
});

