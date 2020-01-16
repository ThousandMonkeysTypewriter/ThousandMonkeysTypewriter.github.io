% include('header.tpl', title='Автоматическая проверка работ')
% if 'res' in locals():
<h5>Щелкнув по тегу, вы можете добавить для него комментарий</h5>
<div class="row">
  <div class="col-sm-12">
  <pre id="code" class="prettyprint lang-{{lang}} linenums:1">{{res}}</pre>
</div>
</div>
<div class="fixed_btns">
<form style="display: inline-block;" action="/raw", method="POST" target="_blank">
  <input name="code_id" type="hidden" value="{{res}}" />
  <input name="[id]" id="page_id" type="hidden" value="{{uid}}" />
  <textarea id="clipboard" style="display:none;"></textarea>
</form>
<button class="btn btn-light copyRaw" onclick="event.preventDefault(); copyRaw(this, '{{uid}}')">Скопировать код в буфер</button>
<div class="custom-control custom-switch errorsSwitcher copyRaw">
  <input type="checkbox" checked onchange="toggleErrors()" class="custom-control-input" id="customSwitch1">
  <label class="custom-control-label" for="customSwitch1">Подсветка кода</label>
</div>
<button class="btn btn-dark" onclick="saveMarks()">Сохранить</button>
</div>
% end
<div class="row">
<div class="col-sm-12">
  <form action='/reviews' method="POST" enctype="multipart/form-data">
    <h1 style="text-align:center;">Введите HTML работы "Научиться учиться"</h1>
    <div class="form-group">
      <input id="rand_id" name="[id]" type="hidden" value="" />
      <div class="input-group mt-1 mb-1">
        <div class="input-group-prepend">
          <span id="file_name" class="input-group-text" onclick="$('#file').trigger('click')">Выберите файл</span>
        </div>
        <textarea placeholder="Или вставьте текстом" rows="10" name="code_id" class="form-control"></textarea>
      </div>
      <input style="display:none" type="file" name="code_file" id="file" onchange="$('#file_name').text(this.files.length && this.files[0].name || 'Выберите файл')" />
      <div class="input-group mt-1 mb-1">
        <div class="input-group-prepend">
          <label class="input-group-text" for="inputGroupSelect01">Язык</label>
        </div>
        <select class="custom-select" id="inputGroupSelect01" name="lang">
          <option value="html" {{'selected' if lang == 'html' else ''}}>HTML</option>
          <option value="js" {{'selected' if lang == 'js' else ''}}>JS</option>
          <option value="python" {{'selected' if lang == 'python' else ''}}>Python</option>
        </select>
      </div>
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