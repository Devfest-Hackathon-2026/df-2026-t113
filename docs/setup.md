# Local setup

## Backend

Use Node.js 24 and npm. Run `npm ci` at the repository root, then `npm run dev`.
The root npm workspace owns the lockfile. Express listens on `HOST` (default
0.0.0.0) and `PORT` (default 8080). Backend dependencies live in backend/package.json.

The backend is a public, read-only prototype. There is no account system or database.
The Android native client does not need browser CORS configuration.

## Android

1. Install Android Studio, JDK 17, SDK Platform 35, and its build tools.
2. Open android/ as the project. Use JDK 17 for Gradle (not the host's newer Java).
3. Copy local.properties.example to local.properties; Android Studio normally sets
   sdk.dir. Set EVACUATION_AR_API_BASE_URL to your backend URL with a trailing slash.
4. Start an emulator and the backend. The emulator reaches the host through
   http://10.0.2.2:8080/. A debug-only network security exception permits that host.
   Release configuration requires HTTPS.
5. Build/install through Android Studio, or use the committed Gradle wrapper.

The wrapper uses Gradle 8.11.1, Android Gradle Plugin 8.9.2, Kotlin 2.1.20, and SDK 35. It downloads the official Gradle distribution on first use. Dependencies and
SDK components also require internet during initial setup.

```sh
cd android
./gradlew :app:assembleDebug :app:testDebugUnitTest :app:lintDebug
```

## Next AR milestone

Start with Google's Android Geospatial sample:
https://developers.google.com/ar/develop/java/geospatial/quickstart

Enable the ARCore API in a Google Cloud project, configure restricted Android
credentials, add the required user notice and runtime permission flow, check device
support/VPS coverage, and integrate session lifecycle and rendering. The current
manifest declares AR optional and permissions, but does not request them at runtime
because camera/location features are not implemented yet. Do not mistake SDK
installation or the placeholder status class for an operational AR scene.
