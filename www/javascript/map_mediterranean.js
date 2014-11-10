/**
 * Initialize the map.
 */
function initMap() {
    var fcoo_base = location.protocol + "//media.fcoo.dk/tiles/";
    var fcoo_tileSize = 1024;
    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var overlays = {
        "DMI": {
            "windspeed": new L.FLayer.Dmi.windSpeed({zIndex: 100}),
            "winddirection": new L.FLayer.Dmi.windDirection({zIndex: 200}),
            "pressure": new L.FLayer.Dmi.seaLevelPressure({zIndex: 200}),
            "airtemp": new L.FLayer.Dmi.airTemperature({zIndex: 100}),
//            "humidity": new L.FLayer.Dmi.humidity({zIndex: 100}),
            "cloudcover": new L.FLayer.Dmi.totalCloudCover({zIndex: 100})
        },
        "NOAA": {
            "currentspeed": new L.FLayer.Noaa.currentSpeed({zIndex: 100}),
            "currentdirection": new L.FLayer.Noaa.currentDirection({zIndex: 200}),
//            "visibility":  new L.FLayer.Noaa.visibility({zIndex: 100})
        },
        "boundaries": {
            "EEZ": new L.tileLayer(fcoo_base + "tiles_EEZ_" + fcoo_tileSize + "_mercator_201411070000" + "/{z}/{x}/{y}.png",
                 {maxZoom: 10, tileSize: fcoo_tileSize, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty_" + fcoo_tileSize +".png"}),
        }
    }
    var minZoom = 2;
    var maxZoom = 10;
    var zoom = 8;
    var lat = 35.5;
    var lon = 33.9;
    var useGeolocation = true;
    var useGeoMetoc = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc);
}
