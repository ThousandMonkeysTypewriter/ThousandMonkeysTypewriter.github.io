% include('header.tpl', title='Sky')
<div class="row">
  <div class="col-6">
    <form class="mb-2" onsubmit="checkText($('#inputUrl').val()); return false;">
      <div class="form-group">
        <label for="inputUrl" class="">Текст на проверку</label>
        <textarea class="form-control" id="inputUrl" style="height: 50vh;resize:none;"></textarea>
      </div>
      <button type="submit" class="btn btn-primary" disabled style="float:right">Вперед!</button>
    </form>
  </div>
  <div class="col-6">
    <label>Результат</label>
    <div class="form-group">
      <div class="result"></div>
    </div>
    <div class="form-inline">
      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" checked id="togglePopover">
        <label class="form-check-label" for="togglePopover">Показать алиасы ошибок</label>
      </div>
      <button class="btn btn-success ml-2 mr-1 pl-3 pr-3" style="display:none;">Верно</button>
      <button class="btn btn-danger ml-1 mr-2" style="display:none;">Ошибка</button>
    </div>
    <div class="form-group mt-4" style="display:none;">
      <textarea class="form-control" placeholder="Комментарий по оценке"></textarea>
    </div>
  </div>
</div>
<div id="loading_cover">
  <img class="loading_img" src="/assets/spinner.svg" alt="Loading..." />
</div>

<div class="editting">
  <div class="__message"></div>
  <div class="__buttons">
    <button id="remove" title="Remove"><i class="bi bi-trash"></i></button>
    <button id="edit" title="Edit/Add"><i class="bi bi-pencil"></i></button>
  </div>
  <span class="__triangle"></span>
</div>
<div class="adding">
  <div class="__buttons">
    <button id="add" title="Add"><i class="bi bi-plus"></i></button>
  </div>
  <span class="__triangle"></span>
</div>
<div id="errorFormWrapper">
  <form id="errorForm" onsubmit="return saveErrors(this);">
    <div class="form-group">
      <p id="text" class="text-justify"></p>
      <input id="start" type="hidden" />
      <input id="end" type="hidden" />
    </div>
    <div class="form-group">
      <select onchange="setResult()" name="type" class="form-control" id="type" aria-describedby="typeHelp" required></select>
      <small id="typeHelp" class="form-text text-muted">К какой части речи относится ошибка</small>
    </div>
    <div class="form-group">
      <select onchange="setResult()" name="act" class="form-control" id="act" aria-describedby="actHelp" placeholder="Удалить / заменить / вставить" required>
        <option value=""></option>
        <option value="delete">Удалить</option>
        <option value="replace">Заменить</option>
        <option value="insert">Вставить</option>
      </select>
    </div>
    <div class="form-group hidden">
      <label>На</label>
      <input name="value" id="value" class="form-control" value="" onkeyup="setResult()"  />
    </div>
    <div class="form-group">
      <label>Результат</label>
      <input id="result" class="form-control" value="" readonly />
    </div>
    <button type="submit" class="btn btn-primary"><i class="bi bi-plus"></i></button>
    <button type="button" onclick="$('.modalBg').trigger('click')" class="btn btn-secondary">Отмена</button>
  </form>
</div>
<div class="modalBg hidden"></div>
% include('footer.tpl', title='Footer')
