% include('header.tpl', title='Sky')
<div class="row">
  <div class="col-6">
    <form class="mb-2" onsubmit="checkText($('#inputUrl').val()); return false;">
      <div class="form-group">
        <label for="inputUrl" class="">Текст на проверку</label>
        <textarea class="form-control" id="inputUrl" style="height: 50vh;resize:none;"></textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="float:right">Вперед!</button>
    </form>
  </div>
  <div class="col-6">
    <label>Результат</label>
    <div class="result"></div>
  </div>
</div>
<div id="loading_cover">
  <img class="loading_img" src="/assets/spinner.svg" alt="Loading..." />
</div>
% include('footer.tpl', title='Footer')