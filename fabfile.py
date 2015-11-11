"""
Use Fabric for building IFM Maps.

Build:
  fab build
"""
import datetime, tempfile, shutil, os
from distutils.util import strtobool

from fabric.api import env, local, run, cd, sudo, lcd
from fabric.contrib.files import sed, exists
from fabric.contrib.project import rsync_project

env.roledefs = {
    'local': ['localhost'],
}

if not len(env.roles):
    env.roles = ["local"]

env.setups = {'greenland': 'Greenland',
              'faroe_islands': 'Faroe Islands',
              'denmark': 'Denmark', 
              'mediterranean': 'Mediterranean',
              'indian_ocean': 'Indian Ocean',
              'denmark_impact': 'Denmark',
              'denmark_impact_land': 'Denmark',
              'greenland_impact': 'Greenland',
              'faroe_islands_impact': 'Faroe Islands',
              'indian_ocean_impact': 'Indian Ocean'}

env.cssfiles = ["bower_components/fontawesome/css/font-awesome.min.css",
                "bower_components/leaflet/dist/leaflet.css",
                "bower_components/Leaflet.MousePosition/src/L.Control.MousePosition.css",
                "bower_components/leaflet-languageselector/leaflet-languageselector.css",
                "bower_components/leaflet-locatecontrol/dist/L.Control.Locate.css",
                "external/flag-icon-css/css/flag-icon.css",
                "bower_components/leaflet-control-position/leaflet-control-position.css",
                "bower_components/leaflet-control-home/leaflet-control-home.css",
                "bower_components/leaflet-categorized-layers/src/radio-checkbox.css",
                "bower_components/leaflet-categorized-layers/src/leaflet-categorized-layers.css",
                "bower_components/leaflet-control-vertical/leaflet-control-vertical.css",
                "bower_components/leaflet-control-datetime/leaflet-control-datetime.css",
                "bower_components/leaflet-control-legend/leaflet-control-legend.css",
                "bower_components/leaflet-layer-sealevel-denmark/leaflet-layer-sealevel-denmark.css",
                "bower_components/leaflet-control-forecast-print/leaflet-control-forecast-print.css",
                "bower_components/leaflet-geojsonlayer-msi/leaflet-geojsonlayer-msi.css",
                "bower_components/leaflet-geojsonlayer-fwarn/leaflet-geojsonlayer-fwarn.css",
                "bower_components/leaflet-tilelayer-impact/leaflet-tilelayer-impact.css",
                "bower_components/leaflet-graphicscale/dist/leaflet-graphicscale.min.css",
                "leaflet/Control.OSMGeocoder.ifm-maps.css",
                "css/ifm-maps.css"]

env.cssfiles_min = ["external/jquery-ui-1.11.4.custom/jquery-ui.structure.min.css",
                    "external/jquery-ui-1.11.4.custom/jquery-ui.theme.min.css",
                    "bower_components/leaflet-control-box/dist/leaflet-control-box.min.css"]
env.cssfiles_src = ["external/jquery-ui-1.11.4.custom/jquery-ui.structure.css",
                    "external/jquery-ui-1.11.4.custom/jquery-ui.theme.css"]

