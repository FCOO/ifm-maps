/**
 * A JavaScript library for using Danish Defence Center for Operational Oceanography's (FCOO)
 * METOC forecast layers leaflet based maps without hassle.
 */

(function () {
	L.FLayer.Fcoo.currentSpeed = function (options, domain) {
                options = L.extend(options, {attribution: 'Current forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'});
                var layer;
                switch (domain) {
                    case 'nsbalt':
                        var layer = L.FLayer.Fcoo._currentSpeed('FCOO/GETM/nsbalt.velocities.1nm.surface.1h.DK1NM-v002C.nc', options);
                        break;
                    case 'idk':
                        var layer = L.FLayer.Fcoo._currentSpeed('FCOO/GETM/idk.velocities.600m.surface.1h.DK600-v004C.nc', options);
                        break;
                    default:
                        var msg = 'Error initializing current speed for domain ' + domain;
                        console.error(msg)
                        var n = noty({text: msg, type: "error"});
                        throw new Error(msg);
                        break;
                } 
                return layer;
	};
	L.FLayer.Fcoo._currentSpeed = function (dataset, options) {
                var currentoptions = {layers: 'uu_vv', cmap: 'Current_ms_GYR_9colors'}
                var currentoptions = L.extend(currentoptions, options);
		var layer = new L.FLayer(dataset, currentoptions);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / GETM';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=uu_vv&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=Current_ms_GYR_9colors';
		}
		return layer;
	};

	L.FLayer.Fcoo.currentDirection = function (options, domain) {
                options = L.extend(options, {attribution: 'Current forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'});
                var layer;
                switch (domain) {
                    case 'nsbalt':
                        var layer = L.FLayer.Fcoo._currentDirection('FCOO/GETM/nsbalt.velocities.1nm.surface.1h.DK1NM-v002C.nc', options);
                        break;
                    case 'idk':
                        var layer = L.FLayer.Fcoo._currentDirection('FCOO/GETM/idk.velocities.600m.surface.1h.DK600-v004C.nc', options);
                        break;
                    default:
                        var msg = 'Error initializing current direction for domain ' + domain;
                        console.error(msg)
                        var n = noty({text: msg, type: "error"});
                        throw new Error(msg);
                        break;
                } 
                return layer;
	};
	L.FLayer.Fcoo._currentDirection = function (dataset, options) {
                var currentoptions = {layers: 'uu:vv', styles: 'black_vector,0.3'}
                currentoptions = L.extend(currentoptions, options);
		var layer = new L.FLayer(dataset, currentoptions);
		return layer;
	};

	L.FLayer.Fcoo.elevation = function (options, domain) {
                options = L.extend(options, {attribution: 'Elevation forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'});
                var layer;
                switch (domain) {
                    case 'nsbalt':
                        var layer = L.FLayer.Fcoo._elevation('FCOO/GETM/nsbalt.2Dvars.1nm.2D.1h.DK1NM-v002C.nc', options);
                        break;
                    case 'idk':
                        var layer = L.FLayer.Fcoo._elevation('FCOO/GETM/idk.2Dvars.600m.2D.1h.DK600-v004C.nc', options);
                        break;
                    default:
                        var msg = 'Error initializing elevation for domain ' + domain;
                        console.error(msg)
                        var n = noty({text: msg, type: "error"});
                        throw new Error(msg);
                        break;
                } 
                return layer;
	};
	L.FLayer.Fcoo._elevation = function (dataset, options) {
                var elevationoptions = {layers: 'elev', cmap: 'SeaLvl_m_PBGYR_20colors'}
                elevationoptions = L.extend(elevationoptions, options);
		var layer = new L.FLayer(dataset, elevationoptions);
		if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / GETM';
			layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=elev&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=SeaLvl_m_PBGYR_20colors';
		}
		return layer;
	};

        L.FLayer.Fcoo.sss = function (options, domain) {
                options = L.extend(options, {attribution: 'Sea surface salinity forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'});
                var layer;
                switch (domain) {
                    case 'nsbalt':
                        var layer = L.FLayer.Fcoo._sss('FCOO/GETM/nsbalt.salt-temp.1nm.surface.1h.DK1NM-v002C.nc', options);
                        break;
                    case 'idk':
                        var layer = L.FLayer.Fcoo._sss('FCOO/GETM/idk.salt-temp.600m.surface.1h.DK600-v004C.nc', options);
                        break;
                    default:
                        var msg = 'Error initializing sea surface salinity for domain ' + domain;
                        console.error(msg)
                        var n = noty({text: msg, type: "error"});
                        throw new Error(msg);
                        break;
                } 
                return layer;
        };
        L.FLayer.Fcoo._sss = function (dataset, options) {
                var extraoptions = {layers: 'salt', cmap: 'PrSal_psu_GB_18colors'}
                extraoptions = L.extend(extraoptions, options);
                var layer = new L.FLayer(dataset, extraoptions);
                if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / GETM';
                        layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=salt&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=PrSal_psu_GB_18colors';
                }
                return layer;
        };

        L.FLayer.Fcoo.sst = function (options, domain) {
                options = L.extend(options, {attribution: 'Sea surface temperature forecasts from <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a>'});
                var layer;
                switch (domain) {
                    case 'nsbalt':
                        var layer = L.FLayer.Fcoo._sst('FCOO/GETM/nsbalt.salt-temp.1nm.surface.1h.DK1NM-v002C.nc', options);
                        break;
                    case 'idk':
                        var layer = L.FLayer.Fcoo._sst('FCOO/GETM/idk.salt-temp.600m.surface.1h.DK600-v004C.nc', options);
                        break;
                    default:
                        var msg = 'Error initializing sea surface temperature for domain ' + domain;
                        console.error(msg)
                        var n = noty({text: msg, type: "error"});
                        throw new Error(msg);
                        break;
                } 
                return layer;
        };
        L.FLayer.Fcoo._sst = function (dataset, options) {
                var extraoptions = {layers: 'temp', cmap: 'SeaTemp_C_BGYR_13colors'}
                extraoptions = L.extend(extraoptions, options);
                var layer = new L.FLayer(dataset, extraoptions);
                if (layer.options.legendImagePath == null) {
                        layer.options.legendAttribution = 'Source: <a href="http://fcoo.dk" alt="Danish Defence Center for Operational Oceanography">FCOO</a> / GETM';
                        layer.options.legendImagePath = layer._fcootileurl + '?SERVICE=WMS&REQUEST=GetColorbar&VERSION=1.1.1&LAYERS=temp&STYLES=horizontal&FORMAT=image%2Fpng&TRANSPARENT=false&CMAP=SeaTemp_C_BGYR_13colors';
                }
                return layer;
        };

}());
