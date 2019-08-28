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
    .btn.btn-remove {
      margin: 0 4px 4px 0;
      height: 20px;
      padding: 0;
      width: 20px;
      line-height: 20px;
      background-color: #9e9e9e;
      border-color: #9e9e9e;
      color: #FFF;
    }
  </style>
  <script>
    map= {"copyright":"Отлично: Нравится, как вставлена иконка копирайта","tags, excellent":"Отлично: указан минимально важный набор тегов, подключен normalize.css","closingtag":"Нужно исправить: нужен закрывающий тег","metatags, excellent":"Отлично!: указан язык, минимально необходимые meta-теги, поключены стили и  normalize.css внешним файлом","BEM, fix":"По всей работе:     Верстка выполнена очень хорошо. Соблюдаются правила методологии БЭМ. Прослеживается визуальное сходство с макетом.      Стоит в первую очередь убрать горизонтальный скролл","background-size:contain":"Надо исправить: чтобы избавиться от отступа справа, который сейчас присутствует, используйте свойство             background-size: cover вместо background-size: contain. Картинка обрежется по меньшей из сторон.","h1, excellent":"Отлично!: правильное использование заголовков h1-h6","fix":"Можно улучшить: тут больше подойдет p,. тк заголовок обычно что-то озаглавливает","normalize":"Можно улучшить: желаетльно подключить к проекту normalize.css О нем можно почитать тут: http://nicolasgallagher.com/about-normalize-css/","semantiсtags":"Хорошо: Вы использовали семантичные теги header/main/footer/section,       такую разметку проще читать как разработчику так и поисковым роботамтакая разметка хорошо читается как разработчиками, так и поисковиками.","elementnamesBEM":"Отлично: Элементы правильно названы по Методологии БЭМ","block":"Нужно исправить: этому блоку нужно задать относительно позиционирование position: relative; чтобы абсолютно спозиционированный блок с илллюстранцией     вел себя предсказуемым образом.         Советую посмотреть тему абсолютно спозиционированного ребенка внутри relative-спозиционированного родителя     https://praktikum.yandex.ru/learn/frontend-developer/courses/a202f8af-85ed-477c-9b00-32445738281a/sprints/107/topics/be479f68-af81-46f9-b361-c785f894b33f/lessons/7f7b9e58-53b1-44a2-9dc7-e219377f828e/","id":"Рекомендация: целесообразно использовать id в БЭМ максимально редко","enter":"Рекомендация и совет от разработчика будущему разработчику: Не стесняйтесь переносить переводами строк длинный текст                в HTML разметке, это ни как не влияет на данное ревью, но код не влезающий на весь экран редактора тяжело читать, переносы внутри редактора                (через enter) никак не влияют на разметку, например ниже есть длинные тексты и вот здесь тег a можно перенести на новую строку)","href":"Нужно исправить: в href может быть или ссылка или #","nav":"Можно улучшить: с точки зрения семантики это - навигация, так что лучше обернуть в тег \u003cnav\u003e и использовать неупорядоченный список","nbsp":"Нужно исправить: уберите \u0026nbsp, для этих целей есть внутренние и внешние отступы","SEOtags":"Отлично!: прописаны SEO теги","header, excellent":"Отлично: Вы использовали семантичные теги header/main/footer, для разделения на блоки используются section                 такую разметку проще читать как разработчику так и поисковым роботам","scroll":"На странице появляется горизонтальный скролл. Возможно, причиной является именно вращение треугольника","animation":"Отлично!: анимации вращения прописаны через css","size":"Нужно исправить: когда указываем размеры в пикселях, писать px не нужно. Валидатор на это ругается \u003d) https://validator.w3.org/nu/#textarea","meta":"Теперь размер шапки у вас стал строго фиксированным. Здесь это не так страшно, но в других случаях фиксированные размеры контейнера могут привести к его переполнению, из-за чего текст будет \"вываливаться\". Думаю, стоит попробовать использовать здесь для высоты относительные единицы измерения viewport, оставив при этом min и max height согласно брифу.","subtitle":"Нужно исправить!: подзаголовок должен быть размечен не h тэгом, это можеть быть тэг p, например. Про subheadings и subtitles можно прочитать подробнее здесь: https://www.w3.org/TR/html50/common-idioms.html#sub-head","styles":"Отлично!: правильно подключены стили","style":"Можно лучше: лучше всё-таки указывать стили в css, а не в атрибуте style","strong":"Нужно исправить: не нужно использовать strong, тут больше подойдет span, который нужно стилизовать каким-нибудь классом","br":"Надо исправить: не стоит использовать тег br для переноса строк","img, excellent":"Отлично!: изображения правильно сделаны ссылками с использованием тегов a и img","smallbugs, excellent":"По всей работе:     Работы выполнены отлично. Имеются небольшие ошибки с несоответсвием макету. Великолепно, что использованы теги h* и p. Хорошо, что контент выровнен и между секциями есть пустые строки для удобочитаемости","ul/li":"Можно лучше: Для ненумерованных листов более семантически верным будет использовать тэги ul и li   Тут сломается вся верстка (так что если не хотите, можете не исправлять) и нужно будет стили править,   но это будет семантически более правильным","iframe":"Отлично: здорово, что для видео используется iframe","table":"Надо исправить: Содержимое ячеек таблицы должно ровняться по верхнему краю. У вас заголовок первой ячейки уполз выше остальных. Чтобы было нагляднее, можете добавить в нее еще текста и сравните с макетом, все сразу станет видно.","a":"Можно улучшить: по смыслу предполагается, что на эти картинки моржно кликнуть и куда-нибудь перейти. Тут можно добавить ссылки.","h2-h6":"Надо исправить: в секциях description, digits, feinman и kaufman можно выделить заголовки.             Для их обозначения используйте теги h2-h6.","b":"Нужно исправить: тут не нужен b","a, fix":"Нужно исправить: в заглушки ссылок лучше добавить #, чтобы при клике браузер вел себя адекватно.","lang, excellent":"Отлично!: указаны все минимально необходимые meta-теги, указан язык страницы,         заголовок и стили подключены внешним файлом","svg":"Нужно исправить: нужно заменить на ссылку на изображение. Логотип сервиса лучше сделать кликабельной ссылкой","h":"Нужно исправить: такого элемента не бывает. Самый маленький заголовок h6","BEM":"Отлично: Правильное применение БЭМ - указано два класса: без модификатора и с модификатором","title, excellent":"Отлично: хороший title и в целом правильно оформленный head","p":"Можно улучшить: тут больше подойдет заголовок (несмотря на оформление, этот текст озаглавливает целую секцию)","classname":"Надо исправить: не стоит использовать нумерацию в класса. Это делает переиспользование стилей невозможным","digits":"Надо исправить: не стоит использовать модификатор digits","tr":"Нужно исправить: tr не используется отдельно от таблиц.","span":"Нужно исправить: для стилизации отдельных фраз нужно использовать span","font":"Можно лучше: начертание шрифта визуально отличается от макета","emptyline, excellent":"Отлично!: между секциями есть пустая строка и код выровнен по иерархии элементов. Это повышает удобочитаемость","modifier":"Надо исправить!: модификатор для элемента по методолгии БЭМ обозначается через единичное подчеркивание \"_\"","h/p":"этот заголовок и параграф после него находятся на одном уровне в структуре кода - не надо их отбивать лишними табами","section":"Можно улучшить: тут и далее по аналогии больше подойдет тег section","language":"Нужно исправить: по макету один из языков должен быть подчеркнут","align":"Надо исправить!: целесообразно не использовать атрибут align, а сделать выравнивание через CSS","section, fix":"Надо исправить: очень рекомендуется, чтобы каждый section имел свой подзаголовок.   Это единственный section, у которого его нет.   Тут есть отличный кандидат на это: \"Главные проблемы в обучении\" - можно заменить тег p на h2   Есть и другие варианты, например, сделать скрытый заголовок.","space":"Надо исправить: не хватает пробела   валидность html можно проверять тут: https://validator.w3.org/","div":"Нужно исправить: Это заголовок — тег h","dix":"Нужно исправить: тут тоже нужен заголовок","alt, recommendation":"Можно лучше: 1. желательно указывать в атрибуте alt подпись к картинке                                        2. для тега img не нужен закрывающий тег","div,":"Рекомендация: не стоит использовать лишнюю обертку в виде div\u0027а. Лучше присовить класс тегу a","white":"Нужно исправить: видимо опечатка \u003d) модификатор \"white\" должен быть написан через одинарное подчеркивание","tab":"эти вложенные элементы отбиты двумя табами вместо одного","remark(1)":"В целом по работе: отличная работа, есть одно некритичное замечание.","styles, fix":"Надо исправить: небольшая опечатка в стилях и html","ul":"Отлично!: правильно используется тег ul","logo":"Можно лучше: кажется папка logo дублируется лишний раз","html":"Нужно исправить: тут опечатка в теге (нет \u003e), из-за этого сломалась верстка","tag":"Нужно исправить: этот тег не закрыт","styles, excellent":"Отлично!: в правильном порядке подключены стили","border":"Надо исправить: в продакшен версии стоит убирать все border\u0027ы","blockquote":"Можно улучшить: тут больше подойдет blockquote","markup":"Отлично: Вся страница очень хорошо размечена по методологии БЭМ","spa":"Надо исправить: span - строчный элемент, а p - блочный. Браузер не умеет вставлять p в span, но умеет наоборот. span используется, чтобы придать части текста в строке какой-то стиль. Поместите весь текст внутрь                         тега p. Затем оберните кусок текста \"Вывод:\" в span как сейчас это делают теги b. Задайте span класс                         two-columns__span-bold и для этого класса в css файле определите полужирное начертание с помощью свойства                         font-weight","fractional":"Нужно исправить: не нужно использовать дробные значения,                              далее в коде эта ошибка тоже есть. Также тут дублируется код. Нужно назначить класс img и стилизовать его.","alt":"Можно лучше: Хорошо прописывать атрибут alt ко всем тегам \u003cimg\u003e, это позволяет браузеру показывать описание к изображению, если оно не подгрузилось, а также рассказывать людям, использующим читалки, например, слабовидящим, что изображено на картинке","metatags":"Отлично!: прописаны метатеги важные для SEO оптимизации","list":"Можно лучше: Давайте используем для списка более подходящий тег - ul, тогда cards__item будут элементами списка - теги li","classnames":"Отлично: Классы указаны верно, БЭМ методология соблюдается, здорово!","article":"Можно улучшить: тут, возможно, подойдет семантический тег article - подумайте, какая у него могла бы быть внутренняя структура.","cooments":"Пожалуйста, не удаляйте комментарии после исправления ошибок","emptytag":"если тег пустой, то закрывающий тег можно оставить  на той же строке, что и открывающий","background":"Надо исправить: цвет фона этой секции - белый","header":"Важно исправить: тут должен быть заголовок","openningtag":"Надо исправить: имеется закрывающий тег, но нет открывающего","openingtag":"Нужно исправить: пропущен открывающий тег секции","colours":"Надо исправить: Перепутаны цвета у логотипа и копирайта.","frame":"Можно лучше: тут не нужна рамка :)","img":"Надо исправить: у тега img есть обязательный атрибут alt, который содержит текстовое описание картинки.                                     В ситуации с иконками, рядом с которыми есть текст, alt может быть пустым: alt\u003d\"\".                                     Подробнее про этот случай можно прочитать тут - https://www.w3.org/TR/html51/semantics-embedded-content.html#icon-images","cards":"Нужно исправить: элементы с префиксом \"cards__\" должны принадлежать блоку \"cards\". Но такого блока сейчас нет.","indent":"Можно лучше: для отступов между элементами стоит вместо пробела использовать margin\u0027ы","footer":"Нужно исправить: footer__social-links\" - это один блок, содержащий в себе ссылки footer__social-links, не нужно его дублировать","line":"Надо исправить: между footer и main имеется белая полоса","classes":"Отлично: Классы указаны верно, БЭМ методология соблюдается, здорово!","h1":"Отлично!: на странице используется тег h1","h2":"Можно улучшить: мне бы захотелось здесь поставить h2, потому что это заголовок секции, пусть и визуально он не сильно выделяется. Но и Ваш вариант полностью валидный.","h3":"Надо исправить: Пожалуй, это все же простой текст, ведь, как минимум, после заголовка нет никакого текста, как-то связанного с ним, поэтому ему нечего озаглавить.","video":"Тега видео не останется после переделки под тег iframe, этот пункт скорее для информации   на будущее: тег video должен закрываться, например \u003c/video\u003e","title":"Отлично: хороший, говорящий title","h4":"Можно улучшить: лучше h2","h5":"Можно улучшить: лучше h2","content":"Нужно исправить: не хватает содержимого","frameborder":"Нужно исправить: валидатор говорит, что атрибут frameborder устарел и засчитывает это как за ошибку. https://validator.w3.org/nu/#textarea","lang":"Отлично!: правильно прописана локализация","class":"Надо исправить: не стоит использовать нумерацию в классах. Также лучше использовать один класс на два элемента, а подверкивание добавлять с помощью еще одного класса. Например: header__lang_selected","says":"Исправила пробелы между значками соцсетей и их названиями с помощью margin-right, но значение (5px) поставила наугад.                             Есть ли рекомендации, какой должна быть ширина пробела в пикселях?","headers":"Можно лучше: для всех section лучше добавлять заголовки, это важно для доступности(seo, читалки и т.д)","comments":"Пожалуйста, не удаляйте комментарии после применения исправлений. Мы должны проверить правильность ваших исправлений","social":"Можно лучше: Соцсети","blockqoute":"Можно улучшить: для лучшей семантики лучше использовать blockquote","colour":"Надо исправить: цвет блока не соответствует макету, также стоит изменить стилизацию ссылок в этом блоке","р2":"Нужно исправить: title - элемент блока content, нужно отделить двумя нижники подчеркиваниями","р4":"Нужно исправить: heading - элемент блока content, нужно отделить двумя нижники подчеркиваниями","br, fix":"Нужно исправить: тут и во всей секции, по аналогии, br здесь нужен. Отступы задаются стилями. Добавьте подходящий класс параграфам и стилизуйте их.","img*":"Надо исправить: согласно макету нижняя часть изображения не должна быть видна","mnemonics":"Можно улучшить: для градусов тоже лучше использовать html мнемонику","semantictags":"Отлично: хорошо, что используете семантические теги","location":"Надо исправить: обратите внимание на положение треугольника на макете. Он должен выходит за правую границу             на 210 пикселей","flexbox":"Надо исправить: Разобраться с положением элементов, центрирование блока с помощью flexbox"}
    jQuery(document).ready(function(){
      setTimeout(function(){
        const code = $('code.html');
        let commentsIterator = code.find('.hljs-comment').length;
        $.each(code.find('.hljs-comment'), function(i, comment){
         // if(comment.textContent.startsWith('<!--$$$')) {
          let $comment = $(comment);
          const width = ($comment.width()*1.1)+10;
          $comment.text($comment.text().replace("<!--", "").replace("-->", ""));
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
                  'mark': ev.target.value,
				  'node': $(ev.currentTarget).parent().attr("node")
                }
              }
              $.post({
                url: '/save',
				contentType: "application/json",
                data: data
              }).done(function(data) {
				if (data == "200") {
					const $ocenka_status = $('<div class="ocenka_status" style="color:green">Ok</div>');
					setMarkSendStatus($ocenka_status, ev, 'status_ok');
				} else {
					const $ocenka_status = $('<div class="ocenka_status" style="color:red">Error</div>');
					setMarkSendStatus($ocenka_status, ev, 'status_fail');
				}
              }).fail(function(data) {
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
		tag_counter = 0;
        $('.hljs-tag').each(function(i, tag){
          const $tag = $(tag);
          if(!$tag.text().startsWith('</')) {
		    tag_counter+=1;
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
        $('.addCommentOnClick').on('click', function(ev) {
          const tag = ev.currentTarget;
          const $tag = $(tag);

          if($tag.next().hasClass('commentWrapper'))
            return false;
		  value = "";
		  width = 400;
		  
		  if ($tag.attr("tagname")) {
		     value = $tag.attr("tagname")
			 width = (value.length*10)+10;
		  }
          $wrapper = $('<span class="commentWrapper" node="'+$tag.attr("node")+'"></span>');
          $wrapper.insertAfter($tag);
          commentsIterator += 1;
          const input = '<input style="width:'+ width +'px;" class="form-control comment_input" name="comment_'+ commentsIterator +'" value="'+value+'" />';
          $input = $(input);
          $wrapper.append($input);
          $('<button onclick="$(this).parent().remove()" class="btn btn-remove">X</i></button>').insertBefore($input);
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