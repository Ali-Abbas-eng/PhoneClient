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

# Define source and destination directories
one_off_fixes_source="one-offs/fixes"
one_off_fixes_destination=""

# Use find to iterate over files in the source directory
find "$one_off_fixes_source" -type f | while read -r fix_file; do
    # Replace the source directory prefix to get the destination file path
    destination_file="${fix_file#$one_off_fixes_source/}"
    # Copy the file to the destination
    cp "$fix_file" "$destination_file"
    print_message "COPIED $fix_file TO $destination_file SUCCESSFULLY" "FAILED TO COPY $fix_file TO $destination_file" "COPIED $fix_file TO $destination_file WITH UNKNOWN STATUS"
done
