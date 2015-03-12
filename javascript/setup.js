(function (){
    "use strict";
    /*jslint browser: true*/
    /*global $, L, initCommonMap, getTilesize, getLocalLanguage, domain*/
    $(document).ready(function () {
        /**
         * Initialize the map.
         */
        var minZoom;
        var maxZoom;
        var zoom;
        var lat;
        var lon;
        var overlays;
        var tilesize = getTilesize();
        var store = new L.Control.FcooLayerStore();
        var subdomains = ["media01", "media02", "media03", "media04", "media05"];
        var fcoo_base = location.protocol + "//{s}.fcoo.dk/tiles/";
        var landLayer = store.foreground;
        var basemap = "FCOO Standard";
        var langs = ['da', 'en'];
        var useGeoMetoc = false;

        if (domain === 'denmark_impact') {
            minZoom = 5;
            maxZoom = 10;
            zoom = 6;
            lat = 55.7;
            lon = 11.1;
            overlays = {
                "Impact": {
                    "Boarding": new L.FImpactLayer.boarding_dk({tileSize: tilesize, zIndex: 100, foreground: landLayer}),
                    "Helicopter": new L.FImpactLayer.helo_tol_dk({tileSize: tilesize, zIndex: 100, foreground: landLayer}),
                    "Replenishment": new L.FImpactLayer.replenishment_dk({tileSize: tilesize, zIndex: 100, foreground: landLayer}),
                },
                "boundaries": {
                    "EEZ": new L.tileLayer(fcoo_base + "tiles_EEZ_" + tilesize + "_mercator_201411070000" + "/{z}/{x}/{y}.png", {maxZoom: 10, tileSize: tilesize, subdomains: subdomains, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty_" + tilesize +".png"}),
                },
                "Celestial information": {
                    "Solar Terminator": store.solarTerminator
                }
            };
            initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeoMetoc);
        } else if (domain === 'denmark') {
            minZoom = 5;
            maxZoom = 10;
            zoom = 6;
            lat = 55.7;
            lon = 11.1;
            var link_template = location.protocol + "//chart.fcoo.dk/station_timeseries.asp?s=:003__STATION__:046SeaLvl:002DK:001DEFAULT:04d620:04e400:04f0:04a1:04b48:04i0:04c1:04g0:0641:05opopup";
            $.getJSON(location.protocol + "//api.fcoo.dk/ifm-maps/json/Observations.json", function (data) {
                var geojson = L.geoJson(data, {
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup('<img src="' + link_template.replace('__STATION__', feature.properties.id) + '" height="350" width="500" />', {maxWidth: 700, maxHeight: 600});
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
                    /*jshint unused: false*/
                });
                overlays = {
                    "DMI": {
                        "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed'}),
                        "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection'}),
                        "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility'}),
                        "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure'}),
                        "precip": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation'}),
                        "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature'}),
                        "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover'}),
                    },
                    "FCOO - North Sea/Baltic Sea": {
                        "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'wavePeriod'}),
                        "waveheight": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'waveHeight'}),
                        "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/NSBALTIC', 'parameter': 'waveDirection'}),
                        "currentspeed": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC', 'parameter': 'currentSpeed'}),
                        "currentdirection": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC', 'parameter': 'currentDirection'}),
                    "elev": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC', 'parameter': 'seaLevel'}),
                    "seatemp": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC', 'parameter': 'sst'}),
                    "salinity": store.getLayer({'dataset': 'FCOO/GETM/NSBALTIC', 'parameter': 'sss'})
                    },
                    "FCOO - Danish Waters": {
                        "waveperiod": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'wavePeriod'}),
                        "waveheight": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'waveHeight'}),
                        "wavedirection": store.getLayer({'dataset': 'FCOO/WW3/DKINNER', 'parameter': 'waveDirection'}),
                        "currentspeed": store.getLayer({'dataset': 'FCOO/GETM/DKINNER', 'parameter': 'currentSpeed'}),
                        "currentdirection": store.getLayer({'dataset': 'FCOO/GETM/DKINNER', 'parameter': 'currentDirection'}),
                    "elev": store.getLayer({'dataset': 'FCOO/GETM/DKINNER', 'parameter': 'seaLevel'}),
                    "seatemp": store.getLayer({'dataset': 'FCOO/GETM/DKINNER', 'parameter': 'sst'}),
                    "salinity": store.getLayer({'dataset': 'FCOO/GETM/DKINNER', 'parameter': 'sss'})
                    },
                    "ECMWF": {
                        "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windSpeed'}),
                        "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'windDirection'}),
                        "pressure": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'seaLevelPressure'}),
                        "precip": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalPrecipitation'}),
                        "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'airTemperature'}),
                        "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/DENMARK', 'parameter': 'totalCloudCover'}),
                        "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'wavePeriod'}),
                        "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveHeight'}),
                        "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/DENMARK', 'parameter': 'waveDirection'})
                    },
                    "Point forecasts": {
                        "Sea level": geojson,
                    },
                    "boundaries": {
                        "EEZ": store.EEZ,
                    },
                    "Celestial information": {
                        "Solar Terminator": store.solarTerminator
                    }
                };
                initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeoMetoc);
            });
        } else if (domain === 'faroe_islands') {
            overlays = {
                "DMI": {
                    "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windSpeed'}),
                    "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'windDirection'}),
                    "visibility": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'visibility'}),
                    "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'seaLevelPressure'}),
                    "precip": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalPrecipitation'}),
                    "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'airTemperature'}),
                    "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/S03', 'parameter': 'totalCloudCover'}),
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
                "boundaries": {
                    "EEZ": store.EEZ,
                },
                "Celestial information": {
                    "Solar Terminator": store.solarTerminator
                }
            };
            langs = ['da', 'fo', 'en'];
            minZoom = 2;
            maxZoom = 10;
            zoom = 7;
            lat = 61.5;
            lon = -6.0;
            initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeoMetoc);
        } else if (domain === 'greenland_impact') {
            overlays = {
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
            minZoom = 2;
            maxZoom = 10;
            zoom = 6;
            lat = 62.0;
            lon = -45.0;
            initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeoMetoc);
        } else if (domain === 'greenland') {
            var popstr;
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
                overlays = {
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
                        "Solar Terminator": store.solarTerminator
                    }
                };

                minZoom = 2;
                maxZoom = 10;
                zoom = 6;
                lat = 62.0;
                lon = -45.0;
                initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeoMetoc);
            });
        } else if (domain === 'indian_ocean') {
            overlays = {
                "ECMWF": {
                    "windspeed": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windSpeed'}),
                    "winddirection": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'windDirection'}),
                    "pressure": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'seaLevelPressure'}),
                    "precip": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalPrecipitation'}),
                    "airtemp": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'airTemperature'}),
                    "cloudcover": store.getLayer({'dataset': 'ECMWF/DXD/AFR', 'parameter': 'totalCloudCover'}),
                    "waveperiod": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'wavePeriod'}),
                    "waveheight": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveHeight'}),
                    "wavedirection": store.getLayer({'dataset': 'ECMWF/DXP/AFR', 'parameter': 'waveDirection'})
                },
                "NOAA": {
                    "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentSpeed'}),
                    "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'currentDirection'}),
                    "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'sst'}),
                    "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/EAST_AFRICA', 'parameter': 'sss'})
                }, 
                "boundaries": {
                    "EEZ": store.EEZ
                },
                "Celestial information": {
                    "Solar Terminator": store.solarTerminator
                },
                "places": {
                    "DBPedia (experimental)": L.dbPediaLayer({lang: 'en', includeCities: true, minZoom: 8}),
                }
            };
            minZoom = 4;
            maxZoom = 10;
            zoom = 5;
            lat = 0.0;
            lon = 56.0;
            initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeoMetoc);
        } else if (domain === 'mediterranean') {
            overlays = {
                "DMI": {
                    "windspeed": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'windSpeed'}),
                    "winddirection": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'windDirection'}),
                    "pressure": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'seaLevelPressure'}),
                    "airtemp": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'airTemperature'}),
                    "cloudcover": store.getLayer({'dataset': 'DMI/HIRLAM/T15', 'parameter': 'totalCloudCover'}),
                },
                "NOAA": {
                    "currentspeed": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'currentSpeed'}),
                    "currentdirection": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'currentDirection'}),
                    "seatemp": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'sst'}),
                    "salinity": store.getLayer({'dataset': 'NOAA/HYCOM/MEDITERRANEAN', 'parameter': 'sss'})
                }, 
                "boundaries": {
                    "EEZ": store.EEZ
                },
                "Celestial information": {
                    "Solar Terminator": store.solarTerminator
                }
            };
            minZoom = 2;
            maxZoom = 10;
            zoom = 8;
            lat = 35.5;
            lon = 33.9;
            initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeoMetoc);
        } else {
            throw new Error('Valid domain not specified: ' + domain);
        }
    });

})();
