#!/bin/bash

# REQUIREMENTS
# brew install imagemagick

# it creates an ORM map from 3 textures (Ambient Occlusion, Metallic and Roughness)
# Usage:
# 1. put your 3 textures in the same directory (for example "public/glxp/textures/omega/")
# 2. name them like this: xxx_AO.png, xxx_R.png, xxx_M.png
# 3. run the CLI command: npm run texture-orms public/glxp/textures/omega/

# Check if directory is passed as argument
if [ -z "$1" ]; then
    echo "Usage: $0 <directory>"
    exit 1
fi

# Get the directory passed as an argument
directory="$1"

# Iterate over files in the directory
for file in "$directory"/*_AO.png; do
    # Get the base name of the file
    base_name="${file%_AO.png}"
    
    # Check if the other files exist
    if [ -f "${base_name}_R.png" ] && [ -f "${base_name}_M.png" ]; then
        # Execute the magick convert command
        magick convert "${base_name}_AO.png" "${base_name}_R.png" "${base_name}_M.png" -channel RGB -combine "${base_name}_ORM.png"
        echo "ORM maps generated for $base_name"
    else
        echo "Some files are missing for $base_name"
    fi
done
