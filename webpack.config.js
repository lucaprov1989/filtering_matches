const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const glob = require('glob');
const webpackBundleAnalyzer = require('webpack-bundle-analyzer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const globImporter = require('node-sass-glob-importer');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


const configEnvDev = { NODE_ENV: '"development"' };
const configEnvProd = { NODE_ENV: '"production"' };

const extractCSSVendor = new ExtractTextPlugin('vendor.[chunkhash].css', { allChunks: true });
const extractCSS = new ExtractTextPlugin('app.[chunkhash].css', { allChunks: true });


module.exports = (env = { mode: 'development' }) => {
    const webpackConfig = {
        mode: env.mode,
        watch: env.mode === 'development',

        // Reduce the log spam of webpack
        stats: 'minimal',

        performance: {
            hints: env.mode === 'production' ? 'warning' : false,
        },

        // Root dir with ~ alias
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },

        entry: {
            app: glob.sync('./src/**/*.js'),
        },

        // Ouput bundle configuration
        output: {
            path: path.resolve(__dirname, './public/dist'),
            filename: '[name].[chunkhash].js',
            publicPath: '/',
        },

        // Split the bundles
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    parallel: true,
                    uglifyOptions: {
                        output: {
                            comments: false,
                        },
                    },
                }),
            ],

            splitChunks: {
                minSize: 500000,
                maxSize: 1500000,
                minChunks: 1,
                chunks: 'all',
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        reuseExistingChunk: true,
                    },

                    default: {
                        priority: -20,
                        name: 'app',
                        reuseExistingChunk: true,
                    },
                },
            },
        },

        module: {
            rules: [
                // Parse javascript files with Babel
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    include: [path.resolve(__dirname, './src')],
                    query: {
                        presets: ['env'],
                    },
                },

                // Vendor CSS
                {
                    test: /\.css$/,
                    use: extractCSSVendor.extract({
                        fallback: 'style-loader',
                        use: [{
                            loader: 'css-loader',
                            options: { url: false },
                        }],
                    }),
                },

                // SCSS
                {
                    test: /\.scss$/,
                    exclude: path.resolve('./node_modules'),
                    use: extractCSS.extract({
                        use: [
                            {
                                loader: 'css-loader',
                                options: { url: false },
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    url: false,
                                    importer: globImporter(),
                                    //data: `@import "${process.env.SCSS_VARS}";`,
                                    outputStyle: 'nested',
                                },
                            },
                        ],
                        fallback: 'style-loader',
                    }),
                },
            ],
        },

        plugins: [
            new CleanWebpackPlugin(`${__dirname}/public/dist`, {
                verbose: false,
            }),

            // CSS extraction plugins
            extractCSSVendor,
            extractCSS,

            // Export a manifest.json file with the assets urls
            new ManifestPlugin(),

            // Add the environment config plugin, based on the mode
            new webpack.DefinePlugin({
                'process.env': env.mode === 'development' ? configEnvDev : configEnvProd,

                env: {
                    FRONTEND_URL: JSON.stringify(process.env.FRONTEND_URL),
                },
            }),

            // Provide jquery as global plugin
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
            }),
        ],
    };

    // Add the report analyzer, when the parameter --report is passed
    if (process.env.npm_config_report) {
        const { BundleAnalyzerPlugin } = webpackBundleAnalyzer;
        webpackConfig.plugins.push(new BundleAnalyzerPlugin());
    }

    // Add the live reload plugin when developing
    if (env.mode === 'development') {
        webpackConfig.plugins.push(new LiveReloadPlugin({
            appendScriptTag: true,
        }));
    }

    webpackConfig.plugins.push(new LiveReloadPlugin({
        appendScriptTag: true,
    }));

    return webpackConfig;
};
