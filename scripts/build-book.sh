#!/bin/bash
set -e

rm -rf $PWD/build

mkdir -p $PWD/build

mkdir -p $PWD/build/images

for file in $PWD/content/images/*.svg
do
    filename=$(basename $file)
    # Setting dpi/ppi to 600 as safety for ipad max dpi of 324: http://dpi.lv/
    inkscape "$file" -d 600 -e $PWD/build/images/"${filename%.svg}.png"
done

npm run code-inlining

# Build PDF File
pandoc $PWD/inlined/**/*.md -o $PWD/build/push-book.pdf
# Build ePub File
pandoc $PWD/inlined/**/*.md -o $PWD/build/push-book.epub --epub-metadata $PWD/content/epub-metadata.yaml --epub-cover-image $PWD/content/images/cover-photo.png
# Build Kindle Format
$PWD/third_party/kindlegen/kindlegen $PWD/build/push-book.epub -o push-book.mobi




# Copy site/ into a temp directory
mkdir -p $PWD/temp/
rm -rf $PWD/temp/
cp -r site/ $PWD/temp/

# Copy content/ into site/content/
cp -r content $PWD/temp/

# Run Jekyll to build
cd $PWD/temp/
jekyll build
cd ..

# Copy Jekyll build in build/site/
cp -r $PWD/temp/_site/. $PWD/build/site/

rm -rf $PWD/temp/
