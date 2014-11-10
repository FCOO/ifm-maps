/**
 * Initialize the map.
 */
function initMap() {
    var fcoo_base = location.protocol + "//media.fcoo.dk/tiles/";
    var fcoo_tileSize = 1024;
    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var overlays = {
        "ECMWF": {
            "windspeed": new L.FLayer.Ecmwf.windSpeed({zIndex: 100}),
            "winddirection": new L.FLayer.Ecmwf.windDirection({zIndex: 200}),
            "waveperiod": new L.FLayer.Ecmwf.wavePeriod({zIndex: 100}),
            "waveheight": new L.FLayer.Ecmwf.waveHeight({zIndex: 100}),
            "wavedirection": new L.FLayer.Ecmwf.waveDirection({zIndex: 200}),
        },
        "NOAA": {
            "currentspeed": new L.FLayer.Noaa.currentSpeed({zIndex: 100}),
            "currentdirection": new L.FLayer.Noaa.currentDirection({zIndex: 200})
        },
        "boundaries": {
            "EEZ": new L.tileLayer(fcoo_base + "tiles_EEZ_" + fcoo_tileSize + "_mercator_201411070000" + "/{z}/{x}/{y}.png",
                 {maxZoom: 10, tileSize: fcoo_tileSize, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty_" + fcoo_tileSize +".png"}),
        }
    }
    var minZoom = 4;
    var maxZoom = 10;
    var zoom = 6;
    var lat = 10.0;
    var lon = 52.0;
    var useGeolocation = false;
    var useGeoMetoc = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc);
}
