% include('header.tpl', title='Sky')
<div class="row">
  <div class="col-12 mt-2 text-center">
    <form class="form-inline justify-content-center mb-2" onsubmit="checkText($('#inputUrl').val()); return false;">
      <div class="form-group mx-sm-3 mb-2">
        <label for="inputUrl" class="font-weight-bold mr-3">Текст на проверку</label>
        <textarea class="form-control" id="inputUrl"></textarea>
      </div>
      <button type="submit" class="btn btn-primary mb-2">Вперед!</button>
    </form>
  </div>
</div>
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title"></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">Ok</button>
      </div>
    </div>
  </div>
</div>
</div>
<div id="loading_cover">
  <img class="loading_img" src="/assets/spinner.svg" alt="Loading..." />
</div>
% include('footer.tpl', title='Footer')