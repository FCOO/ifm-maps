/**
 * Initialize the map.
 */
function initMap() {
    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var fcoo_base = location.protocol + "//media.fcoo.dk/tiles/";
    var fcoo_tileSize = 1024;
    var overlays = {
        "DMI": {
            "windspeed": new L.FLayer.Dmi.windSpeed({zIndex: 100}),
            "winddirection": new L.FLayer.Dmi.windDirection({zIndex: 200}),
            "visibility":  new L.FLayer.Dmi.visibility({zIndex: 100}),
            "iceconcentration": new L.FLayer.Dmi.iceConcentration({zIndex: 100}),
            "pressure": new L.FLayer.Dmi.seaLevelPressure({zIndex: 200}),
            "airtemp": new L.FLayer.Dmi.airTemperature({zIndex: 100}),
//            "humidity": new L.FLayer.Dmi.humidity({zIndex: 100}),
            "cloudcover": new L.FLayer.Dmi.totalCloudCover({zIndex: 100}),
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
            "SAR": new L.tileLayer(fcoo_base + "tiles_SAR_" + fcoo_tileSize + "_mercator_201411070000" + "/{z}/{x}/{y}.png",
		 {maxZoom: 10, tileSize: fcoo_tileSize, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty_" + fcoo_tileSize +".png"}),
        }
    };
    var minZoom = 2;
    var maxZoom = 10;
    var zoom = 6;
    var lat = 62.0;
    var lon = -45.0;
    var useGeolocation = false;
    var useGeoMetoc = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc);
}
