jQuery(document).ready(function () {
  setTimeout(function () {
    const code = $('code.html');
	id = $('#page_id').val();
	$('#rand_id').val('_' + Math.random().toString(36).substr(2, 9));
    let commentsIterator = code.find('.hljs-comment').length;
    $.each(code.find('.hljs-comment'), function (i, comment) {
      // if(comment.textContent.startsWith('<!--$$$')) {
      let $comment = $(comment);
      const width = ($comment.width() * 1.1) + 10;
      $comment.text($comment.text().replace("<!--", "").replace("-->", ""));
      const input = '<input class="form-control" style="width:' + width + 'px;" name="comment_' + i + '" value="' + $comment.text() + '" />';
      $input = $(input);
      $comment.replaceWith($input);
      comment = $input[0];
      $comment = $(comment);
      initAutocomplete($comment);
      // цвет задневого фона зависит от коммента
      let bgColor = 'border-success';
      const markMes = comment.value;
      if (~(markMes.indexOf('Отлично!:'))) {
        // по-умолчанию
      } else if (~(markMes.indexOf('Можно улучшить:'))) {
        bgColor = 'border-primary';
      } else if (~(markMes.indexOf('Нужно исправить:'))) {
        bgColor = 'border-danger';
      }

      $comment
        .addClass(bgColor)
        .css('display', 'inline-block')
      const top = $comment.position().top;
      const left = $comment.position().left + $comment.width() + 30;
      const height = $comment.height();

      const select = '\
            <div class="comment_mark" style="top:'+ top + 'px;left: ' + left + 'px;">\
              <label>\
                <input type="radio" name="comment_mark_'+ i + '" value="Useful" checked />\
                Useful\
              </label>\
              <label>\
                <input type="radio" name="comment_mark_'+ i + '" value="Rel+">\
                Rel+\
              </label>\
              <label>\
                <input type="radio" name="comment_mark_'+ i + '" value="Rel-">\
                Rel-\
              </label>\
              <label>\
                <input type="radio" name="comment_mark_'+ i + '" value="Notrel">\
                Notrel\
              </label>\
              <label>\
                <input type="radio" name="comment_mark_'+ i + '" value="Stupid">\
                Stupid\
              </label>\
            </div>\
          ';
      $select = $(select);
      $wrapper = $('<span class="commentWrapper"></span>');
      $comment.wrap($wrapper);
      $comment.parent().append($select);
      $select.on('change', function (ev) {
        if (ev && ev.target && ev.target.value) {
          const data = {
            'marks': {
              'comment': $(ev.currentTarget).prev().val(),
              'mark': ev.target.value,
              'node': $(ev.currentTarget).parent().attr("node"),
			  'id': id
            }
          }
          $.post({
            url: '/save',
            contentType: "application/json",
            data: data
          }).done(function (data) {
            if (data == "200") {
              const $ocenka_status = $('<div class="ocenka_status" style="color:green">Ok</div>');
              setMarkSendStatus($ocenka_status, ev, 'status_ok');
            } else {
              const $ocenka_status = $('<div class="ocenka_status" style="color:red">Error</div>');
              setMarkSendStatus($ocenka_status, ev, 'status_fail');
            }
          }).fail(function (data) {
            console.log(data);
            const $ocenka_status = $('<div class="ocenka_status" style="color:red">Error</div>');
            setMarkSendStatus($ocenka_status, ev, 'status_fail');
          });
        } else {
          console.log('nothing happend');
        }
      });
      $('<button onclick="$(this).parent().remove()" class="btn btn-remove">X</i></button>').insertBefore($comment);
      // }
    });
    $.each(code.find('.hljs-attr'), function (i, attr) {
      const tag = $(attr).parent();
      if (attr.textContent == 'hl-success') {
        tag.addClass('hl hl-success');
        attr.textContent = attr.textContent.replace('hl-success', '');
      } else if (attr.textContent == 'hl-warning') {
        tag.addClass('hl hl-warning');
        attr.textContent = attr.textContent.replace('hl-warning', '');
      } else if (attr.textContent == 'hl-error') {
        tag.addClass('hl hl-error');
        attr.textContent = attr.textContent.replace('hl-error', '');
      } else {
        return true;
      }
    });
    tag_counter = 0;
    $('.hljs-tag').each(function (i, tag) {
      const $tag = $(tag);
      if (!$tag.text().startsWith('</')) {
        tag_counter += 1;
        tagname = $tag.text().substr(0, $tag.text().indexOf(" ")).replace("<", "");
        if (!tagname)
          tagname = $tag.text().substr(0, $tag.text().indexOf(">")).replace("<", "");
        $tag.addClass('addCommentOnClick');
        $tag.attr("node", tag_counter);
        $tag.attr("tagname", map[tagname]);
        if ($tag.prev().attr('class').indexOf("commentWrapper") !== -1) {
          $tag.prev().attr("node", tag_counter);
          $tag.prev().attr("tagname", map[tagname]);
        }
      }
    });
    $('.addCommentOnClick').on('click', function (ev) {
      const tag = ev.currentTarget;
      const $tag = $(tag);

      if ($tag.next().hasClass('commentWrapper'))
        return false;
      value = "";
      width = 400;

      if ($tag.attr("tagname")) {
        value = $tag.attr("tagname")
        width = (value.length * 10) + 10;
      }
      $wrapper = $('<span class="commentWrapper" node="' + $tag.attr("node") + '"></span>');
      $wrapper.insertAfter($tag);
      commentsIterator += 1;
      const input = '<input style="width:' + width + 'px;" class="form-control comment_input" name="comment_' + commentsIterator + '" value="' + value + '" />';
      $input = $(input);
      $wrapper.append($input);
      $('<button onclick="$(this).parent().remove()" class="btn btn-remove">X</i></button>').insertBefore($input);
    });
  }, 500);
  function setMarkSendStatus(ocenka, ev, status_class) {
    $(ev.currentTarget).append(ocenka);
    $(ev.currentTarget).parent().addClass(status_class);
    setTimeout(function () {
      ocenka.remove();
      $(ev.currentTarget).parent().removeClass(status_class);
    }, 1000);
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
});
function saveMarks() {
  $('.comment_mark input:checked').each(function (i, mark) {
    $(mark).trigger('change');
  });
}