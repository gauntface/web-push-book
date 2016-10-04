---
layout: plain
title: Web Push Book
---
# Hello

This website has a whole mess of content on implementing push for the web.

Push messaging was enabled on the web fairly recently now that the API has
had some time to settle, it's time to cover how to use it.

You can read about push here on this site *or* grab a copy of this content
via one of the download links in the footer.

<ul class="book-toc">
{% for chapter in site.content %}
  <li><a href="{{ chapter.url }}">{{ chapter.title }}</a></li>
{% endfor %}
</ul>
