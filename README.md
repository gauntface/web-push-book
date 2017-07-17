[![Build Status](https://travis-ci.org/gauntface/web-push-book.svg?branch=master)](https://travis-ci.org/gauntface/web-push-book)

# web-push-book

[![Greenkeeper badge](https://badges.greenkeeper.io/gauntface/web-push-book.svg)](https://greenkeeper.io/)

A book on implementing push notifications in a web site / web app (Whatever
you want to call it).

This is in extremely early stages (i.e. me just dumping down thoughts without
proof reading or much focus), so if you spot or have feedback please raise
an issue (or better yet, a pull request) and I'll do my best to address it
when I can.

Otherwise get <a href="https://web-push-book.gauntface.com ">early access here.</a>

Cheers,
Matt

# Running Node Demo

If you wish to run the node demo you'll first need to ensure you have the NPM dependencies installed:

    npm install

Then start the node app by running:

    node src/demos/node-server/index.js

# Running Site Locally

If you want to run the site locally you'll need to install a number of dependencies for Jekyll and NPM.

- [Install RVM](https://rvm.io/rvm/install)
- `rvm install ruby-2.2.0`
- `gem install bundler`
- `rvm . do bundle install`
- `npm install`

To run the site, you need to run gulp.

    gulp

**Note:** Inlining Code

This repo uses a regex to inline code snippets into the docs.

To inline the contents of a whole file, use the following markup:

    <% include('../../code-samples/example.js') %>

To incline a snippet of code, use the following markup:

    <% include('../../code-samples/example.js', 'snippet-name') %>

This will be run before pandoc is used to generate the book.

<p style="text-align:center">
<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.
</p>
