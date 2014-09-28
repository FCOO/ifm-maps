/**
 * Initialize the map.
 */
function initMap() {
    var fcoo_base = location.protocol + "//media.fcoo.dk/tiles/";
    var landLayer = new L.CountingTileLayer(fcoo_base + "tiles_frgrnd_201409230000/{z}/{x}/{y}.png", {
        maxZoom: 10,
        tileSize: 256,
        zIndex: 1000,
        continuousWorld: false,
        errorTileUrl: fcoo_base + "empty.png"
    });

    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var overlays = {
        "DMI": {
            "windspeed": new L.FLayer.Dmi.windSpeed({zIndex: 100}),
            "winddirection": new L.FLayer.Dmi.windDirection({zIndex: 200}),
        },
        "FCOO - North Sea/Baltic Sea": {
            "waveperiod": new L.FLayer.Fcoo.wavePeriod({zIndex: 200, foreground: landLayer}, 'NSBaltic'),
            "waveheight": new L.FLayer.Fcoo.waveHeight({zIndex: 100, foreground: landLayer}, 'NSBaltic'),
	    "wavedirection": new L.FLayer.Fcoo.waveDirection({zIndex: 200, foreground: landLayer}, 'NSBaltic'),
            "currentspeed": new L.FLayer.Fcoo.currentSpeed({zIndex: 100, foreground: landLayer}, 'nsbalt'),
            "currentdirection": new L.FLayer.Fcoo.currentDirection({zIndex: 200, foreground: landLayer}, 'nsbalt'),
	    "elev": new L.FLayer.Fcoo.elevation({zIndex: 100, foreground: landLayer}, 'nsbalt'),
	    "seatemp": new L.FLayer.Fcoo.sst({zIndex: 100, foreground: landLayer}, 'nsbalt'),
	    "salinity": new L.FLayer.Fcoo.sss({zIndex: 100, foreground: landLayer}, 'nsbalt'),
        },
        "FCOO - Danish Waters": {
            "waveperiod": new L.FLayer.Fcoo.wavePeriod({zIndex: 200, foreground: landLayer}, 'DKinner'),
            "waveheight": new L.FLayer.Fcoo.waveHeight({zIndex: 101, foreground: landLayer}, 'DKinner'),
	    "wavedirection": new L.FLayer.Fcoo.waveDirection({zIndex: 201, foreground: landLayer}, 'DKinner'),
            "currentspeed": new L.FLayer.Fcoo.currentSpeed({zIndex: 101, foreground: landLayer}, 'idk'),
            "currentdirection": new L.FLayer.Fcoo.currentDirection({zIndex: 201, foreground: landLayer}, 'idk'),
	    "elev": new L.FLayer.Fcoo.elevation({zIndex: 101, foreground: landLayer}, 'idk'),
	    "seatemp": new L.FLayer.Fcoo.sst({zIndex: 101, foreground: landLayer}, 'idk'),
	    "salinity": new L.FLayer.Fcoo.sss({zIndex: 101, foreground: landLayer}, 'idk'),
        },
        "boundaries": {
            "EEZ": new L.tileLayer(fcoo_base + "tiles_EEZ_201409160000" + "/{z}/{x}/{y}.png", {maxZoom: 10, tileSize: 256, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty.png"}),
        },
    }
    var minZoom = 5;
    var maxZoom = 10;
    var zoom = 6;
    var lat = 55.7;
    var lon = 11.1;
    var useGeolocation = true;
    var useGeoMetoc = false;
    var useIfmChart = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc, useIfmChart);
}
