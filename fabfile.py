"""
Use Fabric for building and deploying IFM Maps.

Build:
  fab build

Deployment:
  Staging server:
    fab -R staging deploy
  Production server:
    fab -R production deploy

"""
import datetime, tempfile, shutil, os
from distutils.util import strtobool

from fabric.api import env, local, run, cd, sudo, lcd
from fabric.contrib.files import sed, exists
from fabric.contrib.project import rsync_project

env.roledefs = {
    'local': ['localhost'],
    'staging': ['ptest@ftp01:23'],
    'production': ['prod@ftp01:23']
}

if not len(env.roles):
    env.roles = ["local"]

env.setups = ['greenland', 'faroe_islands', 'denmark', 
              'mediterranean', 'indian_ocean', 'global']

env.cssfiles = ["bower_components/fontawesome/css/font-awesome.min.css",
                "bower_components/leaflet/dist/leaflet.css",
                "bower_components/Leaflet.MousePosition/src/L.Control.MousePosition.css",
                "bower_components/leaflet-languageselector/leaflet-languageselector.css",
                "bower_components/leaflet-control-osm-geocoder/Control.OSMGeocoder.css",
                "bower_components/leaflet.locatecontrol/dist/L.Control.Locate.css",
                "bower_components/flag-icon-css/css/flag-icon.min.css",
                "bower_components/leaflet-control-position/leaflet-control-position.css",
                "bower_components/leaflet-control-home/leaflet-control-home.css",
                "bower_components/leaflet-categorized-layers/src/leaflet-categorized-layers.css",
                "leaflet/leaflet-fcoo-layers.css",
                "leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-impact.css",
                "leaflet/leaflet-control-datetime.css",
                "leaflet/L.Control.Print.css",
                "leaflet/Control.OSMGeocoder.ifm-maps.css",
                "css/ifm-maps.css"]

env.cssfiles_extra = ["bower_components/jquery-ui/themes/ui-lightness/jquery-ui.min.css"]

env.jsfiles = ["bower_components/jquery-placeholder/jquery.placeholder.js",
               "bower_components/magellan/magellan.js",
               "bower_components/moment/min/moment-with-locales.min.js",
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
               "leaflet/Permalink.CategorizedLayer.js",
               "leaflet/Permalink.CategorizedOverlay.js",
               "leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-common.js",
               "leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-impact.js",
               "leaflet/leaflet-fcoo-layers/Permalink.ImpactLayer.js",
               "leaflet/leaflet-control-datetime.js",
               "leaflet/L.Control.Print.js",
               "javascript/lang.js",
               "javascript/url.js",
               "javascript/map_common.js",
               "javascript/map_%(setup)s.js"]

env.jsfiles_extra = ["bower_components/jquery/dist/jquery.min.js",
                     "bower_components/jquery-ui/jquery-ui.min.js",
                     "bower_components/noty/js/noty/packaged/jquery.noty.packaged.js"]

env.now = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')

def _booleanize(func):
    """Converts minify argument to boolean."""
    def inner(*args, **kwargs):
        if 'minify' in kwargs and not isinstance(kwargs['minify'], (bool, )):
            kwargs['minify'] = bool(strtobool(kwargs['minify']))
        return func(*args, **kwargs)
    return inner

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
    setups = {}
    for setup in env.setups:
        rfile = setup + '/index.php'
        setups[setup] = _extract_jsfiles(rfile)
    jsmodels = 'leaflet/leaflet-fcoo-layers/%(model)s'
    jsfiles = env.jsfiles
    jsfiles_min = env.jsfiles_extra
    for setup in setups:
        print('Processing %s' % setup)
        destdir = 'dist/%s' % setup
        local('mkdir -p %s' % destdir)
        jsfiles_setup = [f % {'setup': setup} for f in jsfiles]
        jsmodels_setup = [jsmodels % {'model': model} for model in setups[setup]]
        jsfiles_setup += jsmodels_setup
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
    local('cp -r bower_components/flag-icon-css/flags dist/.')
    local('cp -r bower_components/fontawesome/fonts dist/.')

    setups = {}
    for setup in env.setups:
        rfile = setup + '/index.php'
        setups[setup] = _extract_jsfiles(rfile)
    for setup in setups:
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
    local('rm -rf dist')
    build_css(minify=minify)
    build_js(minify=minify)
    build_web()

@_booleanize
def deploy():
    """Deploy IFM Maps."""
    # Make deployment and configuration directory
    proj_dir = '/home/%s/DcooWare/ifm-maps-%s' % (env.user, env.now)
    rsync_project(local_dir='dist/*', remote_dir=proj_dir)
    with cd(proj_dir):
        if 'staging' in env.roles:
            webmap_url = '{s}.fcoo.dk/webmap-staging/{dataset}.wms'
        elif 'production' in env.roles:
            webmap_url = '{s}.fcoo.dk/webmap/{dataset}.wms'
        sed('leaflet/leaflet-fcoo-layers/leaflet-fcoo-layers-common.js',
            'wms-dev01:8080/\{dataset\}.wms',
            webmap_url)

    # Change production symlink to point to new directory
    sym_dir = '/home/%s/ifm-maps' % env.user
    if exists(sym_dir):
        run('rm %s' % sym_dir)
    run('ln -s %s %s' % (proj_dir, sym_dir))

def _extract_jsfiles(rfile):
    """Returns a list of javascript files used in a php index file."""
    output = local("grep '\$model_ids = array' %s" % rfile, capture=True)
    print output
    lines = output.split('\n')
    for line in lines:
        if line.startswith('$model_ids = array'):
            array = line.split('=')[1].strip()
            imps = array.lstrip('array(').rstrip(');')
            js_includes = [imp.strip().strip('"') for imp in imps.split(',')]
            return js_includes
    raise RuntimeError("Could not find php array containing model id's")

