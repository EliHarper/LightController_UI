// brightnessPlugin.js

const brightnessPlugin = {
    // eslint-disable-next-line no-unused-vars
    install(Vue, options) {
        Vue.prototype.$brightnessToStore = function (pct) {
            return (pct / 100) * 255;
        },
        Vue.prototype.$brightnessToDisplay = function (byteVal) {
            return (byteVal / 255) * 100;
        }
    }
};

export default brightnessPlugin;