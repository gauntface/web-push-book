#!/bin/bash
set -e

CONTENT_PATH="$PWD/src/_content"
IMAGES_PATH="$PWD/src/images"

BUILD_PATH="$PWD/build"
DOWNLOADS_PATH="$BUILD_PATH/downloads"
EBOOK_TRANSFORM_MD="$BUILD_PATH/_ebook"
JEKYLL_TRANSFORM_MD="$BUILD_PATH/_content"
GENERATED_PNGS="$IMAGES_PATH/png-version"


# Create PNG versions of SVGs
mkdir -p "${GENERATED_PNGS}"
for file in $IMAGES_PATH/*.svg
do
    filename=$(basename $file)
    # Setting dpi/ppi to 600 as safety for ipad max dpi of 324: http://dpi.lv/
    inkscape "$file" -d 600 -e "${GENERATED_PNGS}/${filename%.svg}.png"
done



# Optimise the generated files
gulp build:prod
# Run Jekyll to build
bundle exec jekyll build



# Create downloads path
mkdir -p "${DOWNLOADS_PATH}"
# Build PDF File
pandoc $EBOOK_TRANSFORM_MD/**/*.md -o $DOWNLOADS_PATH/push-book.pdf
# Build ePub File
pandoc $EBOOK_TRANSFORM_MD/**/*.md -o $DOWNLOADS_PATH/push-book.epub --epub-metadata $CONTENT_PATH/_epub-metadata.yaml --epub-cover-image $IMAGES_PATH/cover-photo.png
# Build Kindle Format
$PWD/third_party/kindlegen/kindlegen $DOWNLOADS_PATH/push-book.epub -o push-book.mobi
