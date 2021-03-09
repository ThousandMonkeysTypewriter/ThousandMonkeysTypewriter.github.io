window.aliases = {
  ADJ:      {default: "прилагательное",       delete: `Удалить прилагательное`,  replace: `Заменить прилагательное`,      insert: `Вставить прилагательное`         },
  ADV:      {default: "наречие",              delete: `Удалить наречие`,         replace: `Заменить наречие`,             insert: `Вставить наречие`                },
  DET:      {default: "артикль",              delete: `Удалить артикль`,         replace: `Заменить артикль`,             insert: `Вставить артикль`                },
  MORPH:    {default: "MORPH",                delete: `Удалить MORPH`,           replace: `Заменить MORPH`,               insert: `Вставить MORPH`                  },
  NOUN:     {default: "существительное",      delete: `Удалить существительное`, replace: `Заменить существительное`                                                },
  NOUNNUM:  {default: "число существительных",                                   replace: `Заменить число существительных`                                          },
  PREP:     {default: "предлог",              delete: `Удалить предлог`,         replace: `Заменить предлог`                                                        },
  PRON:     {default: "местоимение",          delete: `Удалить местоимение`,     replace: `Заменить местоимение`                                                    },
  PUNCT:    {default: "пунктуацию",           delete: `Удалить пунктуацию`,      replace: `Заменить знак пунктуации`,     insert: `Вставить нужный знак пунктуации` },
  SPELL:    {default: "правописание",                                            replace: `Исправить правописание`                                                  },
  VERB:     {default: "глагол",               delete: `Удалить глагол`,          replace: `Заменить глагол`                                                         },
  VERBFORM: {default: "форму глагола",        delete: `Удалить форму глагола`,   replace: `Заменить форму глагола`,       insert: `Вставить форму глагола`          },
  VERBSVA:  {default: "форму глагола",                                           replace: `Заменить форму глагола`                                                  },
  WO:       {default: "порядок слов",                                            replace: `Поменять порядок слов`                                                   },
};

jQuery(document).ready(function () {
  $('#inputUrl').on('keyup', (evt) => {
    $('.btn.btn-primary').prop('disabled', !evt.target.value.length);
  });
  $('#inputUrl').trigger('keyup');
  // checkText($('#inputUrl').val());
  // $('[data-trigger="hover"]').popover();
  $('#togglePopover').on('change', (evt) => {
    $('mark').each((i, m) => {
      const content = m.attributes['data-content'].value;
      const contentDefault = m.attributes['data-content-default'].value;
      m.setAttribute('data-content', contentDefault);
      m.setAttribute('data-content-default', content);
    });
  });
  $('#type').append('<option value=""></option>')
  $('#type').append(
    Object.keys(aliases).map((opt) => { return `<option value="${opt}">${aliases[opt].default} (${opt})</option>`; }).join('')
  );
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
    window.resOld = res;
    $('.result').html(res);
    // $('[data-trigger="hover"]').popover();
  } else {
    $('.result').html(`<span style="color: red;">Error ${resp.status}</span>`);
  }
  setTimeout(() => {
    $('#loading_cover').removeClass('show');
  }, 100);
}


function renderRes(resp, text) {
  const res = constructRes(resp, text);
  $('.result').html(res);
  // $('[data-trigger="hover"]').popover();
}

