<!DOCTYPE html>
<html>
<head>
  <title>Автоматическая проверка работ</title>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://code.jquery.com/jquery-3.3.1.min.js" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/default.min.css">
  <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/highlight.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-autocomplete/1.0.7/jquery.auto-complete.min.css" integrity="sha256-MFTTStFZmJT7CqZBPyRVaJtI2P9ovNBbwmr0/KErfEc=" crossorigin="anonymous" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-autocomplete/1.0.7/jquery.auto-complete.min.js" integrity="sha256-zs4Ql/EnwyWVY+mTbGS2WIMLdfYGtQOhkeUtOawKZVY=" crossorigin="anonymous"></script>
  <script>hljs.initHighlightingOnLoad();</script>
  <style>
    .comment_wrapper {
      display: flex;
    }
    .fieldset {
      margin-left: 10px;
    }
    .comment_mark {
      display: inline-block;
      margin-left: 10px;
    }
    .commentWrapper {
      white-space: nowrap;
    }
    .hl {
      display: inline-block;
      padding: 3px 5px;
      background: #dcdcdc;
      border-radius: 5px;
    }
    .hl-warning {
      background: #8295d0;
    }
    .hl-success {
      background: #b7dab4;
    }
    .hl-error {
      background: #ce9d9d;
    }
    *:focus {
      outline: none;
    }
    .ocenka_status {
      display: inline-block;
      margin-right: 10px;
    }
    .fixed_btns {
      position: fixed;
      top: 10px;
      right: 25px;
    }
    .addCommentOnClick {
      cursor: pointer;
    }
    .comment_input {
      display: inline-block;
    }
    .btn.btn-danger {
      margin: 0 4px 4px 0;
    }
  </style>
  <script>
    jQuery(document).ready(function(){
      setTimeout(function(){
        const code = $('code.html');
        let commentsIterator = code.find('.hljs-comment').length;
        $.each(code.find('.hljs-comment'), function(i, comment){
         // if(comment.textContent.startsWith('<!--$$$')) {
          let $comment = $(comment);
          $comment.text($comment.text().replace("<!--", "").replace("-->", ""));
          const width = $comment.width()+20;
          const input = '<input class="form-control" style="width:'+ width +'px;" name="comment_'+ i +'" value="'+ $comment.text() +'" />';
          $input = $(input);
          $comment.replaceWith($input);
          comment = $input[0];
          $comment = $(comment);
          initAutocomplete($comment);
          // цвет задневого фона зависит от коммента
          let bgColor = 'border-success';
          const markMes = comment.value;
          if(~(markMes.indexOf('Отлично!:'))) {
            // по-умолчанию
          } else if(~(markMes.indexOf('Можно улучшить:'))) {
            bgColor = 'border-primary';
          } else if(~(markMes.indexOf('Нужно исправить:'))) {
            bgColor = 'border-danger';
          }

          $comment
            .addClass(bgColor)
            .css('display', 'inline-block')
          const top = $comment.position().top;
          const left = $comment.position().left + $comment.width() + 30;
          const height = $comment.height();

          const select = '\
            <div class="comment_mark" style="top:'+ top +'px;left: '+ left +'px;">\
              <label>\
                <input type="radio" name="comment_mark_'+ i +'" value="Useful" checked />\
                Useful\
              </label>\
              <label>\
                <input type="radio" name="comment_mark_'+ i +'" value="Rel+">\
                Rel+\
              </label>\
              <label>\
                <input type="radio" name="comment_mark_'+ i +'" value="Rel-">\
                Rel-\
              </label>\
              <label>\
                <input type="radio" name="comment_mark_'+ i +'" value="Notrel">\
                Notrel\
              </label>\
              <label>\
                <input type="radio" name="comment_mark_'+ i +'" value="Stupid">\
                Stupid\
              </label>\
            </div>\
          ';
          $select = $(select);
          $wrapper = $('<span class="commentWrapper"></span>');
          $comment.wrap($wrapper);
          $comment.parent().append($select);
          $select.on('change', function(ev) {
            if(ev && ev.target && ev.target.value) {
              const data = {
                'marks': {
                  'comment': $(ev.currentTarget).prev().val(),
                  'mark': ev.target.value
                }
              }
              $.post({
                url: 'http://78.46.103.68:1958/save',
                contentType: 'text/plain',
                dataType: 'json',
                contentType: "application/json",
                data: data
              }).done(function(data) {
                const $ocenka_status = $('<div class="ocenka_status" style="color:green">Ok</div>');
                setMarkSendStatus($ocenka_status, ev, 'status_ok');
              }).fail(function(data) {
                console.log(data);
                const $ocenka_status = $('<div class="ocenka_status" style="color:red">Error</div>');
                setMarkSendStatus($ocenka_status, ev, 'status_fail');
              });
            } else {
              console.log('nothing happend');
            }
          });
          $('<button onclick="$(this).parent().remove()" class="btn btn-danger">X</i></button>').insertBefore($comment);
         // }
        });
        $.each(code.find('.hljs-attr'), function(i, attr) {
          const tag = $(attr).parent();
          if(attr.textContent == 'hl-success') {
            tag.addClass('hl hl-success');
            attr.textContent = attr.textContent.replace('hl-success', '');
          } else if(attr.textContent == 'hl-warning') {
            tag.addClass('hl hl-warning');
            attr.textContent = attr.textContent.replace('hl-warning', '');
          } else if(attr.textContent == 'hl-error') {
            tag.addClass('hl hl-error');
            attr.textContent = attr.textContent.replace('hl-error', '');
          } else {
            return true;
          }
        });
        $('.hljs-tag').each(function(i, tag){
          const $tag = $(tag);
          if(!($tag.prev().hasClass('commentWrapper') || $tag.text().startsWith('</')))
            $tag.addClass('addCommentOnClick');

        });
        $('.addCommentOnClick').on('click', function(ev) {
          const tag = ev.currentTarget;
          const $tag = $(tag);

          if($tag.next().hasClass('commentWrapper'))
            return false;
          $wrapper = $('<span class="commentWrapper"></span>');
          $wrapper.insertAfter($tag);
          const width = 300;
          commentsIterator += 1;
          const input = '<input style="width:'+ width +'px;" class="form-control comment_input" name="comment_'+ commentsIterator +'" value="" />';
          $input = $(input);
          $wrapper.append($input);
          $('<button onclick="$(this).parent().remove()" class="btn btn-danger">X</i></button>').insertBefore($input);
        });
      }, 500);
      function setMarkSendStatus(ocenka, ev, status_class) {
        $(ev.currentTarget).append(ocenka);
        $(ev.currentTarget).parent().addClass(status_class);
        setTimeout(function() {
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
            $.get("http://h57.htz10.i.detectum.com:1333/query?term="+input.val().toLowerCase(),
              function (data) {
                response(data);
              }
            );
          },
          select: function(event, ui) {
            var prefix = input.val();
            var selection = ui.item.label;
            input.val(selection);
          }
        }).keyup(function (e) {
          if(e.which === 13) {
            jQuery(".ui-autocomplete").hide();
          }
        });
      }
    });
    function saveMarks() {
      $('.comment_mark input:checked').each(function(i, mark) {
        $(mark).trigger('change');
      });
    }
  </script>
</head>
<body>
  <div class="container-fluid">
    % if 'res' in locals():
      <div class="row">
        <div class="col-sm-12">
          <pre>
            <code class="html">{{res}}</code>
          </pre>
        </div>
      </div>
    <div class="fixed_btns">
      <form style="display: inline-block;" action="/raw", method="POST" target="_blank">
        <input name="code_id" type="hidden" value="{{res}}" />
        <button class="btn btn-light" type="submit">Raw</button>
      </form>
      <button class="btn btn-dark" onclick="saveMarks()">Сохранить</button>
    </div>
    % end
    <div class="row">
      <div class="col-sm-12">
        <form action='/reviews' method="POST">
            <h1 style="text-align:center;">Введите HTML работы "Научиться учиться"</h1>
          <div class="form-group">
            <textarea rows="10" name="code_id" class="form-control"></textarea>
          </div>
          <div class="form-group">
            <button class="form-control" type="submit">Проверить</button>
          </div>
        </form>
      </div>
      <div class="col-sm-8"></div>
    </div>
  </div>
</body>
</html>