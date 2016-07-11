#!/bin/bash
set -e

pandoc *.md -o push-book.pdf
pandoc *.md -o push-book.epub
