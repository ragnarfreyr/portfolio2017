;(function ($) {
    // Initialize smoothState on a container that has an id
    $('#main').smoothState();
})(jQuery);

if (Modernizr && Modernizr.fetch) {
  const links = document.getElementsByClassName('workitem-link');
  const memoizer = new Map();

  for (let i = 0; i < links.length; i++) {
    const link = links[i];

    link.addEventListener('click', function(event) {
      event.preventDefault();

      // Load the content from memory if possible
      // (skip HTTP request if we've fetched it before)
      if (memoizer.has(link.href)) {
        setOverlay(memoizer.get(link.href));
        return;
      }

      // Otherwise fetch the content over network
      fetchWorkItem(link.href, memoizer);
    });
  }
}

function fetchWorkItem(itemUrl, memoizer) {
  fetch(itemUrl).then(function(response) {
    if (!response.ok) throw 'Response error'

    return response.text();
  })
  .then(function(responseText) {
    // Create DOM in memory to be able to load the plaintext
    // response.text() string into a DOM to query it
    // (because we need to extract just the content to go in the overlay)
    const contentHolder = document.createElement('div');
    contentHolder.innerHTML = responseText;
    const itemContent = contentHolder.querySelector('#work').innerHTML;

    // Store the item content so that we don't have to fetch
    // it again over the network if user clicks this work item again
    memoizer.set(itemUrl, itemContent)
    setOverlay(itemContent);
  })
  .catch(function(error) {
    // Fallback on normal page load
    window.location.href = itemUrl;
  });
}

function setOverlay(content) {
  const overlay = document.getElementById('workitem-overlay');
  overlay.innerHTML = content;
  overlay.className = 'loaded';
}
