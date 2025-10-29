#!/bin/bash

# REQUIREMENTS
# brew install imagemagick
# chmod +x ./tasks/tools/basis_universal/bin_osx/basisu

# OPTIONS
# --wsl : Use unix basisu bin
# --flip_y : Flip ktx2 file
# --no_override : Avoid replacing texture if it already exists (useful to convert new textures without updating all textures)

BASE_DIR_PATH=$1 # Base directory path
SIZES=("256" "512" "1024" "2048") # file are compressed to these sizes
PROCESSED_FILES_EXT=("jpg" "jpeg" "png") # We are processing these files ext
OVERRIDE=true
FLIP_Y=false
basisuScript=./tasks/tools/basis_universal/bin_osx/basisu

for arg in "$@"; do
    if [ $arg == "--wsl" ]; then
        basisuScript=./tasks/tools/basis_universal/bin_wsl/basisu
    elif [ $arg == "--flip_y" ]; then
        FLIP_Y=true
    elif [ $arg == "--no_override" ]; then
        OVERRIDE=false
    fi
done

echo -e "FLIP_Y: ${FLIP_Y} \n"
echo -e "OVERRIDE: ${OVERRIDE} \n"

# create directories
for size in "${SIZES[@]}"; do
    if [ ! -d "$BASE_DIR_PATH$size" ]; then
        mkdir "$BASE_DIR_PATH$size"
    fi
done

for ext in "${PROCESSED_FILES_EXT[@]}"; do
    # resize & convert to following extensions
    convert_to=("jpg" "webp" "avif")
    if [ $ext == "png" ]; then
        convert_to=("png" "jpg" "webp" "avif")
    fi
    # for each files (jpg or png, extensions in PROCESSED_FILES_EXT) 
    # we resize it + convert it to ktx2
    for f in $BASE_DIR_PATH*.$ext; do
        if [ -f $f ]; then
            for size in "${SIZES[@]}"; do
                echo -e "\n##### processing $f ($size x $size)"

                # rename "jpeg" to "jpg" in outputs
                jpgExtension="jpg"
                outputFilePath=${f/jpeg/$jpgExtension}

                # resizing file to each wanted extension
                for e in "${convert_to[@]}"; do
                    if [ "$OVERRIDE" = false ] && [ -f "$BASE_DIR_PATH$size/$(basename ${outputFilePath}).$e" ]; then
                        echo "$BASE_DIR_PATH$size/$(basename ${outputFilePath}).$e exists, skipping it."
                    else
                        convert "${f}" -resize $sizex$size "$BASE_DIR_PATH$size/$(basename ${outputFilePath}).$e"
                    fi
                done

                # get filename and extension name
                filename=$(basename -- ${outputFilePath})
                extension="${filename##*.}"
                filename="${filename%.*}"

                if [ "$OVERRIDE" = false ] && [ -f "$BASE_DIR_PATH$size/${filename}.${extension}.ktx2" ]; then
                    echo "$BASE_DIR_PATH$size/${filename}.${extension}.ktx2 exists, skipping it."
                else
                    ktx2_args=()
                    # for each sizes created, convert to ktx2
                    if [ $size == "2048" ] && [ $ext == "png" ]; then
                        ktx2_args+=(-comp_level 1)
                    fi

                    if [ "$FLIP_Y" = true ]; then
                        ktx2_args+=(-y_flip)
                    fi
                    
                    echo -e "--> converting resized to ktx2 with args: ${ktx2_args[@]} \n"
                    $basisuScript -ktx2 $BASE_DIR_PATH$size/${filename}.${extension}.${extension} -output_path "$BASE_DIR_PATH$size/" "${ktx2_args[@]}"

                    # rename ktx2 file to keep the source extension inside its name (xxx.png.ktx2 instead of only xxx.ktx2)
                    # mv "$BASE_DIR_PATH$size/${filename}.ktx2" "$BASE_DIR_PATH$size/${filename}.${extension}.ktx2" 
                fi
            done
        fi
    done
done

exit