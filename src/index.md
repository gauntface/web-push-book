---
layout: plain
title: Web Push Book
---
# Hello

This website has a whole mess of content on implementing push for the web.

The push messaging API is still new and the spec has only just started to settle. This site covers how to use the API and answers common questions that arise when implementing push for the web.

You can read about push here on this site *or* grab a copy of this content
via one of the download links in the footer.

<ul class="book-toc">
{% for chapter in site.content %}
  <li><a href="{{ chapter.url }}">{{ chapter.title }}</a></li>
{% endfor %}
</ul>
