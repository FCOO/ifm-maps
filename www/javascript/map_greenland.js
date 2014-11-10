/**
 * Initialize the map.
 */
function initMap() {
    var tilesize = getTilesize();
    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var fcoo_base = location.protocol + "//media.fcoo.dk/tiles/";
    var overlays = {
        "DMI": {
            "windspeed": new L.FLayer.Dmi.windSpeed({tileSize: tilesize, zIndex: 100}),
            "winddirection": new L.FLayer.Dmi.windDirection({tileSize: tilesize, zIndex: 200}),
            "visibility":  new L.FLayer.Dmi.visibility({tileSize: tilesize, zIndex: 100}),
            "iceconcentration": new L.FLayer.Dmi.iceConcentration({tileSize: tilesize, zIndex: 100}),
            "pressure": new L.FLayer.Dmi.seaLevelPressure({tileSize: tilesize, zIndex: 200}),
            "airtemp": new L.FLayer.Dmi.airTemperature({tileSize: tilesize, zIndex: 100}),
//            "humidity": new L.FLayer.Dmi.humidity({tileSize: tilesize, zIndex: 100}),
            "cloudcover": new L.FLayer.Dmi.totalCloudCover({tileSize: tilesize, zIndex: 100}),
        },
        "FCOO": {
            "waveperiod": new L.FLayer.Fcoo.wavePeriod({tileSize: tilesize, zIndex: 100}, 'Greenland'),
            "waveheight": new L.FLayer.Fcoo.waveHeight({tileSize: tilesize, zIndex: 100}, 'Greenland'),
	    "wavedirection": new L.FLayer.Fcoo.waveDirection({tileSize: tilesize, zIndex: 200}, 'Greenland'),
        },
        "ECMWF": {
            "windspeed": new L.FLayer.Ecmwf.windSpeed({tileSize: tilesize, zIndex: 100}),
            "winddirection": new L.FLayer.Ecmwf.windDirection({tileSize: tilesize, zIndex: 200}),
            "pressure": new L.FLayer.Ecmwf.seaLevelPressure({tileSize: tilesize, zIndex: 200}),
            "airtemp": new L.FLayer.Ecmwf.airTemperature({tileSize: tilesize, zIndex: 100}),
            "cloudcover": new L.FLayer.Ecmwf.totalCloudCover({tileSize: tilesize, zIndex: 100}),
            "waveperiod": new L.FLayer.Ecmwf.wavePeriod({tileSize: tilesize, zIndex: 100}),
            "waveheight": new L.FLayer.Ecmwf.waveHeight({tileSize: tilesize, zIndex: 100}),
            "wavedirection": new L.FLayer.Ecmwf.waveDirection({tileSize: tilesize, zIndex: 200}),
        },
        "NOAA": {
            "currentspeed": new L.FLayer.Noaa.currentSpeed({tileSize: tilesize, zIndex: 100}),
            "currentdirection": new L.FLayer.Noaa.currentDirection({tileSize: tilesize, zIndex: 200}),
            "seatemp": new L.FLayer.Noaa.sst({tileSize: tilesize, zIndex: 100}),
            "salinity": new L.FLayer.Noaa.sss({tileSize: tilesize, zIndex: 100}),
        },
        "boundaries": {
            "EEZ": new L.tileLayer(fcoo_base + "tiles_EEZ_" + tilesize + "_mercator_201411070000" + "/{z}/{x}/{y}.png",
		 {maxZoom: 10, tileSize: tilesize, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty_" + tilesize +".png"}),
            "SAR": new L.tileLayer(fcoo_base + "tiles_SAR_" + tilesize + "_mercator_201411070000" + "/{z}/{x}/{y}.png",
		 {maxZoom: 10, tileSize: tilesize, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty_" + tilesize +".png"}),
        }
    };
    var minZoom = 2;
    var maxZoom = 10;
    var zoom = 6;
    var lat = 62.0;
    var lon = -45.0;
    var useGeolocation = false;
    var useGeoMetoc = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeolocation, useGeoMetoc);
}
