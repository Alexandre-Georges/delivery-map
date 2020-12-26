let map = null;
let polygon = null;
let markerLocation = null;
let marker = null;

function set_address(address) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode(
    { address: address },
    (results, status) => {
    if (status == 'OK') {
      // map.setCenter(results[0].geometry.location);
      if (marker) {
        marker.setMap(null);
      }
      markerLocation = results[0].geometry.location;
      marker = new google.maps.Marker({
          map: map,
          position: markerLocation,
      });
      updateIsInPolygon();
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function updateIsInPolygon() {
  if (markerLocation && polygon) {
    const isInPolygon = google.maps.geometry.poly.containsLocation(markerLocation, polygon);
    document.getElementById('is-in-polygon').innerHTML = isInPolygon ? 'Yes' : 'No';
  }
}

function submit_form(e) {
  e.preventDefault();
  submit_address();
}

function submit_address() {
  const search = document.getElementById('search-field').value;
  set_address(search);
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 49.2382965, lng: -123.101501 },
    zoom: 12,
  });
  const bounds = [
    { lat: 49.23827, lng: -123.2 },
    { lat: 49.23827, lng: -123.1 },
    { lat: 49.3, lng: -123.1 },
    { lat: 49.3, lng: -123.2 },
  ];
  polygon = new google.maps.Polygon({
    paths: bounds,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    editable: true,
  });

  polygon.setMap(map);
  google.maps.event.addListener(polygon.getPath(), 'insert_at', function() {
    updateIsInPolygon();
  });
  google.maps.event.addListener(polygon.getPath(), 'remove_at', function() {
    updateIsInPolygon();
  });
  google.maps.event.addListener(polygon.getPath(), 'set_at', function() {
    updateIsInPolygon();
  });
  google.maps.event.addListener(polygon.getPath(), 'dragstart', function() {
    updateIsInPolygon();
  });
  google.maps.event.addListener(polygon.getPath(), 'drag', function() {
    updateIsInPolygon();
  });
  google.maps.event.addListener(polygon.getPath(), 'dragend', function() {
    updateIsInPolygon();
  });
}

window.addEventListener('load', () => {
  const form = document.getElementById('form');
  form.addEventListener('submit', submit_form);
});