var Path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.conf.js');
var bundleLocation = 'assets/js/bundle.js';

webpackConfig.context = __dirname;
webpackConfig.entry = {
    'bundle': './assets/js/app.js',
    'amp-product-options': './assets/js/amp-product-options.js',
};
webpackConfig.output = {
    path: Path.join(__dirname, '/assets/dist'),
    filename: '[name].js',
};

/**
 * Watch options for the core watcher
 * @type {{files: string[], ignored: string[]}}
 */
var watchOptions = {
    // If files in these directories change, reload the page.
    files: [
        '/templates',
        '/lang'
    ],

    //Do not watch files in these directories
    ignored: [
        '/assets/scss',
        '/assets/less',
        '/assets/css',
    ]
};

/**
 * Hook into the stencil-cli browsersync instance for rapid development of themes.
 * Watch any custom files and trigger a rebuild
 * @param {Object} Bs
 */
function development(Bs) {
    var compiler = webpack(webpackConfig);

    // Rebuild the bundle once at bootup
    compiler.watch({}, function(err, stats) {
        if (err) {
            console.error(err.message, err.details);
        }

        Bs.reload();
    });
}

/**

*/
/**
 * Hook into the `stencil bundle` command and build your files before they are packaged as a .zip
 * Be sure to call the `done()` callback when finished
 * @param {function} done
 */
function production(done) {
    var compiler;

    webpackConfig.devtool = false;
    webpackConfig.plugins.push(new webpack.optimize.DedupePlugin());
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        comments: false
    }));

    compiler = webpack(webpackConfig);

    compiler.run(function(err, stats) {
        if (err) {
            throw err;
        }

        done();
    });
}

module.exports = {
    watchOptions: watchOptions,
    development: development,
    production: production,
};
