/**
 * Release signing for Think Twice.
 * Reads keystore settings from Gradle properties or environment variables (never committed):
 *   TT_UPLOAD_STORE_FILE, TT_UPLOAD_STORE_PASSWORD, TT_UPLOAD_KEY_ALIAS, TT_UPLOAD_KEY_PASSWORD
 * If they are absent, the release build falls back to the debug keystore so it remains installable,
 * and Gradle prints a warning.
 */
const { withAppBuildGradle } = require('expo/config-plugins');

const BLOCK = `
def ttProp = { String key -> project.findProperty(key) ?: System.getenv(key) }
def ttStoreFile = ttProp('TT_UPLOAD_STORE_FILE')
`;

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (cfg) => {
    let src = cfg.modResults.contents;
    if (src.includes('TT_UPLOAD_STORE_FILE')) return cfg;
    src = src.replace(/android\s*\{/, `${BLOCK}\nandroid {`);
    src = src.replace(/signingConfigs\s*\{\s*debug\s*\{([\s\S]*?)\}\s*\}/, (m, debugBody) => `signingConfigs {
        debug {${debugBody}}
        release {
            if (ttStoreFile) {
                storeFile file(ttStoreFile)
                storePassword ttProp('TT_UPLOAD_STORE_PASSWORD')
                keyAlias ttProp('TT_UPLOAD_KEY_ALIAS')
                keyPassword ttProp('TT_UPLOAD_KEY_PASSWORD')
            }
        }
    }`);
    // Only the buildTypes.release block (identified by React Native's signing comment) is changed.
    src = src.replace(/(signed-apk-android\.\s*\n\s*)signingConfig signingConfigs\.debug/, (m, pre) => `${pre}if (!ttStoreFile) { logger.warn("Think Twice: TT_UPLOAD_STORE_FILE not set — signing release APK with the DEBUG keystore") }
            signingConfig ttStoreFile ? signingConfigs.release : signingConfigs.debug`);
    cfg.modResults.contents = src;
    return cfg;
  });
};
