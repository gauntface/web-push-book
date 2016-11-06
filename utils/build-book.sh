#!/bin/bash
set -e

CONTENT_PATH="$PWD/src/_content"
RAW_IMAGES_PATH="$PWD/src/images"
PNG_IMAGES_PATH="$PWD/src/images/png-version"

BUILD_PATH="$PWD/build"
DOWNLOADS_PATH="$BUILD_PATH/downloads"
EBOOK_TRANSFORM_MD="$BUILD_PATH/_ebook"
JEKYLL_TRANSFORM_MD="$BUILD_PATH/_content"

# Create PNG versions of SVGs
mkdir -p "${PNG_IMAGES_PATH}"
for file in $RAW_IMAGES_PATH/svgs/*.svg
do
    filename=$(basename $file)
    # Setting dpi/ppi to for ipad max dpi of 324: http://dpi.lv/
    # Kindle is 300
    # Max width for images should be 1024px
    inkscape "$file" -d 324 -e "${PNG_IMAGES_PATH}/${filename%.svg}.png"
done

# Optimise the generated files
gulp build:prod

# Create downloads path
mkdir -p "${DOWNLOADS_PATH}"
# Build PDF File
pandoc $EBOOK_TRANSFORM_MD/**/*.md -o $DOWNLOADS_PATH/web-push-book.pdf --latex-engine=xelatex
# Build ePub File
pandoc $EBOOK_TRANSFORM_MD/**/*.md -o $DOWNLOADS_PATH/web-push-book.epub --epub-metadata $CONTENT_PATH/_epub-metadata.yaml --epub-cover-image $BUILD_PATH/images/book/cover-photo.png --latex-engine=xelatex
# Build Kindle Format
$PWD/third_party/kindlegen/kindlegen $DOWNLOADS_PATH/web-push-book.epub -o web-push-book.mobi


# Run Jekyll to build site + downloads
bundle exec jekyll build
