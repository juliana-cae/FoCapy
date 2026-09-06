# FoCapy

FoCapy is a local-first Pomodoro focus app where completed sessions grow a monthly garden. It includes strict mode, real ambient audio choices, a persistent inventory, item activation controls, monthly garden archives, the `Compromisso` history, a dev mode for testing rewards, and Portuguese/English UI switching in Settings.

## Run locally

```bash
npm install
npm test
node scripts/prepare-web.mjs
```

The Android debug APK is built with Capacitor:

```bash
npx cap sync android
cd android
./gradlew assembleDebug
```

See [`docs/APP.md`](docs/APP.md) for the product documentation.

## License

MIT. See [`LICENSE`](LICENSE).
