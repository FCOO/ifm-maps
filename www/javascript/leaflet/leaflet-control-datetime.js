/**
 * Adds a time selector to Leaflet based maps.
 **/
(function() {

L.DatetimeSelector = L.Control.extend({

	options: {
		  datetimes: new Array()
		, callback: null
		, title: null
                , language: null
		, position: 'topright'
                , visibility: 'visible'
		, vertical: false
                , localtime: false
		, initialDatetime: null
	},

	initialize: function(options) {
		L.Util.setOptions(this, options);
		this._container = L.DomUtil.create('div',
			'leaflet-control-layers leaflet-control-layers-expanded leaflet-control-datetime');
                if (this.options.visibility == 'hidden') {
                    $(this._container).css("visibility", this.options.visibility);
                }
                $(this._container).addClass("hide-on-print");

		L.DomEvent.disableClickPropagation(this._container);
		this._createDatetimeSelector(this._container);
	},

	onAdd: function(map) {
		this._map = map;
                this._map.on("overlayadd overlayremove", this._layersChanged, this);
		return this._container;
	},

	onRemove: function(map) {
		this._container.style.display = 'none';
                this._map.off("overlayadd overlayremove", this._layersChanged, this);
		this._map = null;
	},

	_createDatetimeSelector: function(container) {
		if (this.options.title) {
			var titleDiv = L.DomUtil.create('div', 'leaflet-control-datetime-title', container);
			titleDiv.innerHTML = this.options.title;
		}
                var selectList = L.DomUtil.create('select', 'leaflet-control-datetime-dateselect', container);
                selectList._instance = this;
                var select_index = 0;
		for (var i1=0; i1<this.options.datetimes.length; i1++) {
                    var option = document.createElement("option");
                    var date = this.options.datetimes[i1];
                    option.value = date.toISOString();
                    //option.text = date.toISOString().substr(0,16);
                    var locmoment = moment(date);
                    if (this.options.language != null) {
                        locmoment.lang(this.options.language);
                    }
                    locmoment = locmoment.format('LLLL');
                    locmoment = locmoment.charAt(0).toUpperCase() + locmoment.slice(1);
                    option.text = locmoment;
                    //option.text = date.toString().split(' (')[0];
                    selectList.appendChild(option);
                    if (this.options.initialDatetime != null) {
                        if (this.options.initialDatetime.getTime() == date.getTime()) {
                            select_index = i1;
                            if (this.options.callback != null) {
                                this.options.callback(option.value);
                            }
                        }
                    }
                }
                if (this.options.initialDatetime == null) {
                    select_index = this._getNowIndex();
                    if (this.options.callback != null) {
                        if (select_index != null) {
                            this.options.callback(selectList.options[select_index].value);
                        }
                    }
                }
                selectList.onchange = this._datetimeChanged;
                selectList.selectedIndex = select_index;
		//L.DomEvent.addListener(selectList, 'onchange', this._datetimeChanged, L.DomEvent.stopPropagation);

                // Add slider control (jquery-ui)
                var sliderDiv = $(L.DomUtil.create('div', 'leaflet-control-datetime-sliderdiv', container));
                sliderDiv.slider({
                    "class": "leaflet-control-datetime-slider",
                    min: 0,
                    max: this.options.datetimes.length-1,
                    value: select_index,
                    slide: this._sliderChanged
                });
                // Create time slider shade
                sliderRange = $('<div id="leaflet-control-datetime-range"></div>');
                sliderDiv.append(sliderRange);

                // Add datetime button controls
                var buttonDiv = L.DomUtil.create('div', 'leaflet-control-datetime-buttondiv', container);
                var startButton = $('<button class="btn btn-default btn-lg"><i class="fa fa-fast-backward fa-lg"></i></button>');
                startButton.click(this._datetimeStart);
                startButton.appendTo(buttonDiv);

                var backButton = $('<button class="btn btn-default btn-lg"><i class="fa fa-step-backward fa-lg"></i></button>');
                backButton.click(this._datetimeBack);
                backButton.appendTo(buttonDiv);

                var nowstr = this._('Now');
                nowstr = '<button class="btn btn-default btn-lg">' + nowstr + '</button>';
                var nowButton = $(nowstr);
                nowButton.click(this._datetimeNow);
                nowButton.appendTo(buttonDiv);

                var forwardButton = $('<button class="btn btn-default btn-lg"><i class="fa fa-step-forward fa-lg"></i></button>');
                forwardButton.click(this._datetimeForward);
                forwardButton.appendTo(buttonDiv);

                var endButton = $('<button class="btn btn-default btn-lg"><i class="fa fa-fast-forward fa-lg"></i></button>');
                endButton.click(this._datetimeEnd);
                endButton.appendTo(buttonDiv);

                // Add local time checkbox
                var timecb = $('<input>', {
                                type: "checkbox",
                                checked: "checked",
                                "class": "leaflet-control-datetime-localtime-checkbox"
                             });
                timecb.click(function(pEvent) {
                    var select = $('.leaflet-control-datetime-dateselect')[0];
                    var datetimes = select._instance.options.datetimes;
		    for (var i=0; i<datetimes.length; i++) {
                        var locmoment = moment(datetimes[i]);
                        if (select._instance.options.language != null) {
                            locmoment.lang(select._instance.options.language);
                        }
                        if (this.checked) {
                            //select.options[i].text = datetimes[i].toString().split(' (')[0];
                            locmoment = locmoment.format('LLLL');
                            locmoment = locmoment.charAt(0).toUpperCase() + locmoment.slice(1);
                            select.options[i].text = locmoment;
                        } else {
                            locmoment = locmoment.zone('+0000').format('LLLL');
                            locmoment = locmoment.charAt(0).toUpperCase() + locmoment.slice(1);
                            select.options[i].text = locmoment + ' GMT';
                            //select.options[i].text = datetimes[i].toUTCString();
                        }
                    }
                });
                timecb._instance = this;
                var lbl = $('<label>');
                var d = new Date();
                function pad(num) {
                    norm = Math.abs(Math.floor(num));
                    return (norm < 10 ? '0' : '') + norm;
                }
                function formatTimezone() {
                    var local = new Date();
                    var tzo = -local.getTimezoneOffset();
                    var sign = tzo >= 0 ? '+' : '-';
                    return sign + pad(tzo / 60) + ':' + pad(tzo % 60);
                }
                var txt = this._('Use local time') + ' (GMT' + formatTimezone() + ')';
                var spn = lbl.append(timecb).append($('<span>' + txt + '</span>'));
                var localdiv = $('<div>', {"class": "leaflet-control-datetime-localtime"}).append(spn);
                localdiv.appendTo(container);
	},

        _layersChanged: function(pEvent) {
                // Find min and max time for selector (reversed)
                var datetimes = this.options.datetimes;
                var tmin = datetimes[datetimes.length-1];
                var tmax = datetimes[0];
                // Find min and max time
                this._map.eachLayer(function (layer) {
                    if (layer._overlay !== undefined && layer._overlay === true) {
                        if (layer.getTimesteps !== undefined) {
                            var timesteps = layer.getTimesteps();
                            if (timesteps !== null && timesteps.length > 1) {
                                tmin = (timesteps[0] < tmin ? timesteps[0] : tmin);
                                tmax = (timesteps[timesteps.length-1] > tmax ? timesteps[timesteps.length-1] : tmax);
                            }
                        }
                    }
                });
                // Find indices for min and max
                var minDiff = 10000000000;
                var imin = null;
                for (i in datetimes) {
                    var m = Math.abs(tmin - datetimes[i]);
                    if (m < minDiff) { 
                        minDiff = m;
                        imin = parseInt(i);
                    }
                }
                var minDiff = 10000000000;
                var imax = null;
                for (i in datetimes) {
                    var m = Math.abs(tmax - datetimes[i]);
                    if (m < minDiff) { 
                        minDiff = m;
                        imax = parseInt(i);
                    }
                }
                var sliderRange = $("#leaflet-control-datetime-range");
                if (imax > imin) {
                    // Calculate slider percentages
                    ifull = datetimes.length-1;
                    var pmin = imin/ifull*100.0;
                    var pmax = imax/ifull*100.0;
                    var pwidth = pmax - pmin;
                    // Set slider range to span min to max
                    sliderRange.css({"margin-left": pmin + "%", "width": pwidth + "%"});
                } else {
                    // Unset slider range when no overlays are selected
                    sliderRange.css({"margin-left": "", "width": ""});
                }
        },

        _datetimeUpdate: function(select) {
                var date = select.options[select.selectedIndex].value;
                var container = select.parentElement;

		// callback
		if (this.options.callback && typeof this.options.callback == 'function') {
			this.options.callback(date);
		}
        },

	_datetimeChanged: function(pEvent) {
                var select = $('select.leaflet-control-datetime-dateselect')[0];
		var inst = select._instance;
                var index = select.selectedIndex;
                $('.leaflet-control-datetime-sliderdiv').slider("value", index);
                inst._datetimeUpdate(select);
	},

	_sliderChanged: function(pEvent, elem) {
                var select = $('select.leaflet-control-datetime-dateselect')[0];
                var index = Math.max(Math.min(elem.value, select.length - 1), 0);
                select.selectedIndex = index;
                elem.value = index;
		var inst = select._instance;
                inst._datetimeUpdate(select);
	},

	_datetimeStart: function(pEvent) {
		var elem = pEvent.target;
                var index = 0;
                var select = $('select.leaflet-control-datetime-dateselect')[0];
                select.selectedIndex = index;
                $('.leaflet-control-datetime-sliderdiv').slider("value", index);
		var inst = select._instance;
                inst._datetimeUpdate(select);
	},

	_datetimeBack: function(pEvent) {
                var select = $('select.leaflet-control-datetime-dateselect')[0];
                var index = Math.max(select.selectedIndex - 1, 0);
                select.selectedIndex = index;
                $('.leaflet-control-datetime-sliderdiv').slider("value", index);
                var inst = select._instance;
                inst._datetimeUpdate(select);
	},

	_datetimeNow: function(pEvent) {
                var select = $('select.leaflet-control-datetime-dateselect')[0];
		var inst = select._instance;
                var index = inst._getNowIndex();
                select.selectedIndex = index;
                $('.leaflet-control-datetime-sliderdiv').slider("value", index);
                inst._datetimeUpdate(select);
	},

        _getNowIndex: function() {
                // Find nearest index
                var options = this.options.datetimes;
                var now = new Date();
                var minDiff = 10000000000;
                var index = null;
                for (i in options) {
                    var m = Math.abs(now - options[i]);
                    if (m < minDiff) { 
                        minDiff = m; 
                        index = i; 
                    }
                }
                return index;
        }, 

	_datetimeForward: function(pEvent) {
                var select = $('select.leaflet-control-datetime-dateselect')[0];
                var index = Math.min(select.selectedIndex + 1, select.length - 1);
                select.selectedIndex = index;
                $('.leaflet-control-datetime-sliderdiv').slider("value", index);
		var inst = select._instance;
                inst._datetimeUpdate(select);
	},

	_datetimeEnd: function(pEvent) {
                var select = $('select.leaflet-control-datetime-dateselect')[0];
                var index = select.length - 1;
                select.selectedIndex = index;
                $('.leaflet-control-datetime-sliderdiv').slider("value", index);
		var inst = select._instance;
                inst._datetimeUpdate(select);
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

L.dateObject = function(dateId, text, img) {
	return {
		id: dateId,
		displayText: text,
		image: img
	}
};


L.datetimeSelector = function(options) { return new L.DatetimeSelector(options); };

})();
