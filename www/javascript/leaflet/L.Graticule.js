/*
 Graticule plugin for Leaflet powered maps.
*/
L.Graticule = L.GeoJSON.extend({

    options: {
        style: {
            color: '#333',
            weight: 1
        },
        interval: 20,
        lon_interval: null,
        lat_interval: null,
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
        this._layers = {};

        if (this.options.sphere) {
            this.addData(this._getFrame());
        } else {
            this.addData(this._getGraticule());
        }
    },

    _getFrame: function() {
        return { "type": "Polygon",
          "coordinates": [
              this._getMeridian(-180).concat(this._getMeridian(180).reverse())
          ]
        };
    },

    _getGraticule: function () {
        var features = [], interval = this.options.interval;
        if (this.options.lon_interval == null) {
            lon_interval = interval;
        } else {
            lon_interval = this.options.lon_interval;
        }
        if (this.options.lat_interval == null) {
            lat_interval = interval;
        } else {
            lat_interval = this.options.lat_interval;
        }

        // Meridians
        for (var lng = 0; lng <= 180; lng = lng + lon_interval) {
            features.push(this._getFeature(this._getMeridian(lng), {
                "name": (lng) ? lng.toString() + "° E" : "Prime meridian"
            }));
            if (lng !== 0) {
                features.push(this._getFeature(this._getMeridian(-lng), {
                    "name": lng.toString() + "° W"
                }));
            }
        }

        // Parallels
        for (var lat = 0; lat <= 90; lat = lat + lat_interval) {
            features.push(this._getFeature(this._getParallel(lat), {
                "name": (lat) ? lat.toString() + "° N" : "Equator"
            }));
            if (lat !== 0) {
                features.push(this._getFeature(this._getParallel(-lat), {
                    "name": lat.toString() + "° S"
                }));
            }
        }

        return {
            "type": "FeatureCollection",
            "features": features
        };
    },

    _getMeridian: function (lng) {
        lng = this._lngFix(lng);
        var coords = [];
        for (var lat = -90; lat <= 90; lat++) {
            coords.push([lng, lat]);
        }
        return coords;
    },

    _getParallel: function (lat) {
        var coords = [];
        for (var lng = -180; lng <= 180; lng++) {
            coords.push([this._lngFix(lng), lat]);
        }
        return coords;
    },

    _getFeature: function (coords, prop) {
        return {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": coords
            },
            "properties": prop
        };
    },

    _lngFix: function (lng) {
        if (lng >= 180) return 179.999999;
        if (lng <= -180) return -179.999999;
        return lng;
    }

});

L.graticule = function (options) {
    return new L.Graticule(options);
};
