/**
 * Initialize the map.
 */
function initMap() {
    var langs = ['da', 'en'];
    var basemap = "Mapquest Open";
    var overlays = {
        "windspeed": new L.FLayer.windSpeed({}),
        "winddirection": new L.FLayer.windDirection({}),
        "currentspeed": new L.FLayer.currentSpeed({}),
        "currentdirection": new L.FLayer.currentDirection({}),
        "pressure": new L.FLayer.seaLevelPressure({}),
        "airtemp": new L.FLayer.airTemperature({}),
        "humidity": new L.FLayer.humidity({}),
        "cloudcover": new L.FLayer.totalCloudCover({}),
        "visibility":  new L.FLayer.visibility({})
    }
    var minZoom = 2;
    var maxZoom = 12;
    var zoom = 8;
    var lat = 35.5;
    var lon = 33.9;
    var useGeolocation = true;
    var useGeoMetoc = false;
    var useIfmChart = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc, useIfmChart);
}
