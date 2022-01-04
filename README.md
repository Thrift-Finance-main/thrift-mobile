# Thrift Finance Wallet

### Table of Contents
#### TODO

- [x] Configuring React+Typescript.
- [x] Adding common libraries, including cardano-serializacion-lib.
- [x] Add Redux for state management.
- [x] Add Realm and models for data persistence.
- [x] Add i18n for easy translations.
- [ ] Add the styles Framework, template.
- [x] Testing Running on Android & iOS envs.
- [ ] Compilation and getting executables for both platforms.

### Project Structure

```
/
├── android					Android Native code
├── ios						iOS Native Code
├── shared
│   ├── redux					Applications Logic
│   │   ├── constants
│   │   ├── actions
│   │   ├── api
│   │   ├── reducers
│   │   ├── store
│   │   └── thunk
│   └── utilities
├── src
│   ├── config					Global Configuration
│   ├── constants				Screens, Localization
│   ├── navigators				Router, Navigation
│   ├── view					UI compoments
│   │   ├── elements			  Custom elements
│   │   ├── assets
│   │   ├── screens
│   │   ├── styles				  Typography
│   │   └── widgets				  Custom components
│   └── utilities
├── __tests__					Unit Tests
│   ├── presentation
│   └── redux
├── .babelrc
├── .gitignore
├── .travis.yml					Travis CI
├── tsconfig.json				TypeScript Configuration
├── tslint.js					TSLint configuration - extending AirBnb
├── tsconfig.json
├── app.json
├── index.js					Application Entry point
├── package.json
└── README.md
```

`shared`
Everything related to application business logic. The redux store.

`src`
Presentation layer for the app - screens, styles, images, icons etc.

### Getting Started

###### Requirements

####### Android
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup install 1.41.0
rustup toolchain install 1.41.0
rustup target add wasm32-unknown-unknown --toolchain 1.41.0
rustup default 1.41.0
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android

export JAVA_HOME=`/usr/libexec/java_home -v 1.8`  

source $HOME/.cargo/env

cargo install cargo-lipo
```

- Install `wasm-prkg`:

```shell
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

Make sure node version installed is `>=10.x.x` and Java `JDK 12`. 
Then install using yarn (or npm):
```
nvm use 16.5.0 
yarn install
```

Start the Metro Bundler:
```
yarn start
```

###### iOS

One time. Move to `ios` folder and install pods:

```
cd ios && pod install
```

Launch application from XCode (`Command + R`) Or launch from Terminal:

```
yarn ios
# runs the following command. change device name here
# `npx react-native run-ios --simulator='iPhone 11'`
```

###### Android

Start an Android Simulator from:
```
Android Studio > Tools > AVD Manager > Run any device
```

Similarly, run from Android Studio itself Or from Terminal:
```
yarn android
# runs the following command
# react-native run-android --variant=Debug
```

