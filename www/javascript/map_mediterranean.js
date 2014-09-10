/**
 * Initialize the map.
 */
function initMap() {
    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var overlays = {
        "DMI": {
            "windspeed": new L.FLayer.Dmi.windSpeed({}),
            "winddirection": new L.FLayer.Dmi.windDirection({}),
            "pressure": new L.FLayer.Dmi.seaLevelPressure({}),
            "airtemp": new L.FLayer.Dmi.airTemperature({}),
            "humidity": new L.FLayer.Dmi.humidity({}),
            "cloudcover": new L.FLayer.Dmi.totalCloudCover({}),
        },
        "NOAA": {
            "currentspeed": new L.FLayer.Noaa.currentSpeed({}),
            "currentdirection": new L.FLayer.Noaa.currentDirection({}),
            "visibility":  new L.FLayer.Noaa.visibility({})
        }
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
