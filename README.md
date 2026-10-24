# Think Twice — ثانية تفكير

**فكر .. اختر .. اتخذ قرار أفضل** — an Arabic (RTL), offline Android app for ages 13–18 with two sections:

- **كلمة بداية (social situations):** pick a situation (conflict, asking for help, school problem, other) and a trusted person. The app suggests an opening message, which you can edit and share. You then choose a response and get an explanation plus other options. Messages adapt to the user's gender (ولد / بنت).
- **ثانية تفكير (digital situations):** 6 topics × 2 scenarios. Messages: provoking message, strange request, group pressure. News: unreliable news, harmful content, suspicious ads/prizes. Each scenario follows think → choose → evaluation → tip → new challenge.
- **Other screens:** progress (distinct challenges, ring, flames, no pressure streaks), settings (name, gender, optional daily reminder, sound, vibration, reset), help (including Egypt's Child Helpline 16000), about.

There are no accounts, ads or analytics. All data stays on the device.

Stack: Expo SDK 54 · React Native 0.81 · TypeScript · Expo Router · Cairo font · forced RTL. Package: `com.thinktwice.app`.

## Build the APK (Windows, from this folder)
```bat
npm ci
npx eas-cli login
npx eas-cli init
set EAS_NO_VCS=1
npx eas-cli build -p android --profile preview
```
- The `preview` profile produces an installable **APK**.
- For Google Play, use `--profile production`, which produces an **AAB**.

## Develop and test
```bash
npm run check      # TypeScript + ESLint + Jest (9 tests)
npm run test:e2e   # web export + Playwright walkthrough of all 13 screens (16 checks)
npm run assets     # regenerate the artwork from scripts/generate-assets.js
```
