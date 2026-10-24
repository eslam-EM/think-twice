/**
 * Forces RTL layout natively before React Native loads (first launch included).
 * Think Twice's interface is Arabic-first.
 */
const { withMainApplication } = require('expo/config-plugins');

module.exports = function withForcedRTL(config) {
  return withMainApplication(config, (cfg) => {
    let src = cfg.modResults.contents;
    if (!src.includes('I18nUtil')) {
      src = src.replace(/(package [^\n]+\n)/, '$1\nimport com.facebook.react.modules.i18nmanager.I18nUtil\n');
      src = src.replace(/super\.onCreate\(\)\n/, 'super.onCreate()\n    I18nUtil.instance.allowRTL(this, true)\n    I18nUtil.instance.forceRTL(this, true)\n');
    }
    cfg.modResults.contents = src;
    return cfg;
  });
};
