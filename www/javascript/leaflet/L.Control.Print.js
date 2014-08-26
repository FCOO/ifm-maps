/*global L:false*/

L.Control.Print = L.Control.extend({

	options: {
		position: 'topleft',
		showLayouts: true
	},

	initialize: function (options) {
		L.Control.prototype.initialize.call(this, options);
		this._actionButtons = {};
		this._actionsVisible = false;
	},

	onAdd: function (map) {
		var container = L.DomUtil.create('div', 'leaflet-control-print'),
		    toolbarContainer = L.DomUtil.create('div', 'leaflet-bar', container),
		    link;

		this._toolbarContainer = toolbarContainer;

		link = L.DomUtil.create('a', 'leaflet-print-print', toolbarContainer);
		link.href = '#';
		link.title = 'Print map';

		L.DomEvent
			.on(link, 'click', L.DomEvent.stopPropagation)
			.on(link, 'mousedown', L.DomEvent.stopPropagation)
			.on(link, 'dblclick', L.DomEvent.stopPropagation)
			.on(link, 'click', L.DomEvent.preventDefault)
			.on(link, 'click', this.onPrint, this);

		if (this.options.showLayouts) {
                    this._createActions(container);
                }
		return container;
	},

	onRemove: function () {
		var buttonId,
		    button;

		for (buttonId in this._actionButtons) {
			if (this._actionButtons.hasOwnProperty(buttonId)) {
				button = this._actionButtons[buttonId];
				this._disposeButton(button.button, button.callback, button.scope);
			}
		}

		this._actionButtons = {};
		this._actionsContainer = null;
	},

	_createActions: function (container) {
                var layouts = [{name: "Current timestep", dt: 3, nt: 1}, 
                               {name: "Current to +12h", dt: 3, nt: 5},
                               {name: "Current to +24h", dt: 3, nt: 9},
                               {name: "Current to +48h", dt: 3, nt: 17},
                               {name: "Current to end", dt: 3, nt: 1000}];
		var l = layouts.length,
		    actionsContainer = L.DomUtil.create('ul', 'leaflet-print-actions', container),
		    buttonWidth = 100,
		    containerWidth = (l * buttonWidth) + (l - 1),
		    button,
		    li,
		    i;

		actionsContainer.style.width = containerWidth + 'px';

		for (i = 0; i < l; i++) {
			li = L.DomUtil.create('li', '', actionsContainer);

			button = this._createButton({
				title: 'Print map using the ' + layouts[i].name + ' layout',
				text: this._ellipsis(layouts[i].name, 16),
				container: li,
				callback: this.onActionClick,
				context: this
			});

			this._actionButtons[L.stamp(button)] = {
				name: layouts[i].name,
				dt: layouts[i].dt,
				nt: layouts[i].nt,
				button: button,
				callback: this.onActionClick,
				context: this
			};
		}

		this._actionsContainer = actionsContainer;
	},

	_createButton: function (options) {
		var link = L.DomUtil.create('a', options.className || '', options.container);
		link.href = '#';

		if (options.text) {
			link.innerHTML = options.text;
		}

		if (options.title) {
			link.title = options.title;
		}

		L.DomEvent
			.on(link, 'click', L.DomEvent.stopPropagation)
			.on(link, 'mousedown', L.DomEvent.stopPropagation)
			.on(link, 'dblclick', L.DomEvent.stopPropagation)
			.on(link, 'click', L.DomEvent.preventDefault)
			.on(link, 'click', options.callback, options.context);

		return link;
	},

	_showActionsToolbar: function () {
		L.DomUtil.addClass(this._toolbarContainer, 'leaflet-print-actions-visible');
		this._actionsContainer.style.display = 'block';

		this._actionsVisible = true;
	},

	_hideActionsToolbar: function () {
		this._actionsContainer.style.display = 'none';
		L.DomUtil.removeClass(this._toolbarContainer, 'leaflet-print-actions-visible');

		this._actionsVisible = false;
	},

	_ellipsis: function (value, len) {
		if (value && value.length > len) {
			value = value.substr(0, len - 3) + '...';
		}
		return value;
	},

	// --------------------------------------------------
	// Event Handlers
	// --------------------------------------------------

	onActionClick: function (event) {
		var id = '' + L.stamp(event.target),
		    button,
		    buttonId;

		for (buttonId in this._actionButtons) {
			if (this._actionButtons.hasOwnProperty(buttonId) && buttonId === id) {
				button = this._actionButtons[buttonId];
				this.print(button);
				break;
			}
		}
		this._hideActionsToolbar();
	},

        print: function (layout) {
            // Request same size as current window
            var nx = $(window).width();
            var ny = $(window).height();
            // Base URL for print service
            var baseurl = 'http://api.fcoo.dk/print?nx=' + nx + '&ny=' + ny + '&';
            // We get the url from the permalink
            var permalink = $('.leaflet-control-permalink')[0].childNodes[0];
            var href = permalink.getAttribute('href');
            // Hide controls
            href = href + '&hidecontrols=true';
            var logo = $('<div><img src="http://media.fcoo.dk/logos/FCOO_logo_270x90.png" /></div>');
            // Get time information
            var datetimes = [];
            var datetimes_local = [];
            if ($('.leaflet-datetimeselector-dateselect option').length == 0) {
                console.error('Could not find datetime selector');
            }
            $('.leaflet-datetimeselector-dateselect option').each(function() {
                datetimes.push($(this).val());
                datetimes_local.push($(this).text());
            });
            var current = $('.leaflet-datetimeselector-dateselect option:selected').index();
            var last = datetimes[datetimes.length-1];

            var w = window.open();
            var stepsize = layout.dt;
            var nsteps = layout.nt;
            var fcast = nsteps*stepsize;
            //$(w.document.body).append(logo);
            var imglist = [];
            var bodyHtml = "";
            for (var i=current; i<datetimes.length && i-current<fcast; i=i+stepsize) {
                var datetime = datetimes[i];
                var href_loc = href + '&datetime=' + datetime;
                // Add heading
                var heading = $('<h2>' + datetimes_local[i] + '</h2>');
                var url = baseurl + 'url=' + escape(href_loc);
                var img = $('<img src="' + url + '" />').css({"max-width": "100%"});
                imglist[imglist.length] = img;
                var div = $('<div />').css({"page-break-inside": "avoid",
                                            "max-width": "100%",
                                            "border-style": "solid",
                                            "border-width": "thin"});
                div.append(heading, img);
                var divHtml = div[0].outerHTML;
                bodyHtml = bodyHtml + divHtml;
            }
            $(w.document.body)[0].innerHTML = bodyHtml;
            // Wait until all images are loaded before printing
            var waitImages = function() {
                var imgReady = true;
                for (im in imglist) {
                    var myimg = imglist[im][0];
                    if (!myimg.complete) {
                        imgReady = false;
                        break;
                    }
                    if (typeof myimg.naturalWidth !== "undefined" && myimg.naturalWidth === 0) {
                        imgReady = false;
                        break;
                    }
                }
                if (!imgReady) {
                    setTimeout(waitImages, 500);
                } else {
                    w.print();
                    w.close();
                }
            }
            waitImages();
        },

	onPrint: function () {
		if (this.options.showLayouts) {
			if (!this._actionsVisible) {
				this._showActionsToolbar();
			} else {
				this._hideActionsToolbar();
			}
		} else {
                        /*leafletImage(map, function(err, canvas) {
                            // now you have canvas
                            // example thing to do with that canvas:
                            var img = document.createElement('img');
                            var dimensions = map.getSize();
                            img.width = dimensions.x;
                            img.height = dimensions.y;
                            img.src = canvas.toDataURL();
                            document.getElementById('images').innerHTML = '';
                            document.getElementById('images').appendChild(img);
                        });*/
                        //window.print();
                        //this.print('Current timestep');
		}
	}
});

L.Control.print = function (options) {
	return new L.Control.Print(options);
};