env.jsfiles = ["bower_components/jquery/dist/jquery.js",
               "external/jquery-ui-1.11.4.custom/jquery-ui.js",
               "bower_components/noty/js/noty/packaged/jquery.noty.packaged.js",
               "bower_components/jquery-placeholder/jquery.placeholder.js",
               "bower_components/magellan/magellan.js",
               "bower_components/latlng-format/src/latlng-format.js",
               "bower_components/moment/min/moment-with-locales.js",
               "bower_components/leaflet/dist/leaflet-src.js",
               "bower_components/leaflet-plugins/control/Permalink.js",
               "bower_components/leaflet-languageselector/leaflet-languageselector.js",
               "bower_components/Leaflet.MousePosition/src/L.Control.MousePosition.js",
               "bower_components/leaflet-control-osm-geocoder/Control.OSMGeocoder.js",
               "bower_components/Leaflet.dbpediaLayer/dist/leaflet.dbpedialayer.js",
               "bower_components/leaflet-locatecontrol/src/L.Control.Locate.js",
               "bower_components/Leaflet.Terminator/L.Terminator.js",
               "bower_components/leaflet-control-box/dist/leaflet-control-box.min.js",
               "bower_components/leaflet-control-position/leaflet-control-position.js",
               "bower_components/leaflet-control-home/leaflet-control-home.js",
               "bower_components/leaflet-categorized-layers/src/namespace.js",
               "bower_components/leaflet-categorized-layers/src/radio-checkbox.js",
               "bower_components/leaflet-categorized-layers/src/leaflet-categorized-layers.js",
               "bower_components/leaflet-control-vertical/leaflet-control-vertical.js",
               "bower_components/leaflet-control-datetime/leaflet-control-datetime.js",
               "bower_components/leaflet-tilelayer-counting/leaflet-tilelayer-counting.js",
               "bower_components/leaflet-control-legend/leaflet-control-legend.js",
               "bower_components/leaflet-control-forecast-print/leaflet-control-forecast-print.js",
               "bower_components/leaflet-tilelayer-wms-fcoo/leaflet-tilelayer-wms-model.js",
               "bower_components/leaflet-tilelayer-wms-fcoo/leaflet-tilelayer-wms-fcoo.js",
               "bower_components/leaflet-tilelayer-wms-fcoo/wms-ajax-proxy.js",
               "bower_components/leaflet-layer-sealevel-denmark/leaflet-layer-sealevel-denmark.js",
               "bower_components/leaflet-layer-tides-greenland/leaflet-layer-tides-greenland.js",
               "bower_components/leaflet-pip/leaflet-pip.js",
               "bower_components/leaflet-geojsonlayer-msi/leaflet-geojsonlayer-msi.js",
               "bower_components/leaflet-geojsonlayer-fwarn/leaflet-geojsonlayer-fwarn.js",
               "bower_components/leaflet-tilelayer-impact/leaflet-tilelayer-impact.js",
               "bower_components/leaflet-tilelayer-impact/leaflet-tilelayer-impact-store.js",
               "bower_components/leaflet-tilelayer-impact/Permalink.ImpactLayer.js",
               "bower_components/leaflet-graphicscale/dist/leaflet-graphicscale.min.js",
               "bower_components/leaflet-control-fa-button/leaflet-control-fa-button.js",
               "leaflet/Control.FcooLocate.js",
               "leaflet/Permalink.Locate.js",
               "leaflet/Permalink.Vertical.js",
               "leaflet/Permalink.CategorizedLayer.js",
               "leaflet/Permalink.CategorizedOverlay.js",
               "javascript/lang.js",
               "javascript/url.js",
               "javascript/map_common.js",
               "javascript/setup.js"]

env.jsfiles_extra = []
#env.jsfiles_extra = ["bower_components/jquery/dist/jquery.min.js",
#                     "bower_components/jquery-ui/jquery-ui.min.js",
#                     "bower_components/noty/js/noty/packaged/jquery.noty.packaged.js"]

env.now = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')

def _booleanize(func):
    """Converts minify argument to boolean."""
    def inner(*args, **kwargs):
        if 'minify' in kwargs and not isinstance(kwargs['minify'], (bool, )):
            kwargs['minify'] = bool(strtobool(kwargs['minify']))
        return func(*args, **kwargs)
    return inner

@_booleanize
def jshint():
    """Executes jshint on JS files."""
    local('jshint --show-non-errors javascript/. leaflet/.')

@_booleanize
def build_css(minify=True):
    local('mkdir -p dist/css')
    cssfiles = ' '.join(env.cssfiles)
    cssfile = 'dist/css/ifm-maps_%s.css' % env.now
    cssfile_min = 'dist/css/ifm-maps_min_%s.css' % env.now
    local('awk \'FNR==1{print ""}1\' %s > %s' % (cssfiles, cssfile))
    if minify:
        local('yui-compressor -o %s %s' % (cssfile_min, cssfile))
    # Include files excluded from compression
    cssfiles = env.cssfiles_src + [cssfile]
    cssfiles = ' '.join(cssfiles)
    local('awk \'FNR==1{print ""}1\' %s > tmp.css && mv tmp.css %s' % (cssfiles, cssfile))
    # Remove source mapping lines
    local("sed -i 's/\/\*# sourceMappingURL=/\/\* /' %s" % cssfile)
    cssfiles = env.cssfiles_min + [cssfile_min]
    cssfiles = ' '.join(cssfiles)
    local('awk \'FNR==1{print ""}1\' %s > tmp.css && mv tmp.css %s' % (cssfiles, cssfile_min))
    # Remove source mapping lines
    local("sed -i 's/\/\*# sourceMappingURL=/\/\* /' %s" % cssfile_min)

