#!/bin/bash

# Activate the Python virtual environment
source ~/esp/bin/activate

yarn install

rm -rf android
rm -rf ios
react-native eject
cd one-off-fixes
# Run the Python script
python3 replace.py
cd ..

# Install yarn packages
cd android

./gradlew clean
./gradlew build

# Create necessary directories
mkdir -p android/app/src/main/assets

# Bundle the React Native project
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

echo "Build completed successfully."

# Run the Android application
react-native run-android
