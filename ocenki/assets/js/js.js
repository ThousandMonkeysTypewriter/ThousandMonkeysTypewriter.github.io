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
  // window.location.href = url.href;
  $('#loading_cover').addClass('show');
  showModal(url);
}

async function showModal(url) {
  const response = await fetch(url.href);
  if (response.ok) { // 200-299
    const res = await response.text();
    $('.modal-title').text('Loading ...');
    $('.modal-body').html('');
    $('.modal-title').text(`Response for "${url.searchParams.get('id')}"`);
    $('.modal-body').html(res);
  } else {
    $('.modal-title').text('Error');
    $('.modal-body').html(response.status);
  }
  $('.modal').modal();
  setTimeout(() => {
    $('#loading_cover').removeClass('show');
  }, 100);
}
