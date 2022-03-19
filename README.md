# Thrift Finance Wallet

### Table of Contents
#### TODO

- [x] Configuring React+Typescript.
- [x] Adding common libraries, including cardano-serializacion-lib.
- [x] Add Redux for state management.
- [x] Add Realm and models for data persistence.
- [x] Add i18n for easy translations.
- [ ] Add the front side.
- [x] Testing Running on Android & iOS envs.
- [x] Compilation and getting executables for Android.
- [ ] Compilation and getting executables for iOS.

### Getting Started
Install using yarn:
```
nvm use 16.5.0 
yarn install
react-native link @emurgo/react-native-haskell-shelley
```

Start the Metro Bundler:
```
yarn start
```

Build and start the app:
```
yarn ios
yarn android
```
###### Requirements

####### Android
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup install 1.41.0
rustup toolchain install 1.41.0
rustup target add wasm32-unknown-unknown --toolchain 1.41.0
rustup default 1.41.0
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
rustup target add x86_64-apple-ios

source $HOME/.cargo/env

cargo install cargo-lipo
```

- Install `wasm-prkg`:

```shell
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
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
/Applications/Android\ Studio.app/Contents/MacOS/studio&
Android Studio > Tools > AVD Manager > Run any device
```

Run a device from Android Studio, then:
```
export JAVA_HOME=`/usr/libexec/java_home -v 1.8`  
yarn android
# runs the following command
# react-native run-android --variant=Debug
```

