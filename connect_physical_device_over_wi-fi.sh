#!/bin/bash

# Check connected devices
devices=$(adb devices | grep -v List | grep device | cut -f 1)

while [ -z "$devices" ]
do
    echo "No devices detected. Please connect a device using a USB cable."
    sleep 3
    devices=$(adb devices | grep -v List | grep device | cut -f 1)
done

for device in $devices
do
    echo "Setting up device $device for wireless debugging..."

    # Run command 'adb tcpip 5555'
    adb -s $device tcpip 5555

    # Wait for the device to restart on TCP/IP
    sleep 5

    # Get the IP address of the connected device
    device_ip=$(adb -s $device shell ip route | awk '{print $9}')

    echo "Device IP: $device_ip"

    # Run the command 'adb connect <DEVICE_IP_ADDRESS>:5555'
    adb connect $device_ip:5555
done
