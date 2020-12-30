# [web-push-book.gauntface.com](https://web-push-book.gauntface.com/)

[![Build and Test](https://github.com/gauntface/web-push-book/workflows/Build%20and%20Test/badge.svg)](https://github.com/gauntface/web-push-book/actions?query=workflow%3A%22Build+and+Test%22)

[![Publish](https://github.com/gauntface/web-push-book/workflows/Publish/badge.svg)](https://github.com/gauntface/web-push-book/actions?query=workflow%3APublish)

## Building the Site

This site is built and deployed weekly via GitHub actions, so for an up-to-date set of
steps look at [.github/workflows/publish.yml](https://github.com/gauntface/web-push-book/blob/master/.github/workflows/publish.yml).

### Requirements

- Node
- Golang

```
$ go get -u github.com/gauntface/go-html-asset-manager/cmds/htmlassets/
$ go get -u github.com/gauntface/go-html-asset-manager/cmds/genimgs/
$ npm install
$ npm run build
```