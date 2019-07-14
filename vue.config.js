const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
    publicPath: isProduction ? './' : '/',
    outputDir: 'dist',
    productionSourceMap: isProduction ? false : true,
    filenameHashing: !isProduction,
    pages: {
        index: {
            entry: 'examples/main.ts',
            template: 'public/index.html',
            filename: 'index.html'
        }
    },
    css: {
        loaderOptions: {

        },
        extract: false,

    },
    configureWebpack: (config) => {
        if (!isProduction) {
            return;
        }
        return {
            plugins: [


            ]
        };

    },
    chainWebpack: (config) => {
        // 压缩图片
        config.module.rule('images').use('image-webpack-loader').loader('image-webpack-loader').options({ bypassOnDebug: true }).end()

        // 移除 prefetch 插件
        config.plugins.delete('prefetch')
        // 移除 preload 插件
        config.plugins.delete('preload');
    },
    devServer: {
        port: 8080,
        https: false,
        open: false,
        proxy: {
            '/api': {
                target: "http://www.wuliu.com",
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/static': {
                target: "http://www.wuliu.com",
                ws: true,
                changeOrigin: true,
            }


        },
    }
}


