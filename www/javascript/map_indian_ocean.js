/**
 * Initialize the map.
 */
function initMap() {
    var langs = ['da', 'en'];
    var basemap = "Mapquest Open";
    var overlays = {
        "currentspeed": new L.FLayer.currentSpeed({}),
        "currentdirection": new L.FLayer.currentDirection({}),
    }
    var minZoom = 2;
    var maxZoom = 12;
    var zoom = 6;
    var lat = 10.0;
    var lon = 52.0;
    var useGeolocation = false;
    var useGeoMetoc = false;
    var useIfmChart = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc, useIfmChart);
}
