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
  console.log(JSON.stringify(res, undefined, 2));
  const popoverAliases = {
    'replace': 'Заменить на',
    'delete': 'Удалить'
  };
  if(!res.entities || res.entities.length == 0)
    return `<p>${text}</p>`;
  const resText = [];
  for(ind in text) {
    const letter = text[ind];
    const marksStart = [];
    let isMarksEnd = false;
    for(ind2 in res.entities) {
      if(ind == res.entities[ind2].end) {
        isMarksEnd = true;
      }
    }
    for(ind2 in res.entities) {
      const ent = res.entities[ind2];
      if(ind == ent.start) {
        marksStart.push(`${ent.entity}:${ent.value}`);
      }
    }
    // console.log(isMarksEnd, marksStart);
    isMarksEnd && resText.push('</mark>');
    if(marksStart.length) {
      resText.push(`<mark
        data-trigger="hover"
        data-placement="bottom"
        data-html="true"
        data-content='${marksStart.join('<br />')}'
      >`);
    }
    resText.push(letter);
  }
  
  return `<p>${resText.join('')}</p>`;
}