function constructRes(res, text) {
  window.errors = res;
  // console.log(JSON.stringify(res, undefined, 2));
  if(!res.entities || res.entities.length == 0)
    return `<p>${text}</p>`;
  const resText = [];
  for(ind in text) {
    const letter = text[ind];
    const marksStart = [];
    const defaultMarks = [];
    const indicies =[];
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
        defaultMarks.push(`${ent.entity}: ${ent.value}`);
        indicies.push(ind2);
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
        data-entity-index='${indicies.join(',')}'
      >`);
    }
    resText.push(letter);
  }
  
  return `<p>${resText.join('')}</p>`;
}

function constructMessage(ent, part1, part2, part3) {
  if(part1 && part2) {
    return `${aliases[part1][part2]}${part3 ? ':'+part3 : ''}`;
  } else {
    let entityParts = ent.entity.split('.');
    if(aliases[entityParts[1]] && aliases[entityParts[1]][entityParts[0]]) {
      return `${aliases[entityParts[1]][entityParts[0]]}${ent.value ? ':'+ent.value : ''}`;
    } else {
      return `${ent.entity}: ${ent.value}`;
    }
  }
}


function getHighlight() {
 
    var selection = window.getSelection(); // 1.
 
    var object = {
        parent : null,
        text   : '',
        rect   : null
    };
 
    // If selection is not empty.
    if ( selection.rangeCount > 0 ) {
        object = {
            entity: null,
            start : selection.baseOffset,
            end   : selection.focusOffset,
            text  : selection.toString().trim(), // get the text.
            value : null,
            parent: selection.anchorNode.parentNode, // get the element wrapping the text.
            rect  : selection.getRangeAt(0).getBoundingClientRect(), // get the bounding box.
        };
        if(object.parent.nodeName === 'MARK') {
          const curEntity = errors.entities[object.parent.dataset.entityIndex];
          object = {
            ...object,
            ...curEntity
          };
          // object.parent = object.parent.parentNode;
        }
    }

    return object; // 2.
}
 
function showMenu(form, classPrefix) {
 
    // 1.
    var highlight = getHighlight();
 
    $('.editting, .adding').removeClass('__shown');

    if(highlight.parent.nodeName === 'MARK') {
      form = $('.editting')[0];
      classPrefix = 'editting';
    } else {

    }

    // 2.
    if ( !highlight.text ) {
        // form.setAttribute( 'class', classPrefix );
        form.style.left = 0;
        form.style.top  = 0;
 
        return;
    }
 
    // 3.
    /**
     * Only show the sharing button if the selected is a paragraph.
     */
    // console.log(highlight.parent.nodeName);
    if ( !['P', 'MARK'].includes(highlight.parent.nodeName)  ) {
        return;
    }
 
    // 4.
    var width = ( highlight.rect.width / 2 ) - 42;
    /**
     * The "42" is acquired from our sharing buttons width devided by 2.
     */
 
    form.setAttribute( 'class', `${classPrefix} __shown` );
    form.style.left = ( highlight.rect.left + width ) + 'px';
    form.style.top  = ( highlight.rect.top - 40 ) + 'px';
    /**
     * "40" is the height of our sharing buttons.
     * Herein, we lift it up above the higlighted area top position.
     */
}


jQuery(document).ready(function() {
  $('.modalBg').on('click', () => {
    const $formWrapper = $('#errorFormWrapper');
    $formWrapper.removeClass('form--show');
    $('.__shown').removeClass('__shown');
    $('.modalBg').addClass('hidden');
  });

  window.adding = document.querySelector( '.adding' );
  document.body.querySelector('.result').addEventListener( 'mouseup', function() {
    setTimeout( () => showMenu(adding, 'adding'), 100 );
  } );
  document.getElementById( 'add' ).addEventListener( 'click', function() {
    const highlight = getHighlight();
    showForm(highlight);
    event.preventDefault();
  } );
  document.getElementById( 'edit' ).addEventListener( 'click', function() {
    var highlight = getHighlight();
    showForm(highlight);
    event.preventDefault();
  } );
  $('#remove').on('click', () => {
    const highlight = getHighlight();
    removeError(highlight);
  });
})

function saveErrors(form) {
  errors.entities.push({
    end:    $('#end').val(),
    entity: `${$('#type').val()}.${$('#act').val()}`,
    start:  $('#start').val(),
    value:  $('#value').text(),
  });
  // console.log(JSON.stringify(errors, undefined, 2));
  sendError(errors);
  return false;
}

async function sendError(errors) {
  if (!errors)
    return false;
  $('#loading_cover').addClass('show');
  try {
    const resp = await fetch('http://prog.ai:1961', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        old: window.resOld,
        new: errors
      }),
    });
    if (resp.ok) { // 200-299
      // console.log(resp);
      renderRes(errors, errors.text);
      $('.modalBg').trigger('click');
    } else {
      $('.result').html(`<span style="color: red;">Error ${resp.status}</span>`);
    }
    setTimeout(() => {
      $('#loading_cover').removeClass('show');
    }, 100);
  } catch (error) {
    $('.result').html(`<span style="color: red;">Error ${error.message}</span>`);
    $('#loading_cover').removeClass('show');
  }
}

function showForm(selection) {
  const $formWrapper = $('#errorFormWrapper');
  $('#result').val('');
  $('#text').text(selection.text);
  $('#value').val(selection.value);
  $('#start').val(selection.start);
  $('#end').val(selection.end);
  if(selection.entity) {
    $('#type').val(selection.entity.split('.')[1]);
    $('#act').val(selection.entity.split('.')[0]);
    // $('#act').trigger('change');
    setResult();
  } else {
    $('#type').val('');
    $('#act').val('');
  }
  $formWrapper.css('top', selection.rect.bottom).css('left', selection.rect.x);
  $formWrapper.addClass('form--show');
  $('.modalBg').removeClass('hidden');
}

function setResult() {
  const [$type, $act, $value] = [$('#type'), $('#act'), $('#value')];
  if($act.val() === 'replace') {
    $value.parent().removeClass('hidden');
  } else {
    $value.parent().addClass('hidden');
    $value.val('');
  }
  if($type.val() && $act.val()) {
    $('#result').val(constructMessage(null, $type.val(), $act.val(), $value.val()));
  }
}

function removeError(selection) {
  errors.entities = errors.entities.filter((e) => e !== selection.entity);
  sendError(errors);
}


