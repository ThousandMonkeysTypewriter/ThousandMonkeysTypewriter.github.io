jQuery(document).ready(function () {
  
});

async function checkText(text) {
  $('#loading_cover').addClass('show');
  showModal(text);
}

async function showModal(text) {
  text = text.trim && text.trim() || text;
  if (!text)
    return false;
  const resp = await fetch('http://178.63.1.195:8421/gec_api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({text:text}),
  });
  if (resp.ok) { // 200-299
    const res = await resp.json();
    $('.modal-title').text('Loading ...');
    $('.modal-body').html('');
    $('.modal-title').text(`Ответ для: "${text}"`);
    console.log(res);
    $('.modal-body').html(`<pre>${JSON.stringify(res, undefined, 2)}</pre>`);
  } else {
    $('.modal-title').text('Error');
    $('.modal-body').html(resp.status);
  }
  $('.modal').modal();
  setTimeout(() => {
    $('#loading_cover').removeClass('show');
  }, 100);
}
