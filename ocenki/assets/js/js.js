const commentSelector = '.com';
const tagSelector = '.tag';
const attrSelector = '.atn';
const autoCommentClass = 'autoComment';
const elIdAttrName = 'element_id';

jQuery(document).ready(function () {
  setTimeout(function () {
    const code = get_code();
    $('#rand_id').val('_' + Math.random().toString(36).substr(2, 9));

    splitTags(code);

    const comments = getEditableComment(code, commentSelector);
    let numOfComments = comments.length;

    parseSpecialAttrs(code);
    initTagsForCommenting(code);
    comments2inputs(comments);
    // signComments();


    initCommentOnClick($('.addCommentOnClick'), numOfComments);

    initCommonComment(code);

  	setRemoves();
  	setRaw();
  }, 1000);
});

function splitTags(code) {
  code.find(tagSelector).each(function(i, tag) {
    $tag = $(tag);
    if($tag.text().startsWith('><')) {
      let $newTag = $tag.clone();
      $newTag.text($newTag.text().slice(1));
      $tag.text($tag.text().slice(0,1));
      $newTag.insertAfter($tag);
    }
  });
}

function initCommonComment(code) {
  $.each(code.find('.com'), function(i, com){
    if(!~com.textContent.indexOf('$%$'))
      return true;

    let comText = '';
    let isCollectCom = true;
    let $c = $(com).parent();
    let toRemove = [];
    const finishText = '-->';
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
    $(com).html('<span class="commentWrapper commonComment"><textarea rows="'+ rows +'" class="form-control">'+comText+'</textarea></span>');
    saveOnChange($(com).find('.commonComment textarea'), 'save_final');

    return false;
  });
  // $('.com')
}

function getEditableComment(code, commentSelector) {
  comments = [];
  $.each(code.find(commentSelector), function (i, comment) {
    let $comment = $(comment);
  	if($comment.text().indexOf('$$$') > -1)
        comments.push($comment);
  
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
		url: '/raw',
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
    $comment.text($comment.text().replace("<!--$$$", "").replace("-->", "").trim());

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
    $input = $span.find('input');

    $comment.replaceWith($span);
    comment = $input[0];
    $comment = $(comment);

    initAutocomplete($comment);
    initDynamicInputWidth($comment);
    saveOnChange($comment);
    $comment.trigger('focusout')
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
  val && (bgColor = 'border-success');
  if (~(val.indexOf('Отлично!:'))) {
    // по-умолчанию
  } else if (~(val.toLowerCase().indexOf('можно улучшить:'))) {
    bgColor = 'border-primary';
  } else if (~(val.toLowerCase().indexOf('нужно исправить:'))) {
    bgColor = 'border-danger';
  }

  let attr_id = [];
  if (node !== null)
    attr_id.push('name="comment_' + node + '"');


  return '<span class="commentWrapper '+ (wrapperClass || '') +'"' + ((node !== null) && 'node="'+node+'"' || ':') +' order="'+order+'">\
    <div class="input-group input-group-sm" >\
      <div class="input-group-prepend">\
        <button class="btn btn-outline-secondary" type="button">X</button>\
      </div>\
      <input class="form-control '+ bgColor + '" '+attr_id.join(' ')+' value="'+ val +'" tag="'+ tagName +'" '+ elIdAttrName +'="'+ elId +'" >\
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
        .addClass('addCommentOnClick')
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
    while(commentWrapper.length) {
      if(commentWrapper.attr('node') == $tag.attr('node') && !commentWrapper.hasClass('autoComment')) {// ручной коммент для этого нода уже есть
        itHasManualComment = true;
        break;
      }
      nextTag = nextTag.next();
      commentWrapper = nextTag.find('.commentWrapper');
    }

    if(itHasManualComment)
      return false;


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

    const $li = $tag.parent(); // копируем строку, меняем содержимое и вставляем после

    let $liComment = $li.clone()
    const $pln = $li.find('.pln');
    $liComment.empty();
    $pln && $liComment.append($($pln[0]).clone());
    $liComment.append($wrapper);
    $liComment.insertAfter($li);

    $input = $wrapper.find('input');
    initAutocomplete($input);
    initDynamicInputWidth($input);
    saveOnChange($input);
    $input.trigger('focusout')
	
	save_marks([$input], "create");
	setRemoves();
  });
}

function initDynamicInputWidth(input) {
  input.on('focusin', function (ev) {
    const commentWrapper = input.parents('.commentWrapper');
    const width = $(window).width() - commentWrapper.offset().left;
    commentWrapper.css('width', width);
    // inputWrapper.css('width', '');
  });
  input.on('focusout', function(ev) {
    const commentWrapper = input.parents('.commentWrapper');
    const width1 = $(window).width() - commentWrapper.offset().left;
    const width2 = input.val().length*10;
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
		url: '/raw',
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
  const attr_types = ['hl-success', 'hl-warning', 'hl-error'];
  const attrs = code.find(attrSelector);
  $.each(attrs, function (i, attr) {
    const ind = attr_types.indexOf(attr.textContent);
    if (~ind) {
      // const li = $(attr).parent();
      let $startTag = $(attr).prev();
      while(!$startTag.hasClass('tag')) { // находим открывающий тег
        $startTag = $startTag.prev();
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
            return htmlspecialchars(item);
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

function htmlspecialchars(str) {
 if (typeof(str) == "string") {
  str = str.replace(/&/g, "&amp;"); /* must do &amp; first */
  str = str.replace(/"/g, "&quot;");
  str = str.replace(/'/g, "&#039;");
  str = str.replace(/</g, "<");
  str = str.replace(/>/g, ">");
  }
 return str;
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
