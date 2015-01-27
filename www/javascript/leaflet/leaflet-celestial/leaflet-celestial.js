/**
 * Adds celestial information control to Leaflet based maps.
 **/
(function() {

L.Celestial = L.Control.extend({

    options: {
        position: 'bottomleft'
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
        this._container = L.DomUtil.create('div', 'leaflet-control-celestial');
        $(this._container).addClass("hide-on-print");
        // SVG object representing Moon
        this._svgobj = $('<svg id="moon" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" version="1.1"/>');
        //this._riseobj = $('<div id="riseset" style="background: white"><table><tr><td><span title="moonrise" id="moonrise"/></td><td title="moonrise">☽</td><td><span title="moonset" id="moonset"/></td><td title="moonset">☾</td></tr><tr><td><span title="sunrise" id="sunrise"/></td><td title="sunrise">☼</td><td><span title="sunset" id="sunset"></td><td title="sunset">☀</td></tr><tr><td colspan="2"><span style="font-size: small;" id="date"/></td><td><span id="mooncent"/></td><td><span id="zodiac"></td></tr></table></div>');
        this._riseobj = $('<div id="riseset" style="background: white"><table><tr><td><span title="moonrise" id="moonrise"/></td><td title="moonrise">☽</td><td><span title="moonset" id="moonset"/></td><td title="moonset">☾</td></tr><tr><td><span title="sunrise" id="sunrise"/></td><td title="sunrise">☼</td><td><span title="sunset" id="sunset"></td><td title="sunset">☀</td></tr><tr><td colspan="4"><span style="font-size: small;" id="date"/></td></tr></table></div>');
        var divelem = $('<div style="background: black" />');
        //divelem.append(this._svgobj).append(this._riseobj);
        divelem.append(this._riseobj);
        this._container.innerHTML = divelem.prop('outerHTML');
        this._$container = $(this._container);

        // Put in info
        var today = today || new Date();
        this._today = today;
        var year = today.getFullYear();
        var day = today.getDate();
        var month = today.getMonth()+1; // 0 index :(
        var hours = today.getHours();
        this._tz = -today.getTimezoneOffset()/60;
        this._mj = mjd(day, month, year, 0.0);
        var jcontainer = this._$container;
        //jcontainer.find('#mooncent')[0].innerHTML = (moon_day(today)*100).toFixed(2) + "%";
        jcontainer.find('#date')[0].innerHTML = year + "/" + month + "/" + day;
        //this._unimoon = phase_junk(moon_day(today), this._svgobj);
    },

    onAdd: function(map) {
        this._map = map;
        map.on('mousemove', this._onMouseMove, this);

        //this._create(this._container);
        return this._container;
    },

    onRemove: function(map) {
        map.off('mousemove', this._onMouseMove);
        this._map = null;
    },


    _onMouseMove: function (e) {
        var lon = e.latlng.lng;
        var lat = e.latlng.lat;
        var riset = find_moonrise_set(this._mj, this._tz, lon, lat);
        var moonrise = riset[0];
        var moonset = riset[1];
        var jcontainer = this._$container;
        jcontainer.find('#moonrise')[0].innerHTML = moonrise;
        jcontainer.find('#moonset')[0].innerHTML = moonset;
        var sunrs = find_sun_and_twi_events_for_date(this._mj, this._tz, lon, lat).split(" ");
        var sunrise = sunrs[1];
        var sunset = sunrs[2];
        jcontainer.find('#sunrise')[0].innerHTML = sunrise;
        jcontainer.find('#sunset')[0].innerHTML = sunset;
    },

    _create: function(container) {
    },

    _: function(key) {
        var lang = this.options.language;
        var i18n = {
            en: {
                  'Use local time': 'Use local time',
                  'Now': 'Now'
                },
            da: {
                  'Use local time': 'Brug lokal tid',
                  'Now': 'Nu'
                }
        };

        if (typeof i18n[lang] != 'undefined'
            && typeof i18n[lang][key] != 'undefined') {
            return  i18n[lang][key];
        }
        return key;
    },

});

L.celestial = function(options) { return new L.Celestial(options); };

})();
