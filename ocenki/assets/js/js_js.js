const commentSelector = '.com';
const tagSelector = '.tag';
const attrSelector = '.atn';
const autoCommentClass = 'autoComment';
const elIdAttrName = 'element_id';
const $PLN = $('<span class="pln">    </span>'); // минимальный отступ

window['exports'] = {
  init:
    function() {

      jQuery(document).ready(function () {
        const code = get_code();
        $('#rand_id').val('_' + Math.random().toString(36).substr(2, 9));

        splitTags(code);

        const comments = getEditableComment(code, commentSelector);
        let numOfComments = comments.length;

        parseSpecialAttrs(code);
        initTagsForCommenting(code);
        comments2inputs(comments);
        // signComments();


        // initCommentOnClick($('.addCommentOnClick'), numOfComments);

        initCommonComment(code, commentSelector);

      	// setRemoves();
      	setRaw();
      });

    }
}


function splitTags(code) {
  code.find(tagSelector).each(function(i, tag) {
    $tag = $(tag);
    while($tag.text().startsWith('><') || $tag.text().match('</.*><.*') || $tag.text().match('<.*><.*')) {
      if($tag.text().startsWith('><')) {
        let $newTag = $tag.clone();
        $newTag.text($newTag.text().slice(1));
        $tag.text($tag.text().slice(0,1));
        $newTag.insertAfter($tag);
        $tag = $newTag;
      } else if( $tag.text().match('</.*><.*') || $tag.text().match('<.*><.*') ) { // sibling tag or nested tag
        const splitIndex = $tag.text().indexOf('><')+1;
        let $newTag = $tag.clone();
        $newTag.text($newTag.text().slice(splitIndex));
        $tag.text($tag.text().slice(0,splitIndex));
        $newTag.insertAfter($tag);
        $tag = $newTag;
      }
    }
  });
}

function initCommonComment(comments) {
  /*$.each(code.find('.com'), function(i, com){
    if(!~com.textContent.indexOf('$%$'))
      return true;

  });*/
  // $('.com')
}

function getEditableComment(code, commentSelector) {
  comments = [];
  $.each(code.find(commentSelector), function (i, comment) {
    let $comment = $(comment);
  	if($comment.text().indexOf('$$$') > -1)
        comments.push($comment);
	else if($comment.text().indexOf('$%$') > -1) {
        let comText = '';
		let isCollectCom = true;
		let $c = $comment.parent();
		let toRemove = [];
		const finishText = '--';
		let rows = 3;
		while(isCollectCom) {
		  $c = $c.next();
		  let t = $c.text();
		  if(t.match(finishText)) {
			isCollectCom = false;
			t = t.replace(finishText, '');
		  }
		  comText += t;
		  comText += "\n";
		  toRemove.push($c);
		  rows += 1;
		}
		$.each(toRemove, function(i, $li){
		  $li.remove();
		});
		$comment.html('<span class="commentWrapper commonComment"><textarea rows="'+ rows +'" class="form-control">'+comText.replace("*/", "")+'</textarea></span>');
	}
  });
  return comments;
}

function setRaw() {
	if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
	  const data = {
		'marks[0]': {id: $('#page_id').val()}
	  }
	  
	  let status = {
		  class: 'status_fail',
		  mes: 'Error'
	  };
	  $.post({
		url: '/js/raw',
		contentType: "application/json",
		// dataType: "json",
		data: data
	  }).done(function (data) {
		status = {
		  class: 'status_ok',
		  mes: 'Ok'
		};
	  }).fail(function (data) {
		console.log(data);
		alert('Error');
	  }).always(function(data) {
		if(status.mes == 'Ok') {
		  	clipboard = document.getElementById("clipboard");
	        clipboard.value = data;
		} else {
		  console.log('Error');
		  alert('Error');
		}
	  });
	}
  return false;
}


function get_code() {
  return $('#code');
}

