% include('header_js.tpl', title='JavaScript')

% if 'res' in locals():
<!--<h5>Щелкнув по тегу, вы можете добавить для него комментарий</h5>-->
    <div class="row">
      <div class="col-sm-12">
        <pre id="code" class="prettyprint lang-js linenums:1">{{res}}</pre>
      </div>
    </div>
    <div class="fixed_btns">
  	  <form style="display: inline-block;" action="/js/raw", method="POST" target="_blank">
        <input name="code_id" type="hidden" value="{{res}}" />
  		  <input name="[id]" id="page_id" type="hidden" value="{{uid}}" />
  		  <textarea id="clipboard" style="display:none;"></textarea>
      </form>
  	  <button class="btn btn-light copyRaw" onclick="event.preventDefault(); copyRaw(this, '{{uid}}')">Copy to clipboard</button>
      <div class="custom-control custom-switch errorsSwitcher copyRaw">
        <input type="checkbox" checked onchange="toggleErrors()" class="custom-control-input" id="customSwitch1">
        <label class="custom-control-label" for="customSwitch1">Toggle highlight</label>
      </div>
    </div>
% end

<div class="row">
  <div class="col-sm-12">
    <form action='/js/reviews' method="POST">
        <h1 style="text-align:center;"><p>Спринт 8 (JS) ver 1.0</p>
<p>Для проверки работы скопируйте содержимое всех классов в текстовое поле внизу.</p></h1>
      <div class="form-group">
	    <input id="rand_id" name="[id]" type="hidden" value="" />
        <textarea rows="10" name="code_id" class="form-control"></textarea>
      </div>
      <div class="form-group">
        <button class="form-control" type="submit">Проверить</button>
      </div>
    </form>
	<span style="display: inline-block;  margin-top: 20px;">Для замечаний и предложений заполните <a href="https://docs.google.com/forms/d/e/1FAIpQLSfC0m9e4QcITb5WMh4m-qgG2NeB0Hiqtq7n3m1EnWG0FUwwLQ/viewform?usp=sf_link">эту</a> форму.</span>
  </div>
  <div class="col-sm-8"></div>
</div>

% include('footer.tpl', title='Footer')