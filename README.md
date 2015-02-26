# IFM Maps
Provides a web map interface to FCOO METOC forecasts. IFM Maps is 
distributed under the GPL v.3 License, see COPYING for the full license. 
Installation instructions can be found in the INSTALL file.

## Installation
Simply deploy the dist directory somewhere on your PHP enabled
web server.

## Development

### Dependencies
Before beginning to develop IFM Maps you need to install Bower:

http://bower.io/

Bower will need a recent version of node.js.

To download the web dependencies for IFM Maps you should simply
run:

  bower install


### Building and deploying
We are using Fabric for building a deployment version of IFM Maps
and for the deployment itself:

http://www.fabfile.org/

In the build process we use the following tools which you will also
need to download if you want to build an optimised version of
IFM Maps:

http://yui.github.io/yuicompressor/

https://www.npmjs.com/package/uglify-js

You might have to change a few paths to executables in fabfile.py 
when you run it.

To build IFM Maps you simply type:

  fab build

You can then copy the dist directory to whereever you want to deploy
it. We have automated this process so that we can type:

  fab -R staging deploy

or:

  fab -R production deploy

For our deployment. You are of course welcome to use the fabfile.py
for inspiration for automating your deployment but you will need
to dig into the details of the deploy method of the script.
