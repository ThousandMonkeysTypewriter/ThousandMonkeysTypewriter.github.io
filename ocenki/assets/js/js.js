jQuery(document).ready(function () {
  $('#inputUrl').on('keyup', (evt) => {
    $('.btn.btn-primary').prop('disabled', !evt.target.value.length);
  });
  $('[data-trigger="hover"]').popover();
  $('#togglePopover').on('change', (evt) => {
    $('mark').each((i, m) => {
      const content = m.attributes['data-content'].value;
      const contentDefault = m.attributes['data-content-default'].value;
      m.setAttribute('data-content', contentDefault);
      m.setAttribute('data-content-default', content);
    });
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
  if(!res.entities || res.entities.length == 0)
    return `<p>${text}</p>`;
  const resText = [];
  for(ind in text) {
    const letter = text[ind];
    const marksStart = [];
    const defaultMarks = [];
    let isMarksEnd = false;
    for(ind2 in res.entities) {
      if(ind == res.entities[ind2].end) {
        isMarksEnd = true;
      }
    }
    for(ind2 in res.entities) {
      const ent = res.entities[ind2];
      if(ind == ent.start) {
        marksStart.push(constructMessage(ent));
        defaultMarks.push(`${ent.entity}:${ent.value}`);
      }
    }

    const isShowAlias = $('#togglePopover')[0].checked;
    isMarksEnd && resText.push('</mark>');
    if(marksStart.length) {
      resText.push(`<mark
        data-trigger="hover"
        data-placement="bottom"
        data-html="true"
        data-content='${isShowAlias ? marksStart.join('<br />') : defaultMarks.join('<br />')}'
        data-content-default='${isShowAlias ? defaultMarks.join('<br />') : marksStart.join('<br />')}'
      >`);
    }
    resText.push(letter);
  }
  
  return `<p>${resText.join('')}</p>`;
}

function constructMessage(ent) {
  const aliases = {
    ADJ:      {default: "прилагательное",       delete: `Удалить прилагательное`,  replace: `Заменить прилагательное`, insert: `Вставить прилагательное`},
    ADV:      {default: "наречие",              delete: `Удалить наречие`,         replace: `Заменить наречие`, insert: `Вставить наречие`},
    DET:      {default: "артикль",              delete: `Удалить артикль`,         replace: `Заменить артикль`, insert: `Вставить артикль`},
    MORPH:    {default: "MORPH",                delete: `Удалить MORPH`,           replace: `Заменить MORPH`, insert: `Вставить MORPH`},
    NOUN:     {default: "существительное",      delete: `Удалить существительное`, replace: `Заменить существительное`},
    NOUNNUM:  {default: "число существительных",                                   replace: `Заменить число существительных`},
    PREP:     {default: "предлог",              delete: `Удалить предлог`,         replace: `Заменить предлог`},
    PRON:     {default: "местоимение",          delete: `Удалить местоимение`,     replace: `Заменить местоимение`},
    PUNCT:    {default: "пунктуацию",           delete: `Удалить пунктуацию`,      replace: `Заменить знак пунктуации`, insert: `Вставить нужный знак пунктуации`},
    SPELL:    {default: "правописание",                                            replace: `Исправить правописание`},
    VERB:     {default: "глагол",               delete: `Удалить глагол`,          replace: `Заменить глагол`},
    VERBFORM: {default: "форму глагола",        delete: `Удалить форму глагола`,   replace: `Заменить форму глагола`, insert: `Вставить форму глагола`},
    VERBSVA:  {default: "форму глагола",                                           replace: `Заменить форму глагола`},
    WO:       {default: "порядок слов",                                            replace: `Поменять порядок слов`},
  };
  let entityParts = ent.entity.split('.');
  if(aliases[entityParts[1]] && aliases[entityParts[1]][entityParts[0]]) {
    return `${aliases[entityParts[1]][entityParts[0]]}${ent.value ? ':'+ent.value : ''}`;
  } else {
    return `${ent.entity}:${ent.value}`;
  }
}
