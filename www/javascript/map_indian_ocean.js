/**
 * Initialize the map.
 */
function initMap() {
    var fcoo_base = location.protocol + "//media.fcoo.dk/tiles/";
    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var overlays = {
        "NOAA": {
            "currentspeed": new L.FLayer.Noaa.currentSpeed({zIndex: 100}),
            "currentdirection": new L.FLayer.Noaa.currentDirection({zIndex: 200})
        },
        "boundaries": {
            "EEZ": new L.tileLayer(fcoo_base + "tiles_EEZ_201410030000" + "/{z}/{x}/{y}.png", {maxZoom: 10, tileSize: 256, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty.png"}),
        }
    }
    var minZoom = 2;
    var maxZoom = 10;
    var zoom = 6;
    var lat = 10.0;
    var lon = 52.0;
    var useGeolocation = false;
    var useGeoMetoc = false;
    var useIfmChart = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc, useIfmChart);
}