@_booleanize
def build_js(minify=True):
    local('mkdir -p dist')
    jsfiles = env.jsfiles
    jsfiles_min = env.jsfiles_extra
    destdir = 'dist/javascript'
    local('mkdir -p %s' % destdir)
    jsfilestr = ' '.join(jsfiles)
    jsfile = '%s/ifm-maps_%s.js' % (destdir, env.now)
    jsfile_min = '%s/ifm-maps_min_%s.js' % (destdir, env.now)
    local('awk \'FNR==1{print ""}1\' %s > %s' % (jsfilestr, jsfile))
    if minify:
        local('/usr/bin/node /usr/bin/uglifyjs -o %s %s' % (jsfile_min, jsfile))
    # Include previously compressed files
    jsfiles_all = jsfiles_min + [jsfile]
    jsfilestr = ' '.join(jsfiles_all)
    local('awk \'FNR==1{print ""}1\' %s > tmp.js && mv tmp.js %s' % (jsfilestr, jsfile))
    jsfiles_all = jsfiles_min + [jsfile_min]
    jsfilestr = ' '.join(jsfiles_all)
    local('awk \'FNR==1{print ""}1\' %s > tmp.js && mv tmp.js %s' % (jsfilestr, jsfile_min))

@_booleanize
def build_web():
    local('mkdir -p dist')
    local('cp index.html dist/.')
    local('cp -r www dist/.')
    local('mkdir dist/json')
    local('cp bower_components/leaflet-layer-tides-greenland/tidal_stations_greenland.json dist/json/.')
    local('cp bower_components/leaflet-layer-sealevel-denmark/sealevel_stations_denmark.json dist/json/.')
    #local('cp -r javascript dist/.')
    #local('cp -r leaflet dist/.')
    #local('cp -r bower_components dist/.')
    #local('cp -r css/ifm-maps.css dist/css/.')
    local('cp -r leaflet/images dist/css/.')
    local('cp -r bower_components/leaflet/dist/images/* dist/css/images/.')
    local('cp bower_components/typedarray/index.js dist/javascript/typedarray.js')
    local('cp bower_components/jQuery-ajaxTransport-XDomainRequest/jquery.xdomainrequest.min.js dist/javascript/jquery.xdomainrequest.min.js')
    local('cp -r bower_components/leaflet-control-home/images/* dist/css/images/.')
    local('cp -r bower_components/leaflet-control-position/images/* dist/css/images/.')
    local('cp -r bower_components/leaflet-control-osm-geocoder/images/* dist/css/images/.')
    local('cp -r external/jquery-ui-1.11.4.custom/images/* dist/css/images/.')
    local('cp -r bower_components/leaflet-control-forecast-print/images/printer.png dist/css/images/.')
    local('cp -r external/flag-icon-css/flags dist/.')
    #local('cp -r bower_components/leaflet-control-datetime/fontello/font dist/.')
    local('cp -r bower_components/fontawesome/fonts dist/.')

    # Modify html files to use time stamped css and js files
    local('cp dist/www/index-prod.html dist/www/index-dev.html')
    local('sed -i s/ifm-maps.css/ifm-maps_min_%s.css/ dist/www/index-prod.html' % env.now)
    local('sed -i s/ifm-maps.js/ifm-maps_min_%s.js/ dist/www/index-prod.html' % env.now)
    local('sed -i s/ifm-maps.css/ifm-maps_%s.css/ dist/www/index-dev.html' % env.now)
    local('sed -i s/ifm-maps.js/ifm-maps_%s.js/ dist/www/index-dev.html' % env.now)

    # Make index.html files for each domain
    for setup, name in env.setups.iteritems():
        print('Processing %s' % setup)
        destdir = 'dist/%s' % setup
        local('mkdir -p %s' % destdir)
        # Production index file
        local('cp dist/www/index-prod.html %s/index.html' % (destdir))
        local("sed -i 's/\${domain}/%s/' %s/index.html" % (name, destdir))
        local("sed -i 's/\${version}/%s/' %s/index.html" % (env.now, destdir))
        local("sed -i 's/denmark/%s/' %s/index.html" % (setup, destdir))
        # Development index file (for debugging)
        local('cp dist/www/index-dev.html %s/index-dev.html' % (destdir))
        local("sed -i 's/\${domain}/%s/' %s/index-dev.html" % (name, destdir))
        local("sed -i 's/denmark/%s/' %s/index-dev.html" % (setup, destdir))
        # Manifest file for webapp mode
        local('cp dist/www/manifest.json %s/.' % (destdir))

    # Remove original index files
    local('rm -rf dist/www')

@_booleanize
def build(minify=True):
    """Minify, concatenate and build distributable files for IFM Maps."""
    jshint()
    local('rm -rf dist')
    build_css(minify=minify)
    build_js(minify=minify)
    build_web()
