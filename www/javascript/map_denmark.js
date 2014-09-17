/**
 * Initialize the map.
 */
function initMap() {
    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var overlays = {
        "FCOO": {
	    "elev": new L.FLayer.Fcoo.elevation({zIndex: 100}),
            "waveheight": new L.FLayer.Fcoo.waveHeight({zIndex: 100}),
	    "wavedirection": new L.FLayer.Fcoo.waveDirection({zIndex: 200}),
            "currentspeed": new L.FLayer.Fcoo.currentSpeed({zIndex: 100}),
            "currentdirection": new L.FLayer.Fcoo.currentDirection({zIndex: 200})
        },
        "DMI": {
            "windspeed": new L.FLayer.Dmi.windSpeed({zIndex: 100}),
            "winddirection": new L.FLayer.Dmi.windDirection({zIndex: 200})
        }
    }
    var minZoom = 5;
    var maxZoom = 10;
    var zoom = 6;
    var lat = 55.7;
    var lon = 11.1;
    var useGeolocation = true;
    var useGeoMetoc = true;
    var useIfmChart = true;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc, useIfmChart);
}