function comments2inputs(comments) {
  $.each(comments, function (i, comment) {
    let $comment = $(comment);
    $comment.text( htmlEntities( $comment.text().replace("/*$$$", "").replace("*/", "").trim() ) );

    let node = null,
        order = 0;
    let prev = $comment.parents('li').prev();
    let tagName = '';
    let elId = '';
    if(prev.find('.commentWrapper').length) {
      order = +prev.find('.commentWrapper').attr('order')+1;
      node = prev.find('.commentWrapper').attr('node');
      tagName = prev.find('.commentWrapper').find('input').attr('tag');
      elId = prev.find('.commentWrapper').find('input').attr(elIdAttrName);
    } else {
      node = prev.find('.addCommentOnClick').length && prev.find('.addCommentOnClick').attr('node');
      tagName = node && prev.find('.addCommentOnClick').attr('tag');
      elId = node && prev.find('.addCommentOnClick').attr(elIdAttrName);
    }

    const span = generateCommentInput(node, order, $comment.text(), tagName, elId, autoCommentClass);
    const $span = $(span);
    $input = $span.find('p');

    $comment.replaceWith($span);
    comment = $input[0];
    $comment = $(comment);

   // initAutocomplete($comment);
   initDynamicInputWidth($comment);
   // saveOnChange($comment);
    $comment.trigger('initWidth')
  });
}

function saveOnChange($comment, act_) {
  if(!act_)
    act_ = 'edit';
  var timeout = null;
  $comment.on('keyup', function (ev) {
    if (timeout)
      clearTimeout(timeout);
    timeout = setTimeout(function () {
      save_marks([$comment], act_);
    }, 2000);
  });
}

function generateCommentInput(node, order, val, tagName, elId, wrapperClass) {
  // цвет задневого фона зависит от коммента
  let bgColor = '';
  val && (bgColor = 'border-warning');
  if (~(val.indexOf('great!:'))) {
    // по-умолчанию
  } else if ((val.toLowerCase().indexOf('validator:')) == 0) {
    bgColor = 'border-warning';
  } else if (~(val.toLowerCase().indexOf('можно лучше:'))) {
    bgColor = 'border-primary';
  } else if (~(val.toLowerCase().indexOf('нужно исправить:'))) {
    bgColor = 'border-danger';
  }

  let attr_id = [];
  if (node !== null)
    attr_id.push('name="comment_' + node + '"');


  return '<span class="commentWrapper '+ (wrapperClass || '') +'"' + ((node !== null) && 'node="'+node+'"' || ':') +' order="'+order+'">\
    <div class="input-group input-group-sm" >\
      <p class="form-control '+ bgColor + '" '+attr_id.join(' ')+' tag="'+ tagName +'" '+ elIdAttrName +'="'+ elId +'">'+ val +'</p>\
      <span class="btn btn-sm btn-outline-secondary toggleP" onclick="$(this).prev().removeClass(\'focused\');"><i class="fas fa-chevron-up"></i></span>\
    </div>\
  </span>';
}

function setRemoves() {
  $('.btn-outline-secondary').on('click', function (ev) {
    const node = $(ev.currentTarget).parents('.commentWrapper').attr('node');

  	save_marks([$(ev.currentTarget).parent()], 'remove');
  	$(ev.currentTarget).parents('li').remove();

    // поменять order у других комментов с тем же нодом
    resetOrder($('.commentWrapper[node="'+node+'"]'));
      
  	// const code = get_code();
    // changeCommentsAll(code);
  });
}

function initTagsForCommenting(code) {
  const tags = code.find(tagSelector);
  tag_counter = 0;
  $.each(tags, function (i, tag) {
    if(!tag.textContent.match("<[a-zA-Z]"))
      return true;
    const $tag = $(tag);
    const tagname = tag.textContent.slice(1);
    if (!$tag.text().startsWith('</') && $tag.text().toLowerCase().indexOf('<body') == -1) {
      // tagname = $tag.text().substr(0, $tag.text().indexOf(" ")).replace("<", "");
      // if (!tagname)
      //   tagname = $tag.text().substr(0, $tag.text().indexOf(">")).replace("<", "");
      $tag
     //   .addClass('addCommentOnClick')
        .attr("node", tag_counter)
        .attr("tag", tagname);
        // .attr("tagname", map[tagname]);
      // signComments($tag, 0);
	   tag_counter += 1;
    }
  });
}

