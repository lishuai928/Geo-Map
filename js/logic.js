// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

// Create the map with our layers
var map = L.map("map-id", {
  center: [38.88, -120.26],
  zoom: 5,
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create functions to control color and radius
function Color(mag) {
  return mag < 1 ? '#bdf22b':
         mag < 2 ? '#f2eb2b':
         mag < 3 ? '#f2c72b':
         mag < 4 ? '#f2882b':
         mag < 5 ? '#f2502b':
                   '#A11252'; 
}

function Radius(mag) {
  if (mag < 1) return 3;
  if (mag < 2) return 6; 
  if (mag < 3) return 10;
  if (mag < 4) return 15;
  if (mag < 5) return 20;
  return 25;
}

// USGS data url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, function (earthquake) {

  for (feature of earthquake.features) {
    var prop = feature.properties;
    var color = Color(prop.mag);
    // Create a new marker
    var marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      color: "black",
      fillColor: color,
      fillOpacity: 0.75,
      radius: Radius(prop.mag),
      weight: 1,
    }).addTo(map);

    marker.bindPopup(prop.title);
  }
});

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");
  var mags = [0, 1, 2, 3, 4, 5];
  var labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'];

  for (var i = 0; i < mags.length; i++) {
    div.innerHTML +=
      `<i style="background: ${Color(mags[i])}"></i>${labels[i]}<br>`;
  }
  return div;
};
// Add the info legend to the map
info.addTo(map);