jQuery(document).ready(function () {
  $('#inputUrl').autoComplete({
    minChars: 1,
    source: function (term, suggest) {
      term = term.toLowerCase();
      var choices = urls;
      var matches = [];
      for (i=0; i<choices.length; i++)
          if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
      suggest(matches);
    }
  });

  $('.table td').on('click', function (evt) {
    const url = evt.target.textContent;
    goToUrl(url);
  });
});

function goToUrl(id) {
  id = id.trim && id.trim() || id;
  if (!id)
    return false;
  const url = new URL(window.location.href);
  url.pathname = 'predict';
  url.searchParams.set('id', id);
  window.location.href = url.href;
}
