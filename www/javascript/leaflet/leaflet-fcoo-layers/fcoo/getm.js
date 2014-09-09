/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 */

(function () {
	L.FLayer.Fcoo.currentSpeed = function (options) {
                options = L.extend(options, {attribution: 'Current forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'});
                var layer1 = new L.FLayer.Fcoo._currentSpeed('FCOO/GETM/metoc.full_dom.velocities.surface.3nm.1h.NS1C-v001C.nc', options);
                //options = L.extend(options, {legendImagePath: ''});
                //var layer2 = new L.FLayer.Fcoo._currentSpeed('metoc.dk.velocities.1nm.surface.1h.NS1C', options);
                //return new L.FLayerGroup([layer1, layer2]);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Fcoo._currentSpeed = function (dataset, options) {
                var currentoptions = {layers: 'uu_vv', cmap: 'Current_ms_GYR_9colors'}
                options = L.extend(options, currentoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / GETM / NS1C';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=uu_vv&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Current_ms_GYR_9colors';
		}
		return layer;
	};

	L.FLayer.Fcoo.currentDirection = function (options) {
                options = L.extend(options, {attribution: 'Current forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'});
                var layer1 = new L.FLayer.Fcoo._currentDirection('FCOO/GETM/metoc.full_dom.velocities.surface.3nm.1h.NS1C-v001C.nc', options);
                //var layer2 = new L.FLayer.Fcoo._currentDirection('metoc.dk.velocities.1nm.surface.1h.NS1C', options);
                //return new L.FLayerGroup([layer1, layer2]);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Fcoo._currentDirection = function (dataset, options) {
                var currentoptions = {layers: 'uu:vv'}
                options = L.extend(options, currentoptions);
		var layer = new L.FLayer(dataset, options);
		return layer;
	};

	L.FLayer.Fcoo.elevation = function (options) {
                options = L.extend(options, {attribution: 'Elevation forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'});
                var layer1 = new L.FLayer.Fcoo._elevation('FCOO/GETM/metoc.dk.2Dvars.1nm.2D.1h.NS1C-v001C.nc', options);
                return new L.FLayerGroup([layer1]);
	};
	L.FLayer.Fcoo._elevation = function (dataset, options) {
                var elevationoptions = {layers: 'elev', cmap: 'SeaLvl_m_PBGYR_20colors'}
                options = L.extend(options, elevationoptions);
		var layer = new L.FLayer(dataset, options);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / GETM / NS1C';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=elev&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=SeaLvl_m_PBGYR_20colors';
		}
		return layer;
	};
}());
