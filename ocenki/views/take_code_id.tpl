% include('header.tpl', title='Автоматическая проверка работ')

% if 'res' in locals():
<h5>Щелкнув по тегу, вы можете добавить для него комментарий</h5>
    <div class="row">
      <div class="col-sm-12">
        <pre id="code" class="prettyprint lang-html linenums:1">{{res}}</pre>
      </div>
    </div>
    <div class="fixed_btns">
  	  <form style="display: inline-block;" action="/raw", method="POST" target="_blank">
        <input name="code_id" type="hidden" value="{{res}}" />
  		  <input name="[id]" id="page_id" type="hidden" value="{{uid}}" />
  		  <textarea id="clipboard" style="display:none;"></textarea>
      </form>
  	  <button class="btn btn-light copyRaw" onclick="event.preventDefault(); copyRaw(this, '{{uid}}')">Скопировать код в буфер</button>
      <button class="btn btn-dark" onclick="saveMarks()">Сохранить</button>
    </div>
% end

<div class="row">
  <div class="col-sm-12">
    <form action='/reviews' method="POST">
        <h1 style="text-align:center;">Введите HTML работы "Научиться учиться"</h1>
      <div class="form-group">
	    <input id="rand_id" name="[id]" type="hidden" value="" />
        <textarea rows="10" name="code_id" class="form-control"></textarea>
      </div>
      <div class="form-group">
        <button class="form-control" type="submit">Проверить</button>
      </div>
    </form>
	<span style="display: inline-block;  margin-top: 20px;">Для замечаний и предложений заполните <a href="https://docs.google.com/forms/d/e/1FAIpQLSd-VhYUq6gqRz0yynBAjOxHcXfpx0WZVBt479rdB3B9kq1bNw/viewform?usp=sf_link">эту</a> форму.</span>
  </div>
  <div class="col-sm-8"></div>
</div>

% include('footer.tpl', title='Footer')