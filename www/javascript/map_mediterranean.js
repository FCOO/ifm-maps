/**
 * Initialize the map.
 */
function initMap() {
    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var overlays = {
        "DMI": {
            "windspeed": new L.FLayer.Dmi.windSpeed({zIndex: 100}),
            "winddirection": new L.FLayer.Dmi.windDirection({zIndex: 200}),
            "pressure": new L.FLayer.Dmi.seaLevelPressure({zIndex: 200}),
            "airtemp": new L.FLayer.Dmi.airTemperature({zIndex: 100}),
            "humidity": new L.FLayer.Dmi.humidity({zIndex: 100}),
            "cloudcover": new L.FLayer.Dmi.totalCloudCover({zIndex: 100})
        },
        "NOAA": {
            "currentspeed": new L.FLayer.Noaa.currentSpeed({zIndex: 100}),
            "currentdirection": new L.FLayer.Noaa.currentDirection({zIndex: 200}),
            "visibility":  new L.FLayer.Noaa.visibility({zIndex: 100})
        }
    }
    var minZoom = 2;
    var maxZoom = 10;
    var zoom = 8;
    var lat = 35.5;
    var lon = 33.9;
    var useGeolocation = true;
    var useGeoMetoc = false;
    var useIfmChart = false;

    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, useGeolocation, useGeoMetoc, useIfmChart);
}
