const commentSelector = '.com';
const tagSelector = '.tag';
const attrSelector = '.atn';
const autoCommentClass = 'autoComment'

jQuery(document).ready(function () {
  setTimeout(function () {
    const code = get_code();
    $('#rand_id').val('_' + Math.random().toString(36).substr(2, 9));

    const comments = getEditableComment(code, commentSelector);
    let numOfComments = comments.length;

    comments2inputs(comments);
    initTagsForCommenting(code);
    signComments();

    colorCommentedAttrs(code);

    initCommentOnClick($('.addCommentOnClick'), numOfComments);

    initCommonComment(code);

  	setRemoves();
  	setRaw();
  }, 1000);
});

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
    $comment.text($comment.text().replace("<!--$$$", "").replace("-->", ""));

    const span = generateCommentInput(null, 0, $comment.text(), autoCommentClass);
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

function generateCommentInput(node, order, val, wrapperClass) {
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
      <input class="form-control '+ bgColor + '" '+attr_id.join(' ')+' value="'+ val +'" >\
    </div>\
  </span>';
}

function setRemoves() {
  $('.btn-outline-secondary').on('click', function (ev) {
  	save_marks([$(ev.currentTarget).parent()], 'remove');
  	$(ev.currentTarget).parents('li').remove();
      
  	const code = get_code();
    changeCommentsAll(code);
  });
}

function initTagsForCommenting(code) {
  const tags = code.find(tagSelector);
  tag_counter = 0;
  $.each(tags, function (i, tag) {
    if(!tag.textContent.match("<[a-zA-Z]"))
      return true;
    const $tag = $(tag);
    if (!$tag.text().startsWith('</') && $tag.text().toLowerCase().indexOf('<body') == -1) {
      tagname = $tag.text().substr(0, $tag.text().indexOf(" ")).replace("<", "");
      if (!tagname)
        tagname = $tag.text().substr(0, $tag.text().indexOf(">")).replace("<", "");
      $tag
        .addClass('addCommentOnClick')
        .attr("node", tag_counter);
        // .attr("tagname", map[tagname]);
      // signComments($tag, 0);
	  tag_counter += 1;
    }
  });
}

function changeCommentsAll(code) {
  const tags = code.find(tagSelector);
  $.each(tags, function (i, tag) {
    const $tag = $(tag);
    if (!$tag.text().startsWith('</') && $tag.text().toLowerCase().indexOf('<body') == -1) {
      changeOrder($tag, 0);
    }
  });
}

function initCommentOnClick($els, start_from) {
  let commentsIterator = start_from;
  $els.on('click', function (ev) {
    const tag = ev.currentTarget;
    const $tag = $(tag);

    if($tag.parents('li').next().find('.commentWrapper').length && !$tag.parents('li').next().find('.commentWrapper').hasClass('autoComment'))
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

    $wrapper = $(generateCommentInput($tag.attr("node"), order, value));

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
  const commentWrapper = input.parents('.commentWrapper');
  const width = $(window).width() - commentWrapper.offset().left;
  commentWrapper.css('width', width);
  /*input.on('focusin', function (ev) {
    inputWrapper.css('width', '');
  });
  input.on('focusout', function(ev) {
    inputWrapper.css('width', input.val().length*10+'px');
  });*/
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

function colorCommentedAttrs(code) {
  const attr_types = ['hl-success', 'hl-warning', 'hl-error'];
  const attrs = code.find(attrSelector);
  $.each(attrs, function (i, attr) {
    const ind = attr_types.indexOf(attr.textContent);
    if (~ind) {
      const li = $(attr).parent();
      let tagIsOpened = false;
      const type = attr_types[ind];
      $(li).children().each(function(i,e){
        $e = $(e);
        if(tagIsOpened || $e.hasClass('tag')) {
          $e.addClass('hl '+ type);
          if(tagIsOpened && $e.hasClass('tag')) {
            $e.addClass('hl-last');
            return false;
          } else {
            tagIsOpened = true;
          }
        }
      });
      attr.textContent = attr.textContent.replace(type, ' ');
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
  // console.log(input);
  input.autoComplete({
    minChars: 1,
    // source: "http://h57.htz10.i.detectum.com:1333/query?term=",
    source: function (request, response) {
      $.get("http://78.46.103.68:1959/query?term=" + input.val().toLowerCase(),
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

function signComments() {
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
}

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

function changeOrder(tag, order) {
  const commentWrapper = tag.prev();
  if (commentWrapper.hasClass("commentWrapper")) {
    commentWrapper
      .attr("order", order);
	  
    changeOrder(tag.prev(), order+1)
  }
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