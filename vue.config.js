module.exports = {
    chainWebpack: config => {
        config.externals({
            puppeteer: 'require("puppeteer")',
        });
    },
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                // options placed here will be merged with default configuration and passed to electron-builder
            }
        }
    },
    transpileDependencies: [
        "vuetify",
        "puppeteer"
    ],
}
