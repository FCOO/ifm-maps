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

    var overlays = {
        "Impact": {
            "Boarding": new L.FLayer.Impact.boarding({tileSize: tilesize, zIndex: 100, foreground: landLayer}),
            "Helicopter": new L.FLayer.Impact.helo_tol({tileSize: tilesize, zIndex: 100, foreground: landLayer}),
            "Replenishment": new L.FLayer.Impact.replenishment({tileSize: tilesize, zIndex: 100, foreground: landLayer}),
        },
        "boundaries": {
            "EEZ": new L.tileLayer(fcoo_base + "tiles_EEZ_" + tilesize + "_mercator_201411070000" + "/{z}/{x}/{y}.png", {maxZoom: 10, tileSize: tilesize, subdomains: subdomains, zIndex: 200, continuousWorld: false, errorTileUrl: fcoo_base + "empty_" + tilesize +".png"}),
        },
        "Celestial information": {
            "Sun and Moon": new L.Terminator(),
        }
    }
    initCommonMap(langs, basemap, overlays, minZoom, maxZoom, zoom, lat, lon, tilesize, useGeoMetoc);
});
