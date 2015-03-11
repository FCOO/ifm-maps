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

env.setups = ['greenland', 'faroe_islands', 'denmark', 
              'mediterranean', 'indian_ocean', 'denmark_impact',
              'greenland_impact']

env.cssfiles = ["bower_components/fontawesome/css/font-awesome.css",
                "bower_components/leaflet/dist/leaflet.css",
                "bower_components/Leaflet.MousePosition/src/L.Control.MousePosition.css",
                "bower_components/leaflet-languageselector/leaflet-languageselector.css",
                "bower_components/leaflet-control-osm-geocoder/Control.OSMGeocoder.css",
                "bower_components/leaflet.locatecontrol/dist/L.Control.Locate.css",
                "bower_components/flag-icon-css/css/flag-icon.css",
                "bower_components/leaflet-control-position/leaflet-control-position.css",
                "bower_components/leaflet-control-home/leaflet-control-home.css",
                "bower_components/leaflet-categorized-layers/src/leaflet-categorized-layers.css",
                "bower_components/leaflet-control-datetime/leaflet-control-datetime.css",
                "bower_components/leaflet-control-legend/leaflet-control-legend.css",
                "bower_components/leaflet-control-forecast-print/leaflet-control-forecast-print.css",
                "leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-impact.css",
                "leaflet/Control.OSMGeocoder.ifm-maps.css",
                "css/ifm-maps.css"]

env.cssfiles_extra = ["bower_components/jquery-ui/themes/ui-lightness/jquery-ui.min.css"]

env.jsfiles = ["bower_components/jquery/dist/jquery.js",
               "bower_components/jquery-ui/jquery-ui.js",
               "bower_components/noty/js/noty/packaged/jquery.noty.packaged.js",
               "bower_components/jquery-placeholder/jquery.placeholder.js",
               "bower_components/magellan/magellan.js",
               "bower_components/moment/min/moment-with-locales.js",
               "bower_components/leaflet/dist/leaflet-src.js",
               "bower_components/leaflet-plugins/control/Permalink.js",
               "bower_components/leaflet-languageselector/leaflet-languageselector.js",
               "bower_components/Leaflet.MousePosition/src/L.Control.MousePosition.js",
               "bower_components/leaflet-control-osm-geocoder/Control.OSMGeocoder.js",
               "bower_components/Leaflet.dbpediaLayer/dist/leaflet.dbpedialayer.js",
               "bower_components/leaflet.locatecontrol/dist/L.Control.Locate.min.js",
               "bower_components/Leaflet.Terminator/L.Terminator.js",
               "bower_components/leaflet-control-position/leaflet-control-position.js",
               "bower_components/leaflet-control-home/leaflet-control-home.js",
               "bower_components/leaflet-categorized-layers/src/leaflet-categorized-layers.js",
               "bower_components/leaflet-control-datetime/leaflet-control-datetime.js",
               "bower_components/leaflet-tilelayer-counting/leaflet-tilelayer-counting.js",
               "bower_components/leaflet-control-legend/leaflet-control-legend.js",
               "bower_components/leaflet-control-forecast-print/leaflet-control-forecast-print.js",
               "bower_components/leaflet-tilelayer-wms-fcoo/leaflet-tilelayer-wms-model.js",
               "bower_components/leaflet-tilelayer-wms-fcoo/leaflet-tilelayer-wms-fcoo.js",
               "leaflet/Permalink.CategorizedLayer.js",
               "leaflet/Permalink.CategorizedOverlay.js",
               "leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-impact.js",
               "leaflet/leaflet-fcoo-layers/impact/denmark.js",
               "leaflet/leaflet-fcoo-layers/impact/greenland.js",
               "leaflet/leaflet-fcoo-layers/Permalink.ImpactLayer.js",
               "javascript/lang.js",
               "javascript/url.js",
               "javascript/map_common.js",
               "javascript/map_%(setup)s.js"]

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
    local('awk \'FNR==1{print ""}1\' %s > %s' % (cssfiles, cssfile))
    if minify:
        local('yui-compressor -o %s.new %s' % (cssfile, cssfile))
        local('mv %s.new %s' % (cssfile, cssfile))
    # Include files excluded from compression
    cssfiles = env.cssfiles_extra + [cssfile]
    cssfiles = ' '.join(cssfiles)
    local('awk \'FNR==1{print ""}1\' %s > tmp.css && mv tmp.css %s' % (cssfiles, cssfile))

@_booleanize
def build_js(minify=True):
    local('mkdir -p dist')
    jsfiles = env.jsfiles
    jsfiles_min = env.jsfiles_extra
    for setup in env.setups:
        print('Processing %s' % setup)
        destdir = 'dist/%s' % setup
        local('mkdir -p %s' % destdir)
        jsfiles_setup = [f % {'setup': setup} for f in jsfiles]
        jsfilestr = ' '.join(jsfiles_setup)
        jsfile = '%s/ifm-maps_%s.js' % (destdir, env.now)
        local('awk \'FNR==1{print ""}1\' %s > %s' % (jsfilestr, jsfile))
        if minify:
            local('/usr/bin/node /usr/bin/uglifyjs -o %s %s' % (jsfile, jsfile))
        # Include previously compressed files
        jsfiles_all = jsfiles_min + [jsfile]
        jsfilestr = ' '.join(jsfiles_all)
        local('awk \'FNR==1{print ""}1\' %s > tmp.js && mv tmp.js %s' % (jsfilestr, jsfile))

@_booleanize
def build_web():
    local('mkdir -p dist')
    local('cp index.html dist/.')
    local('cp -r php dist/.')
    local('cp -r json dist/.')
    local('cp -r javascript dist/.')
    local('cp -r leaflet dist/.')
    local('cp -r bower_components dist/.')
    local('cp -r css/ifm-maps.css dist/css/.')
    local('cp -r leaflet/images dist/css/.')
    local('cp -r bower_components/leaflet-control-home/images/* dist/css/images/.')
    local('cp -r bower_components/leaflet-control-position/images/* dist/css/images/.')
    local('cp -r bower_components/leaflet-control-osm-geocoder/images/* dist/css/images/.')
    local('cp -r bower_components/jquery-ui/themes/ui-lightness/images/* dist/css/images/.')
    local('cp -r bower_components/leaflet-control-forecast-print/images/printer.png dist/css/images/.')
    local('cp -r bower_components/flag-icon-css/flags dist/.')
    local('cp -r bower_components/fontawesome/fonts dist/.')

    for setup in env.setups:
        print('Processing %s' % setup)
        destdir = 'dist/%s' % setup
        local('mkdir -p %s' % destdir)
        local('cp %s/index.php %s/index-dev.php' % (setup, destdir))
        local('cp %s/index-prod.php %s/index.php' % (setup, destdir))
        local('sed -i s/ifm-maps.css/ifm-maps_%s.css/ dist/php/common-prod.php' % env.now)
        local('sed -i s/ifm-maps.js/ifm-maps_%s.js/ dist/php/common-prod.php' % env.now)


@_booleanize
def build(minify=True):
    """Minify, concatenate and build distributable files for IFM Maps."""
    jshint()
    local('rm -rf dist')
    build_css(minify=minify)
    build_js(minify=minify)
    build_web()