/*function changeCommentsAll(code) {
  const tags = code.find(tagSelector);
  $.each(tags, function (i, tag) {
    const $tag = $(tag);
    if (!$tag.text().startsWith('</') && $tag.text().toLowerCase().indexOf('<body') == -1) {
      changeOrder($tag, 0);
    }
  });
}*/

function initCommentOnClick($els, start_from) {
  let commentsIterator = start_from;
  $els.on('click', function (ev) {
    const tag = ev.currentTarget;
    const $tag = $(tag);

    // если коммент для тега уже есть и это не автокоммент, то ничего не делаем
    let itHasManualComment = false;
    let nextTag = $tag.parents('li').next();
    let commentWrapper = nextTag.find('.commentWrapper');
    /*while(commentWrapper.length) {
      if(commentWrapper.attr('node') == $tag.attr('node') && !commentWrapper.hasClass('autoComment')) {// ручной коммент для этого нода уже есть
        itHasManualComment = true;
        break;
      }
      nextTag = nextTag.next();
      commentWrapper = nextTag.find('.commentWrapper');
    }

    if(itHasManualComment)
      return false;*/


    let value = '';
    if ($tag.attr("tagname"))
      value = $tag.attr("tagname")

    commentsIterator += 1;
    let order = 0;
    $nextCommentCand = $tag.parents('li').next();
    while($nextCommentCand.find('.commentWrapper').length && $nextCommentCand.find('.commentWrapper').attr('node') == $tag.attr('node')) {
      order += 1;
      $nextCommentCand = $nextCommentCand.next();
    }

    const tagName = $tag.attr('tag');
    const elId = $tag.attr(elIdAttrName);
    $wrapper = $(generateCommentInput($tag.attr("node"), order, value, tagName, elId));

    let $li = $tag.parents('li'); // копируем строку, меняем содержимое и вставляем после

    let $pln = $li.find('.pln');
    // если в строке несколько тегов и комментируемый тег не последний - перенести оставшуюся строку, начиная со след тега, на новую строку
    if($tag.prevAll('.addCommentOnClick').length) {
      const numOfPrevTags = $tag.prevAll('.addCommentOnClick').length;
      let pln = $($pln[0]).clone()
      pln.text(pln.text());
      for(i=0;i<numOfPrevTags;i++) {
        pln.text(pln.text()+$PLN.text())
      }
      let newLi = $li.clone().empty().html( pln );
      let nextEls = $tag.nextAll();
      newLi.append($tag);
      newLi.append(nextEls);
      newLi.insertAfter($li);
      $li = $li.next();
      $pln = $li.find('.pln');
    }

    if($tag.nextAll('.tag.addCommentOnClick').length) {
      const nextTag = $($tag.nextAll('.tag.addCommentOnClick')[0]);
      let pln = $($pln[0]).clone()
      pln.text(pln.text()+$PLN.text());
      let newLi = $li.clone().empty().html( pln );
      let nextEls = nextTag.nextAll();
      newLi.append(nextTag);
      newLi.append(nextEls);
      newLi.insertAfter($li);
    }

    let $liComment = $li.clone();
    $liComment.empty();
    if($pln.length) {
      let $plnClone = $($pln[0]).clone();
      let plnText = $plnClone.text();
      if(plnText.replace(/\s/g, '').length) {
        const to = plnText.search(/\S/g);
        $plnClone.text($plnClone.text().slice(0, to));
      }
      $liComment.append($plnClone);
    }
    $liComment.append($wrapper);
    $liComment.insertAfter($li);

    $input = $wrapper.find('input');
 //   initAutocomplete($input);
 //   initDynamicInputWidth($input);
 //   saveOnChange($input);
    $input.trigger('initWidth')
	
//	 save_marks([$input], "create");
//   setRemoves();
  });
}

