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
% include('footer.tpl', title='Footer')
