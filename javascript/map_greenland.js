"use strict";
/*jslint browser: true*/
/*global $, L, initCommonMap, getTilesize, getLocalLanguage*/

$(document).ready(function () {
    /**
     * Initialize the map.
     */
    var popstr;
    var tilesize = getTilesize();
    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var tidal_url_base = location.protocol + "//api.fcoo.dk/tides?station={s}&start={t1}&end={t2}&nx=500&ny=350&lang={l}&tz={dt}";
    var tidal_stations = "../json/tidal_stations_greenland.json";
    $.getJSON(tidal_stations, function (tidal_data) {
        var geojson = L.geoJson(tidal_data, {
            onEachFeature: function (feature, layer) {
                var t1 = new Date();
                var dt = t1.getTimezoneOffset();
                t1.setUTCHours(0);
                t1.setUTCMinutes(0);
                t1.setUTCSeconds(0);
                t1.setUTCMilliseconds(0);
                var t2 = new Date();
                t2.setUTCDate(t2.getDate() + 3);
                t2.setUTCHours(0);
                t2.setUTCMinutes(0);
                t2.setUTCSeconds(0);
                t2.setUTCMilliseconds(0);
                t1 = t1.toISOString();
                t2 = t2.toISOString();
                var tidal_url = tidal_url_base.replace('{s}', feature.properties.id);
                tidal_url = tidal_url.replace('{t1}', t1);
                tidal_url = tidal_url.replace('{t2}', t2);
                var lang = getLocalLanguage();
                tidal_url = tidal_url.replace('{l}', lang);
                var popups = {};
                popups.en = '<h2>Tidal forecast for ' + feature.properties.name + '</h2><img src="' + tidal_url + '" height="350" width="500" /><p>Tidal forecasts from <a href="http://dmi.dk">DMI</a>. Tidal tables can be found <a href="http://www.dmi.dk/en/groenland/hav/tidevandstabeller-groenland/">here</a>.</p>';
                popups.da = '<h2>Tidevandsprognose for ' + feature.properties.name + '</h2><img src="' + tidal_url + '" height="350" width="500" /><p>Tidevandsprognoser fra <a href="http://dmi.dk">DMI</a>. Tidevandstabeller kan findes <a href="http://www.dmi.dk/groenland/hav/tidevandstabeller-groenland/">her</a>.</p>';
                if (typeof popups[lang] != 'undefined') {
                    popstr = popups[lang];
                } else {
                    popstr = popups.en;
                }
                feature.properties.popup = popstr;
                popstr = popstr.replace('{dt}', dt);
                layer.bindPopup(popstr,
                                {maxWidth: 700, maxHeight: 600});
            },
            /*jshint unused: true*/
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                           radius: 5,
                           fillColor: "#ff7800",
                           color: "#000",
                           weight: 1,
                           opacity: 1,
                           fillOpacity: 0.8
                });
            }
            /*jshint unused: true*/
        });
    
        var store = new L.Control.FcooLayerStore();
        var overlays = {
            "DMI": {
                "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windSpeed'}),
                "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'windDirection'}),
                "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'visibility'}),
                "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'seaLevelPressure'}),
                "precip": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'totalPrecipitation'}),
                "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'airTemperature'}),
                "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/K05', 'parameter': 'totalCloudCover'}),
                "iceconcentration": store.getLayer({'dataset': 'DMI/ICECHART/GREENLAND', 'parameter': 'iceConcentration'})
            },
            "FCOO": {
                "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveHeight'}),
                "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/ARCTIC', 'parameter': 'waveDirection'})
            },
            "ECMWF": {
                "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windSpeed'}),
                "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'windDirection'}),
                "pressure": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'seaLevelPressure'}),
                "precip": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalPrecipitation'}),
                "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'airTemperature'}),
                "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/GREENLAND', 'parameter': 'totalCloudCover'}),
                "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'wavePeriod'}),
                "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveHeight'}),
                "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/GREENLAND', 'parameter': 'waveDirection'})
            },
            "NOAA": {
                "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentSpeed'}),
                "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'currentDirection'}),
                "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sst'}),
                "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/GREENLAND', 'parameter': 'sss'})
            }, 
            "Point forecasts": {
                "Tidal forecasts": geojson
            },
            "boundaries": {
                "EEZ": store.EEZ,
                "SAR": store.SAR
            },
            "Celestial information": {
                "Sun and Moon": store.solarTerminator
            }
        };

        var minZoom = 2;
        var maxZoom = 10;
        var zoom = 6;
        var lat = 62.0;
        var lon = -45.0;
        var useGeoMetoc = false;
        initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeoMetoc);
    });
});
