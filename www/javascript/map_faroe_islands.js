/**
 * Initialize the map.
 */
function initMap() {
    var fcoo_base = location.protocol + "//media.fcoo.dk/tiles/";
    var langs = ['da', 'fo', 'en'];
    var basemap = "FCOO Standard";
    var overlays = {
        "DMI": {
            "windspeed": new L.FLayer.Dmi.windSpeed({zIndex: 100}),
            "winddirection": new L.FLayer.Dmi.windDirection({zIndex: 200}),
            "pressure": new L.FLayer.Dmi.seaLevelPressure({zIndex: 200})
        },
        "NOAA": {
            "currentspeed": new L.FLayer.Noaa.currentSpeed({zIndex: 100}),
            "currentdirection": new L.FLayer.Noaa.currentDirection({zIndex: 200}),
            "seatemp": new L.FLayer.Noaa.sst({zIndex: 100}),
            "salinity": new L.FLayer.Noaa.sss({zIndex: 100}),
            "visibility":  new L.FLayer.Noaa.visibility({zIndex: 100})
        },
        "boundaries": {
            "EEZ": new L.tileLayer(fcoo_base + "tiles_EEZ_201409160000" + "/{z}/{x}/{y}.png", {maxZoom: 10, tileSize: 256, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty.png"}),
        },
    }
    var minZoom = 2;
    var maxZoom = 10;
    var zoom = 7;
    var lat = 61.5;
    var lon = -6.0;
    var useGeolocation = true;
    var useGeoMetoc = false;
    var useIfmChart = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc, useIfmChart);
}
