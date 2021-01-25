jQuery(document).ready(function () {
  $('#inputUrl').on('keyup', (evt) => {
    $('.btn.btn-primary').prop('disabled', !evt.target.value.length);
  });
});

async function checkText(text) {
  $('#loading_cover').addClass('show');
  showRes(text);
}

async function showRes(text) {
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
    const res = constructRes(await resp.json(), text);
    $('.result').html(`${res}`);
    $('[data-trigger="hover"]').popover();
  } else {
    $('.result').html(`<p style="color: red;">Error ${resp.status}</p>`);
  }
  setTimeout(() => {
    $('#loading_cover').removeClass('show');
  }, 100);
}

function constructRes(res, text) {
  const popoverAliases = {
    'replace': 'Заменить на',
    'delete': 'Удалить'
  };
  if(!res.entities || res.entities.length == 0)
    return `<p>${text}</p>`;
  const indicies = [];
  res.entities.reverse();
  for(i in res.entities) {
    const ent = res.entities[i];
    text = `
      ${text.slice(0, ent.start)}
        <mark
          data-trigger="hover"
          data-placement="bottom"
          data-content='${ent.entity}:${ent.value}'
        >${text.slice(ent.start, ent.end)}</mark>
      ${text.slice(ent.end)}
    `;
  }
  
  return `<p>${text}</p>`;
}
