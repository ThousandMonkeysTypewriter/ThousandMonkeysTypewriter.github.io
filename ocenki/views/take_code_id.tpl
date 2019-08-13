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
  </style>
  <script>
    jQuery(document).ready(function(){
      setTimeout(function(){
        const code = $('code.html');
        $.each(code.find('.hljs-comment'), function(i, comment){
         // if(comment.textContent.startsWith('<!--$$$')) {
          let $comment = $(comment);
          const width = $comment.width()+20;
          const input = '<input style="width:'+ width +'px;" name="comment_'+ i +'" value="'+ $comment.text() +'" />';
          $input = $(input);
          $comment.replaceWith($input);
          comment = $input[0];
          $comment = $(comment);
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
            .css('margin', '2px 0')
            .css('border-radius', '5px');
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
              $.post({
                url: 'http://thousandmonkeystypewriter.com/save',
                contentType: 'text/plain',
                dataType: 'script',
                data: ev.target.value
              }).done(function(data) {
                const $ocenka_status = $('<div class="ocenka_status" style="color:green">Ok</div>');
                setMarkSendStatus($ocenka_status, ev);
                $(ev.currentTarget).append($ocenka_status);
                setTimeout(function() {
                  $ocenka_status.remove();
                }, 1000);
              }).fail(function(data) {
                console.log(data);
                const $ocenka_status = $('<div class="ocenka_status" style="color:red">Error</div>');
                setMarkSendStatus($ocenka_status, ev);
              });
            } else {
              console.log('nothing happend');
            }
          });
         // }
        });
        $.each(code.find('.hljs-attr'), function(i, attr) {
          const tag = $(attr).parent();
          if(attr.textContent == 'hl-success') {
            tag.addClass('hl hl-success');
          } else if(attr.textContent == 'hl-warning') {
            tag.addClass('hl hl-warning');
          } else if(attr.textContent == 'hl-error') {
            tag.addClass('hl hl-error');
          } else {
            return true;
          }
        });
      }, 500);
      function setMarkSendStatus(ocenka, ev) {
        $(ev.currentTarget).append(ocenka);
        setTimeout(function() {
          ocenka.remove();
        }, 1000);
      }
    });
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