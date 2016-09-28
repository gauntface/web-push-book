#!/bin/bash
set -e

CONTENT_PATH=$PWD/content
BUILD_PATH=$PWD/downloads
IMAGES_PATH="$PWD/images"
PNG_PATH="$IMAGES_PATH/png-version"
INLINED_MD="$PWD/_inlined"

rm -rf "${BUILD_PATH}"

mkdir -p "${BUILD_PATH}"
mkdir -p "${PNG_PATH}"
mkdir -p "${INLINED_MD}"

for file in $IMAGES_PATH/*.svg
do
    filename=$(basename $file)
    # Setting dpi/ppi to 600 as safety for ipad max dpi of 324: http://dpi.lv/
    inkscape "$file" -d 600 -e "${PNG_PATH}/${filename%.svg}.png"
done

npm run code-inlining

# Build PDF File
pandoc $INLINED_MD/**/*.md -o $BUILD_PATH/push-book.pdf
# Build ePub File
pandoc $INLINED_MD/**/*.md -o $BUILD_PATH/push-book.epub --epub-metadata $CONTENT_PATH/epub-metadata.yaml --epub-cover-image $IMAGES_PATH/cover-photo.png
# Build Kindle Format
$PWD/third_party/kindlegen/kindlegen $BUILD_PATH/push-book.epub -o push-book.mobi

# Run Jekyll to build
jekyll build

rm -rf $INLINED_MD