function initDynamicInputWidth(input) {
  input.on('click', function (ev) {
    const commentWrapper = input.parents('.commentWrapper');
    input.hasClass('toggleOnClick') && input.addClass('focused');
  });
  input.on('initWidth', function(ev) {
    const commentWrapper = input.parents('.commentWrapper');
    const width1 = $(window).width() - commentWrapper.offset().left - 30;
    const width2 = input.text().length*10;
    if(width2 > width1+30) {
      input.addClass('toggleOnClick');
    }
    commentWrapper.css('width', width2 < width1 ? width2 : width1);
  });
}

function copyRaw(btn, uid) {

	if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
	   copyTextToClipboard(btn,  document.getElementById("clipboard").value);
	} else {
	  const data = {
		   'marks[0]': {id: uid}
	  }
	  
	  let status = {
		  class: 'status_fail',
		  mes: 'Error'
	  };
	  $.post({
		url: '/js/raw',
		contentType: "application/json",
		// dataType: "json",
		data: data
	  }).done(function (data) {
		status = {
		  class: 'status_ok',
		  mes: 'Ok'
		};
	  }).fail(function (data) {
		console.log(data);
		alert('Error');
	  }).always(function(data) {
		if(status.mes == 'Ok') {
		  copyTextToClipboard(btn, data);
		} else {
		  console.log('Error');
		  alert('Error');
		}
	  });
	}
  return false;
}

