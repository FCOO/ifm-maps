/**
 * Initialize the map.
 */
function initMap() {
    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var overlays = {
        "windspeed": new L.FLayer.windSpeed({}),
        "winddirection": new L.FLayer.windDirection({zIndex: 101}),
        "currentspeed": new L.FLayer.currentSpeed({}),
        "currentdirection": new L.FLayer.currentDirection({zIndex: 102}),
        "visibility":  new L.FLayer.visibility({}),
        "iceconcentration": new L.FLayer.iceConcentration({}),
        "seatemp": new L.FLayer.sst({}),
        "salinity": new L.FLayer.sss({}),
        "pressure": new L.FLayer.seaLevelPressure({}),
        "airtemp": new L.FLayer.airTemperature({}),
        "humidity": new L.FLayer.humidity({}),
        "cloudcover": new L.FLayer.totalCloudCover({})
    }
    var minZoom = 2;
    var maxZoom = 10;
    var zoom = 6;
    var lat = 62.0;
    var lon = -45.0;
    var useGeolocation = false;
    var useGeoMetoc = false;
    var useIfmChart = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc, useIfmChart);
}
