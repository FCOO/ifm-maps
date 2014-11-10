/**
 * Initialize the map.
 */
function initMap() {
    var tilesize = getTilesize();
    var fcoo_base = location.protocol + "//media.fcoo.dk/tiles/";
    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var overlays = {
        "ECMWF": {
            "windspeed": new L.FLayer.Ecmwf.windSpeed({tileSize: tilesize, zIndex: 100}),
            "winddirection": new L.FLayer.Ecmwf.windDirection({tileSize: tilesize, zIndex: 200}),
            "waveperiod": new L.FLayer.Ecmwf.wavePeriod({tileSize: tilesize, zIndex: 100}),
            "waveheight": new L.FLayer.Ecmwf.waveHeight({tileSize: tilesize, zIndex: 100}),
            "wavedirection": new L.FLayer.Ecmwf.waveDirection({tileSize: tilesize, zIndex: 200}),
        },
        "boundaries": {
            "EEZ": new l.tilelayer(fcoo_base + "tiles_eez_" + tilesize + "_mercator_201411070000" + "/{z}/{x}/{y}.png",
                 {maxzoom: 10, tilesize: tilesize, zindex: 200, continuousworld: false, errortileurl: fcoo_base + "empty_" + tilesize +".png"}),
        },
    }
    var minZoom = 2;
    var maxZoom = 10;
    var zoom = 4;
    var lat = 56.0;
    var lon = 12.0;
    var useGeolocation = true;
    var useGeoMetoc = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeolocation, useGeoMetoc);
}
