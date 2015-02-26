$(document).ready(function() {
    /**
     * Initialize the map.
     */
    var tilesize = getTilesize();
    var subdomains = ["media01", "media02", "media03", "media04", "media05"];
    var fcoo_base = location.protocol + "//{s}.fcoo.dk/tiles/";
    var landLayer = new L.CountingTileLayer(fcoo_base + "tiles_frgrnd_" + tilesize + "_mercator_201411070000/{z}/{x}/{y}.png", {
        maxZoom: 10,
        tileSize: tilesize,
        subdomains: subdomains,
        zIndex: 1000,
        continuousWorld: false,
        errorTileUrl: fcoo_base + "empty_" + tilesize + ".png"
    });

    var minZoom = 5;
    var maxZoom = 10;
    var zoom = 6;
    var lat = 55.7;
    var lon = 11.1;
    var useGeoMetoc = false;

    var langs = ['da', 'en'];
    var basemap = "FCOO Standard";

    //var link_template = "http://ifm.fcoo.dk/asp/oceanChart.asp?hindcastPeriod=12&forecastPeriod=24&width=500&height=350&id=__STATION__&paramId=SeaLvl&forecastMode=1";
    var link_template = location.protocol + "//chart.fcoo.dk/station_timeseries.asp?s=:003__STATION__:046SeaLvl:002DK:001DEFAULT:04d620:04e400:04f0:04a1:04b48:04i0:04c1:04g0:0641:05opopup";
    $.getJSON(location.protocol + "//api.fcoo.dk/ifm-maps/json/Observations.json", function(data) {
        var geojson = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<img src="' + link_template.replace('__STATION__', feature.properties.id) + '" height="350" width="500" />', {maxWidth: 700, maxHeight: 600});
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
                "pressure": new L.FLayer.Dmi.seaLevelPressure({tileSize: tilesize, zIndex: 200}),
                "precip": new L.FLayer.Dmi.totalPrecipitation({tileSize: tilesize, zIndex: 100}),
                "airtemp": new L.FLayer.Dmi.airTemperature({tileSize: tilesize, zIndex: 100}),
                //"humidity": new L.FLayer.Dmi.humidity({tileSize: tilesize, zIndex: 100}),
                "cloudcover": new L.FLayer.Dmi.totalCloudCover({tileSize: tilesize, zIndex: 100}),
            },
            "FCOO - North Sea/Baltic Sea": {
                "waveperiod": new L.FLayer.Fcoo.wavePeriod({tileSize: tilesize, zIndex: 100, foreground: landLayer}, 'NSBaltic'),
                "waveheight": new L.FLayer.Fcoo.waveHeight({tileSize: tilesize, zIndex: 100, foreground: landLayer}, 'NSBaltic'),
	        "wavedirection": new L.FLayer.Fcoo.waveDirection({tileSize: tilesize, zIndex: 200, foreground: landLayer}, 'NSBaltic'),
                "currentspeed": new L.FLayer.Fcoo.currentSpeed({tileSize: tilesize, zIndex: 100, foreground: landLayer}, 'nsbalt'),
                "currentdirection": new L.FLayer.Fcoo.currentDirection({tileSize: tilesize, zIndex: 200, foreground: landLayer}, 'nsbalt'),
	        "elev": new L.FLayer.Fcoo.elevation({tileSize: tilesize, zIndex: 100, foreground: landLayer}, 'nsbalt'),
	        "seatemp": new L.FLayer.Fcoo.sst({tileSize: tilesize, zIndex: 100, foreground: landLayer}, 'nsbalt'),
	        "salinity": new L.FLayer.Fcoo.sss({tileSize: tilesize, zIndex: 100, foreground: landLayer}, 'nsbalt'),
            },
            "FCOO - Danish Waters": {
                "waveperiod": new L.FLayer.Fcoo.wavePeriod({tileSize: tilesize, zIndex: 100, foreground: landLayer}, 'DKinner'),
                "waveheight": new L.FLayer.Fcoo.waveHeight({tileSize: tilesize, zIndex: 101, foreground: landLayer}, 'DKinner'),
	        "wavedirection": new L.FLayer.Fcoo.waveDirection({tileSize: tilesize, zIndex: 201, foreground: landLayer}, 'DKinner'),
                "currentspeed": new L.FLayer.Fcoo.currentSpeed({tileSize: tilesize, zIndex: 101, foreground: landLayer}, 'idk'),
                "currentdirection": new L.FLayer.Fcoo.currentDirection({tileSize: tilesize, zIndex: 201, foreground: landLayer}, 'idk'),
	        "elev": new L.FLayer.Fcoo.elevation({tileSize: tilesize, zIndex: 101, foreground: landLayer}, 'idk'),
	        "seatemp": new L.FLayer.Fcoo.sst({tileSize: tilesize, zIndex: 101, foreground: landLayer}, 'idk'),
	        "salinity": new L.FLayer.Fcoo.sss({tileSize: tilesize, zIndex: 101, foreground: landLayer}, 'idk'),
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
            "boundaries": {
                "EEZ": new L.tileLayer(fcoo_base + "tiles_EEZ_" + tilesize + "_mercator_201411070000" + "/{z}/{x}/{y}.png",
		     {maxZoom: 10, tileSize: tilesize, subdomains: subdomains, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty_" + tilesize +".png"}),
            },
            "Point forecasts": {
                "Sea level": geojson,
            },
            "Celestial information": {
                "Sun and Moon": new L.Terminator(),
            }
        }

        initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeoMetoc);
    });

});
