(function (){
    "use strict";
    /*jslint browser: true*/
    /*global $, L, initCommonMap, getTilesize*/

    $(document).ready(function () {
        /**
         * Initialize the map.
         */
        var tilesize = getTilesize();
        var langs = ['da', 'en'];
        var basemap = "FCOO Standard";
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
})();
