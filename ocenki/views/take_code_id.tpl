<!DOCTYPE html>
<html>
<head>
  <title>Автоматическая проверка работ</title>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
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
      position:absolute;
      z-index:10;
    }
  </style>
  <script>
    jQuery(document).ready(function(){
      setTimeout(function(){
        const code = $('code.html');
        $.each(code.find('.hljs-comment'), function(i, comment){
         // if(comment.textContent.startsWith('<!--$$$')) {
          const $comment = $(comment);
                  const top = $comment.position().top-7;
            const left = $comment.position().left + $comment.width() + 30;
            const height = $comment.height();
          // цвет задневого фона зависит от коммента
          let bgColor = 'bg-success';
          if(~(comment.textContent.indexOf('Отлично!:'))) {
            // по-умолчанию
          } else if(~(comment.textContent.indexOf('Можно улучшить:'))) {
            bgColor = 'bg-primary';
          } else if(~(comment.textContent.indexOf('Нужно исправить:'))) {
            bgColor = 'bg-danger';
          }

          $comment
            .addClass(bgColor)
            .css('color', '#FFF')
            .css('padding', '3px 6px')
            .css('border-radius', '5px');

          const select = '\
            <div class="comment_mark" style="top:'+ top +'px;left: '+ left +'px;">\
              <label>\
                <input type="radio" name="comment_'+ i +'" value="Useful" checked />\
                Useful\
              </label>\
              <label>\
                <input type="radio" name="comment_'+ i +'" value="Rel+">\
                Rel+\
              </label>\
              <label>\
                <input type="radio" name="comment_'+ i +'" value="Rel-">\
                Rel-\
              </label>\
              <label>\
                <input type="radio" name="comment_'+ i +'" value="Notrel">\
                Notrel\
              </label>\
              <label>\
                <input type="radio" name="comment_'+ i +'" value="Stupid">\
                Stupid\
              </label>\
            </div>\
          ';
                $('body').append(select);
         // }
        });
      }, 500);
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