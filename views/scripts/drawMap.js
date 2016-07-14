var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

var map = L.map('map').setView([25.7617,-80.18], 10);
L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18
    }).addTo(map);