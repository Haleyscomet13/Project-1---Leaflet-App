document.addEventListener("DOMContentLoaded", function () {
  const map = L.map("map").setView([38.6270, -90.1994], 12);

  // Use ArcGIS as the basemap
  L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
  }).addTo(map);

  const addGeoJSONLayer = async (url, layerName, popupField) => {
    const response = await fetch(url);
    const data = await response.json();
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        // Use a custom icon for schools
        if (layerName === "St_Louis_Public_Schools") {
          return L.marker(latlng, {
            icon: L.icon({
              iconUrl: 'https://cdn0.iconfinder.com/data/icons/education-22/48/graduation-cap-1024.png', // School icon URL
              iconSize: [25, 25], // Icon size
              iconAnchor: [12, 12] // Anchor point
            })
          });
        } else {
          // Use default styling for other layers (e.g., parks)
          return L.geoJSON(data);
        }
      },
      onEachFeature: function (feature, layer) {
        const popupContent = `<h4>${layerName}</h4><p>${feature.properties[popupField]}</p>`;
        layer.bindPopup(popupContent);
      }
    }).addTo(map);
  };

  // URLs for the feature layers
  const schoolLayerURL = "https://services5.arcgis.com/vElyTHUSDMtSHSgT/arcgis/rest/services/St_Louis_Public_Schools/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=true&f=geojson";
  const parkLayerURL = "https://services2.arcgis.com/bB9Y1bGKerz1PTl5/arcgis/rest/services/STL_parks_TBP/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=true&f=geojson";

  // Add GeoJSON layers with customized symbology and popups
  addGeoJSONLayer(schoolLayerURL, "St_Louis_Public_Schools", "School_Nam");
  addGeoJSONLayer(parkLayerURL, "STL_parks_TBP", "TEXT_");
});
