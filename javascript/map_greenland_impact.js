"use strict";
/*jslint browser: true*/
/*global $, L, initCommonMap, getTilesize, getLocalLanguage*/

$(document).ready(function () {
    /**
     * Initialize the map.
     */
    var popstr;
    var tilesize = getTilesize();
    var subdomains = ["media01", "media02", "media03", "media04", "media05"];
    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var fcoo_base = location.protocol + "//{s}.fcoo.dk/tiles/";
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
                if (popups[lang] !== undefined) {
                    popstr = popups[lang];
                } else {
                    popstr = popups.en;
                }
                feature.properties.popup = popstr;
                popstr = popstr.replace('{dt}', dt);
                layer.bindPopup(popstr,
                                {maxWidth: 700, maxHeight: 600});
            },
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
        });
    
        var store = new L.Control.FcooLayerStore();
        var overlays = {
            "Impact ECMWF": {
                "Boarding": new L.FImpactLayer.boarding_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                "Helicopter": new L.FImpactLayer.helo_tol_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                "Replenishment": new L.FImpactLayer.replenishment_ecmwf_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
            },
            "Impact DMI/FCOO": {
                "Boarding": new L.FImpactLayer.boarding_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                "Helicopter": new L.FImpactLayer.helo_tol_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
                "Replenishment": new L.FImpactLayer.replenishment_gl({tileSize: tilesize, zIndex: 100, foreground: store.foreground}),
            },
            "boundaries": {
                "EEZ": store.EEZ,
                "SAR": store.SAR
            },
            "Celestial information": {
                "Solar Terminator": store.solarTerminator
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
