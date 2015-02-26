$(document).ready(function() {
    /**
     * Initialize the map.
     */
    var tilesize = getTilesize();
    var subdomains = ["media01", "media02", "media03", "media04", "media05"];
    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";
    var fcoo_base = location.protocol + "//{s}.fcoo.dk/tiles/";
    var tidal_url_base = location.protocol + "//api.fcoo.dk/tides?station={s}&start={t1}&end={t2}&nx=500&ny=350&lang={l}&tz={dt}";
    var tidal_stations = "../json/tidal_stations_greenland.json";
    $.getJSON(tidal_stations, function(tidal_data) {
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
                t1 = t1.toISOString()
                t2 = t2.toISOString()
                var tidal_url = tidal_url_base.replace('{s}', feature.properties.id);
                var tidal_url = tidal_url.replace('{t1}', t1);
                var tidal_url = tidal_url.replace('{t2}', t2);
                var lang = getLocalLanguage();
                var tidal_url = tidal_url.replace('{l}', lang);
                var popups = {}
                popups['en'] = '<h2>Tidal forecast for ' + feature.properties.name + '</h2><img src="' + tidal_url + '" height="350" width="500" /><p>Tidal forecasts from <a href="http://dmi.dk">DMI</a>. Tidal tables can be found <a href="http://www.dmi.dk/en/groenland/hav/tidevandstabeller-groenland/">here</a>.</p>';
                popups['da'] = '<h2>Tidevandsprognose for ' + feature.properties.name + '</h2><img src="' + tidal_url + '" height="350" width="500" /><p>Tidevandsprognoser fra <a href="http://dmi.dk">DMI</a>. Tidevandstabeller kan findes <a href="http://www.dmi.dk/groenland/hav/tidevandstabeller-groenland/">her</a>.</p>';
                if (typeof popups[lang] != 'undefined') {
                    popstr = popups[lang];
                } else {
                    popstr = popups['en'];
                };
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
    
        var overlays = {
            "DMI": {
                "windspeed": new L.FLayer.Dmi.windSpeed({tileSize: tilesize, zIndex: 100}),
                "winddirection": new L.FLayer.Dmi.windDirection({tileSize: tilesize, zIndex: 200}),
                "visibility":  new L.FLayer.Dmi.visibility({tileSize: tilesize, zIndex: 100}),
                "iceconcentration": new L.FLayer.Dmi.iceConcentration({tileSize: tilesize, zIndex: 100}),
                "pressure": new L.FLayer.Dmi.seaLevelPressure({tileSize: tilesize, zIndex: 200}),
                "precip": new L.FLayer.Dmi.totalPrecipitation({tileSize: tilesize, zIndex: 100}),
                "airtemp": new L.FLayer.Dmi.airTemperature({tileSize: tilesize, zIndex: 100}),
//              "humidity": new L.FLayer.Dmi.humidity({tileSize: tilesize, zIndex: 100}),
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
                "precip": new L.FLayer.Ecmwf.totalPrecipitation({tileSize: tilesize, zIndex: 100}),
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
            "Point forecasts": {
                "Tidal forecasts": geojson,
            },
            "boundaries": {
                "EEZ": new L.tileLayer(fcoo_base + "tiles_EEZ_" + tilesize + "_mercator_201411070000" + "/{z}/{x}/{y}.png",
       {maxZoom: 10, tileSize: tilesize, subdomains: subdomains, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty_" + tilesize +".png"}),
                "SAR": new L.tileLayer(fcoo_base + "tiles_SAR_" + tilesize + "_mercator_201411070000" + "/{z}/{x}/{y}.png",
       {maxZoom: 10, tileSize: tilesize, subdomains: subdomains, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty_" + tilesize +".png"}),
            },
            "Celestial information": {
                "Sun and Moon": new L.Terminator(),
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
