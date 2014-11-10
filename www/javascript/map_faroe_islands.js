/**
 * Initialize the map.
 */
function initMap() {
    var fcoo_base = location.protocol + "//media.fcoo.dk/tiles/";
    var fcoo_tileSize = 1024;
    var langs = ['da', 'fo', 'en'];
    var basemap = "FCOO Standard";
    var overlays = {
        "DMI": {
            "windspeed": new L.FLayer.Dmi.windSpeed({zIndex: 100}),
            "winddirection": new L.FLayer.Dmi.windDirection({zIndex: 200}),
            "pressure": new L.FLayer.Dmi.seaLevelPressure({zIndex: 200})
        },
        "FCOO": {
            "waveperiod": new L.FLayer.Fcoo.wavePeriod({zIndex: 100}, 'Greenland'),
            "waveheight": new L.FLayer.Fcoo.waveHeight({zIndex: 100}, 'Greenland'),
	    "wavedirection": new L.FLayer.Fcoo.waveDirection({zIndex: 200}, 'Greenland'),
        },
        "ECMWF": {
            "windspeed": new L.FLayer.Ecmwf.windSpeed({zIndex: 100}),
            "winddirection": new L.FLayer.Ecmwf.windDirection({zIndex: 200}),
            "pressure": new L.FLayer.Ecmwf.seaLevelPressure({zIndex: 200}),
            "airtemp": new L.FLayer.Ecmwf.airTemperature({zIndex: 100}),
            "cloudcover": new L.FLayer.Ecmwf.totalCloudCover({zIndex: 100}),
            "waveperiod": new L.FLayer.Ecmwf.wavePeriod({zIndex: 100}),
            "waveheight": new L.FLayer.Ecmwf.waveHeight({zIndex: 100}),
            "wavedirection": new L.FLayer.Ecmwf.waveDirection({zIndex: 200}),
        },
        "NOAA": {
            "currentspeed": new L.FLayer.Noaa.currentSpeed({zIndex: 100}),
            "currentdirection": new L.FLayer.Noaa.currentDirection({zIndex: 200}),
            "seatemp": new L.FLayer.Noaa.sst({zIndex: 100}),
            "salinity": new L.FLayer.Noaa.sss({zIndex: 100}),
        },
        "boundaries": {
            "EEZ": new L.tileLayer(fcoo_base + "tiles_EEZ_" + fcoo_tileSize + "_mercator_201411070000" + "/{z}/{x}/{y}.png",
                 {maxZoom: 10, tileSize: fcoo_tileSize, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty_" + fcoo_tileSize +".png"}),
        },
    }
    var minZoom = 2;
    var maxZoom = 10;
    var zoom = 7;
    var lat = 61.5;
    var lon = -6.0;
    var useGeolocation = true;
    var useGeoMetoc = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc);
}
