#!/bin/bash
set -e

rm -rf $PWD/build

mkdir -p $PWD/build

mkdir -p $PWD/build/images

for file in $PWD/images/*.svg
do
    filename=$(basename $file)
    inkscape "$file" -d 1200 -e $PWD/build/images/"${filename%.svg}.png"
done

pandoc $PWD/**/*.md -o $PWD/build/push-book.pdf
pandoc $PWD/**/*.md -o $PWD/build/push-book.epub

$PWD/third_party/kindlegen/kindlegen $PWD/build/push-book.epub -o push-book.mobi
