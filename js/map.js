// Polyfill untuk memastikan fungsi .remove() tersedia
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

function flyToStore(currentFeature) {
    map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 15.5
    });
}

// Fungsi untuk melakukan zoom ke lokasi saat mengklik node
function flyToDepartmentLocation(result) {
    var departmentName = result.attributes.nama_departement.toLowerCase().trim();
    var departmentLocation = lokasiCoordinates[departmentName];

    if (departmentLocation) {
        map.flyTo({
            center: departmentLocation,
            zoom: 12
        });

        createPopUp(departmentLocation, result.attributes.nama_departement);
    } else {
        console.log("Lokasi departemen tidak ditemukan! Departemen yang dicari: " + result.attributes.nama_departement);
    }
}



// Fungsi untuk membuat popup yang muncul saat lokasi departemen di-klik
function createPopUp(location, departmentName) {
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove(); // Hapus popup lama jika ada

    var popup = new mapboxgl.Popup({closeOnClick: false})
        .setLngLat(location)
        .setHTML('<h3>' + departmentName + '</h3>')
        .addTo(map);
}

// Menangani hasil klik node departemen di Popoto
popoto.result.onResultReceived(function(resultObjects) {
    resultObjects.forEach(function(result) {
        // Pastikan kita memanggil fungsi flyToDepartmentLocation saat departemen di-klik
        flyToDepartmentLocation(result);
    });
});

// Fungsi untuk menangani klik pada fitur tertentu
function flyToResult(result) {
    map.flyTo({
        center: [result.attributes.longitude, result.attributes.latitude],
        zoom: 20
    });
}

function createPopUp(currentFeature) {
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    // Check if there is already a popup on the map and if so, remove it
    if (popUps[0]) popUps[0].remove();

    var popup = new mapboxgl.Popup({closeOnClick: false})
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML('<h3>' + currentFeature.properties.name + '</h3>' +
            '<h4>' + currentFeature.properties.address + '</h4>')
        .addTo(map);
}

// Fungsi untuk menghitung bounds dari GeoJSON
function computeBounds(geojson) {
    var coordinates = geojson.features.map(function (feature) {
        return feature.geometry.coordinates;
    });
    return coordinates.reduce(function (bounds, coord) {
        return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
}

// Menangani klik departemen
function handleDepartmentClick(result) {
    var departmentLocation = lokasiCoordinates[result.attributes.nama_departement];

    if (departmentLocation) {
        map.flyTo({
            center: departmentLocation,
            zoom: 12
        });

        // Optionally add a popup or other logic
        createPopUp({
            geometry: { coordinates: departmentLocation },
            properties: { name: result.attributes.nama_departement, address: "Sample Address" }
        });
    }
}

// Event listener untuk menangani klik pada hasil Popoto
popoto.result.onResultReceived(function (resultObjects) {
    resultObjects.forEach(function(result) {
        handleDepartmentClick(result);
    });
});
