jQuery(document).ready(function () {
  setTimeout(function () {
    const code = get_code();

    const commentSelector = '.hljs-comment';
    const comments = code.find(commentSelector);
    let numOfComments = comments.length;

    comments2inputs(comments);
    initTagsForCommenting(code);

    colorCommentedAttrs(code);

    initCommentOnClick($('.addCommentOnClick'), numOfComments);
  }, 500);
});


function get_code() {
  return $('code.html');
}

function comments2inputs(comments) {
  $.each(comments, function (i, comment) {
    let $comment = $(comment);
    $comment.text($comment.text().replace("<!--", "").replace("-->", ""));

    const span = generateCommentInput(i, $comment.text());
    const $span = $(span);
    $input = $span.find('input');

    $comment.replaceWith($span);
    comment = $input[0];
    $comment = $(comment);

    initAutocomplete($comment);
    saveOnChange($comment);
  });
}

function saveOnChange($comment) {
  var timeout = null;
  $comment.on('keyup', function (ev) {
    if (timeout)
      clearTimeout(timeout);
    timeout = setTimeout(function () {
      save_marks([$comment]);
    }, 2000);
  });
}

function generateCommentInput(id, val, node) {
  // цвет задневого фона зависит от коммента
  let bgColor = '';
  val && (bgColor = 'border-success');
  if (~(val.indexOf('Отлично!:'))) {
    // по-умолчанию
  } else if (~(val.indexOf('Можно улучшить:'))) {
    bgColor = 'border-primary';
  } else if (~(val.indexOf('Нужно исправить:'))) {
    bgColor = 'border-danger';
  }

  let attr_id = [];
  if(id !== null)
    attr_id.push('name="comment_' + id + '"');

  return '<div class="input-group input-group-sm commentWrapper" ' + (node !== undefined ? 'node="' + node + '"' : '') +'>\
    <div class="input-group-prepend">\
      <button onclick="$(this).parents(\'.commentWrapper\').remove()" class="btn btn-outline-secondary" type="button">X</button>\
    </div>\
    <input class="form-control '+ bgColor + '" ' +attr_id.join(' ') +' value="'+ val +'" >\
  </div>';
}

function initTagsForCommenting(code) {
  const tags = code.find('.hljs-tag');
  tag_counter = 0;
  $.each(tags, function (i, tag) {
    const $tag = $(tag);
    if (!$tag.text().startsWith('</')) {
      tag_counter += 1;
      tagname = $tag.text().substr(0, $tag.text().indexOf(" ")).replace("<", "");
      if (!tagname)
        tagname = $tag.text().substr(0, $tag.text().indexOf(">")).replace("<", "");
      $tag
        .addClass('addCommentOnClick')
        .attr("node", tag_counter)
        .attr("tagname", map[tagname]);
      const commentWrapper = $tag.prev();
      if (commentWrapper.hasClass("commentWrapper")) {
        commentWrapper
          .attr("node", tag_counter)
          .attr("tagname", map[tagname]);
      }
    }
  });
}

function initCommentOnClick($els, start_from) {
  let commentsIterator = start_from;
  $els.on('click', function (ev) {
    const tag = ev.currentTarget;
    const $tag = $(tag);

    if ($tag.next().hasClass('commentWrapper'))
      return false;

    let value = '';
    if ($tag.attr("tagname"))
      value = $tag.attr("tagname")

    commentsIterator += 1;
    $wrapper = $(generateCommentInput(commentsIterator, value, $tag.attr("node")));
    $wrapper.insertBefore($tag);

    $input = $wrapper.find('input');
    initAutocomplete($input);
    saveOnChange($input);
  });
}

function save_marks(comments) {
  const data = {
    'marks': $.map(comments, function($c) {
      return {
        'comment': $c.val(),
        'node': $c.parents('.commentWrapper').attr("node")
      }
    })
  }
  
  let status = {
      class: 'status_fail',
      mes: 'Error'
  };
  $.post({
    url: '/save',
    contentType: "application/json",
    dataType: "json",
    data: data
  }).done(function (data) {
    if (data == "200") {
      status = {
        class: 'status_ok',
        mes: 'Ok'
      };
    }
  }).fail(function (data) {
    console.log(data);
  }).always(function() {
    $.each(comments, function(i, c){
      const $ocenka_status = $('<div class="ocenka_status '+ status.class +'">'+ status.mes +'</div>');
      setMarkSendStatus($ocenka_status, $(c), status.class);
    });
  });
}

function colorCommentedAttrs(code) {
  const attr_types = ['hl-success', 'hl-warning', 'hl-error'];
  const attrs = code.find('.hljs-attr');
  $.each(attrs, function (i, attr) {
    const tag = $(attr).parent();
    const ind = attr_types.indexOf(attr.textContent);
    if(type != -1) {
      const type = attr_types[ind];
      tag.addClass('hl '+ type);
      attr.textContent = attr.textContent.replace(type, '');
    }
  });
}

function saveMarks() {
  comments = [];
  $('.commentWrapper input').each(function (i, mark) {
    comments.push($(mark));
  });
  save_marks(comments);
}

function setMarkSendStatus(ocenka, $el, status_class) {
  const $par = $el.parents('.commentWrapper');
  $par.append(ocenka);
  $par.addClass(status_class);
  setTimeout(function () {
    ocenka.remove();
    $par.removeClass(status_class);
  }, 2000);
}

function initAutocomplete(input) {
  // console.log(input);
  input.autoComplete({
    minChars: 1,
    // source: "http://h57.htz10.i.detectum.com:1333/query?term=",
    source: function (request, response) {
      $.get("http://h57.htz10.i.detectum.com:1333/query?term=" + input.val().toLowerCase(),
        function (data) {
          response(data);
        }
      );
    },
    select: function (event, ui) {
      var prefix = input.val();
      var selection = ui.item.label;
      input.val(selection);
    }
  }).keyup(function (e) {
    if (e.which === 13) {
      jQuery(".ui-autocomplete").hide();
    }
  });
}