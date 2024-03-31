#!/bin/bash

# Function to reset color
reset_color() {
    echo -e "\e[30m"
}

# Trap the EXIT signal to always execute reset_color function
trap reset_color EXIT

# Install yarn packages
yarn install
if [ $? -ne 0 ]; then
    echo -e "\e[31mYARN INSTALL COMMAND FAILED"
    exit 1
fi
echo -e "\e[32mYARN INSTALL COMMAND EXECUTED SUCCESSFULLY"

# Remove android and ios directories
rm -rf android
rm -rf ios
if [ $? -ne 0 ]; then
    echo -e "\e[31mREMOVING ANDROID AND IOS FILES FAILED"
    exit 1
fi

echo -e "\e[32mANDROID AND IOS FILES WERE REMOVED SUCCESSFULLY"

# Sleep for 2 seconds
sleep 1

# Eject react-native
react-native eject
if [ $? -ne 0 ]; then
    echo -e "\e[31mREACT NATIVE EJECT COMMAND FAILED"
    exit 1
fi

echo -e "\e[32mREACT NATIVE EJECT COMMAND EXECUTED SUCCESSFULLY"

# Sleep for 2 seconds
sleep 1

# Run the Python script
python3 replace.py
if [ $? -ne 0 ]; then
    echo -e "\e[31mONE-OFF FIX FILES FAILED TO APPLY"
    exit 1
fi

echo -e "\e[32mONE-OFF FIX FILES WERE APPLIED SUCCESSFULLY"

# Change directory to android
cd android
if [ $? -ne 0 ]; then
    echo -e "\e[31mFAILED TO CHANGE DIRECTORY"
    exit 1
fi

# Create necessary directories
mkdir -p android/app/src/main/assets
if [ $? -ne 0 ]; then
    echo -e "\e[31mmkdir -p failed"
    exit 1
fi
# Clean gradle
./gradlew clean
if [ $? -ne 0 ]; then
    echo -e "\e[31mGRADLE CLEAN COMMAND FAILED"
    exit 1
fi

echo -e "\e[32mGRADLE CLEAN COMMAND EXECUTED SUCCESSFULLY"

# Build gradle
./gradlew build
if [ $? -ne 0 ]; then
    echo -e "\e[31mGRADLE BUILD COMMAND FAILED"
    exit 1
fi
echo -e "\e[32mGRADLE BUILD COMMAND EXECUTED SUCCESSFULLY"
echo -e "\e[32mBUILD COMPLETED SUCCESSFULLY"