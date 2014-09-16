/**
 * Initialize the map.
 */
function initMap() {
    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var overlays = {
        "ECMWF": {
            "windspeed": new L.FLayer.Ecmwf.windSpeed({zIndex: 100}),
            "winddirection": new L.FLayer.Ecmwf.windDirection({zIndex: 200}),
        }
    }
    var minZoom = 2;
    var maxZoom = 10;
    var zoom = 4;
    var lat = 56.0;
    var lon = 12.0;
    var useGeolocation = true;
    var useGeoMetoc = false;
    var useIfmChart = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc, useIfmChart);
}