function save_marks(comments, act_) {
  const data = {
    'marks': $.map(comments, function($c) {
      return {
        comment: $c.val(),
        node: $c.parents('.commentWrapper').attr("node"),
        order: $c.parents('.commentWrapper').attr("order"),
        act: act_,
        id: $('#page_id').val()
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
	setRaw();
  });
}

function parseSpecialAttrs(code) {
  const attr_types = ['hl-success', 'hl-warning', 'hl-error', 'hl-validator'];
  const attrs = code.find(attrSelector);
  $.each(attrs, function (i, attr) {
    const ind = attr_types.indexOf(attr.textContent);
    if (~ind) {
      // const li = $(attr).parent();
      let $startTag = $(attr).prev();
      while($startTag.length && !$startTag.hasClass('tag')) { // находим открывающий тег
        $startTag = $startTag.prev();
        if(!$startTag.length)
          console.log(attr, $(attr).parents('li'), $startTag.length);
      }

      const type = attr_types[ind];
      let tagIsOpened = true;
      while(true) {
        $startTag.addClass('hl '+ type); // обводим элемент 
        if(tagIsOpened && $startTag.hasClass('tag')) { // если открывающий тег поставить флаг, что он прошел
          $startTag.addClass('hl-start');
          tagIsOpened = false;
        } else if(!$startTag.length || $startTag.hasClass('tag')) { // если тег закрывающий или конец строки выходим из цикла
          $startTag.addClass('hl-last');
          break;
        }
        $startTag = $startTag.next();
      }

      $(attr).prev().hasClass('pln') && $(attr).prev().remove();
      $(attr).remove();

    } else if(elIdAttrName == attr.textContent) { // вставляем в открывающий тег element_id для саджеста
      const elId = $(attr).next().next() && JSON.parse($(attr).next().next().text());
      let tagCond = $(attr);
      while(tagCond.length) {
        tagCond = tagCond.prev();
        if(tagCond.hasClass('tag')) {
          tagCond.attr(elIdAttrName, elId);
          $(attr).next().next().remove() && $(attr).next().remove() && ($(attr).prev().hasClass('pln') && $(attr).prev().remove()) && $(attr).remove();
          break;
        }
      }
    }
  });
}

function saveMarks() {
  comments = [];
  $('.commentWrapper input').each(function (i, mark) {
    comments.push($(mark));
  });
  save_marks(comments, "edit");
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
  input.autoComplete({
    minChars: 1,
    source: function (request, response) {
      $.get("http://78.46.103.68:1959/query?tag="+ $(input).attr('tag') +"&"+ elIdAttrName +"="+ $(input).attr(elIdAttrName) +"&term=" + input.val().toLowerCase(),
        function (data) {
          response( $.map( data, function(item) {
            return htmlEntities(item);
          }));
        }
      );
    }
  }).keyup(function (e) {
    if (e.which === 13) {
      jQuery(".ui-autocomplete").hide();
    }
  });
}
function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/*function signComments() {
  $(attrSelector).each(function(i, attr) { // найти все dist
    if(attr.textContent != 'dist')
      return true;

    const atv = $(attr).next().next();
    let dist = atv && atv.text() && +JSON.parse(atv.text());
    if(dist) {
      const $li = $(attr).parent();
      let $autoComment = $li;
      while(dist) {
        $autoComment = $autoComment.next(); 
        if(!$autoComment.find('.commentWrapper').length || dist==1)
          dist -= 1;
      }
      // const $autoComment = $li.nextAll().slice(dist-1, dist);
      const commentWrapper = $autoComment.find('.commentWrapper');
      commentWrapper && commentWrapper.attr('node', $li.find('.addCommentOnClick').attr('node')) // && commentWrapper.find('input').val(commentWrapper.find('input').val()+' node="'+ $li.find('.addCommentOnClick').attr('node') +'"');;

      // $(attr).nextAll().slice(0,3).remove();
      // $(attr).prev().remove();
      // $(attr).remove();
    }
  });
}*/

/*function signComments(tag, order) {
  const commentWrapper = tag.prev();
  if (commentWrapper.hasClass("commentWrapper")) {
    commentWrapper
      .attr("node", tag_counter)
      .attr("tagname", map[tagname])
      .attr("order", order);
    signComments(tag.prev(), order+1)
  }
}*/

function resetOrder(commentsWrapper) {
  // const commentWrapper = tag.prev();
  commentsWrapper.each(function(order, cw) {
    $(cw).attr("order", order);
  });
}


function copyToClipboard(string) {
  let textarea;
  let result;

  try {
    textarea = document.createElement('textarea');
    textarea.setAttribute('readonly', true);
    textarea.setAttribute('contenteditable', true);
    textarea.style.position = 'fixed'; // prevent scroll from jumping to the bottom when focus is set.
    textarea.value = string;

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    const range = document.createRange();
    range.selectNodeContents(textarea);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    textarea.setSelectionRange(0, textarea.value.length);
    result = document.execCommand('copy');
  } catch (err) {
    console.error(err);
    result = null;
  } finally {
    document.body.removeChild(textarea);
  }

  // manual copy fallback using prompt
  if (!result) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const copyHotkey = isMac ? '⌘C' : 'CTRL+C';
    result = prompt(`Press ${copyHotkey}`, string); // eslint-disable-line no-alert
    if (!result) {
      return false;
    }
  }
  return true;
}
function fallbackCopyTextToClipboard(btn, text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
 // textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
    if (msg == 'successful') {
      $(btn).addClass('showed');
      setTimeout(() => {
        $(btn).removeClass('showed');
      }, 2000);
    } else {
      copyToClipboard(text);
    }
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(btn, text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(btn, text);
    return;
  }
  navigator.clipboard.writeText(text).then(function () {
    console.log('Async: Copying to clipboard was successful!');

    $(btn).addClass('showed');
    setTimeout(() => {
      $(btn).removeClass('showed');
    }, 2000);
  }, function (err) {
    console.error('Async: Could not copy text: ', err);
  });
}

function attach(input){
  var attach_size = 1*1024*1024; //1мб
  var attach_file = input.files[0];
  if(attach_file.size > attach_size){
    $('#err_attach').html('Не больше 1 мб');
    $('.attach-more').val(''); //удалить аттач, если превышен размер файла
  }
};

function toggleErrors() {
  $('body').toggleClass('hide_errors');
}