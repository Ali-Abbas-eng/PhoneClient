#!/bin/bash

set -e

# Function to print message with color based on exit status
print_message() {
    if [ $? -eq 0 ]; then
        echo -e "\e[32m$1"
    elif [ $? -ne 0 ]; then
        echo -e "\e[31m$2"
    else
        echo -e "\e[30m$3"
    fi
}

# Function to reset color
reset_color() {
    sleep 2
    echo -e "\e[30m"
}

# Trap the EXIT signal to always execute reset_color function
trap reset_color EXIT

# Install yarn packages
yarn install
print_message "YARN INSTALL COMMAND EXECUTED SUCCESSFULLY" "YARN INSTALL COMMAND FAILED" "YARN INSTALL COMMAND EXECUTED WITH UNKNOWN STATUS"

# Remove android and ios directories
rm -rf android
rm -rf ios
print_message "ANDROID AND IOS FILES WERE REMOVED SUCCESSFULLY" "REMOVING ANDROID AND IOS FILES FAILED" "REMOVING ANDROID AND IOS FILES EXECUTED WITH UNKNOWN STATUS"

# Sleep for 2 seconds
sleep 1

# Eject react-native
react-native eject
print_message "REACT NATIVE EJECT COMMAND EXECUTED SUCCESSFULLY" "REACT NATIVE EJECT COMMAND FAILED" "REACT NATIVE EJECT COMMAND EXECUTED WITH UNKNOWN STATUS"

# Sleep for 2 seconds
sleep 1

# Run the Shell script
./replace.sh
print_message "ONE-OFF FIX FILES WERE APPLIED SUCCESSFULLY" "ONE-OFF FIX FILES FAILED TO APPLY" "ONE-OFF FIX FILES APPLIED WITH UNKNOWN STATUS"

# Change directory to android
cd android
print_message "CHANGED DIRECTORY TO ANDROID SUCCESSFULLY" "FAILED TO CHANGE DIRECTORY" "CHANGED DIRECTORY WITH UNKNOWN STATUS"

# Create necessary directories
mkdir -p android/app/src/main/assets
print_message "CREATED NECESSARY DIRECTORIES SUCCESSFULLY" "FAILED TO CREATE NECESSARY DIRECTORIES" "CREATED NECESSARY DIRECTORIES WITH UNKNOWN STATUS"

# Clean gradle
./gradlew clean
print_message "GRADLE CLEAN COMMAND EXECUTED SUCCESSFULLY" "GRADLE CLEAN COMMAND FAILED" "GRADLE CLEAN COMMAND EXECUTED WITH UNKNOWN STATUS"

# Build gradle
./gradlew build
print_message "GRADLE BUILD COMMAND EXECUTED SUCCESSFULLY" "GRADLE BUILD COMMAND FAILED" "GRADLE BUILD COMMAND EXECUTED WITH UNKNOWN STATUS"

echo -e "\e[32mBUILD COMPLETED SUCCESSFULLY"
