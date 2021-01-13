% include('header.tpl', title='USA')
<script>
  const urls = {{!lines}};
</script>
<div class="row">
  <div class="col-12 mt-2 text-center">
    <form class="form-inline justify-content-center mb-2" onsubmit="goToUrl($('#inputUrl').val()); return false;">
      <div class="form-group mx-sm-3 mb-2">
        <label for="inputUrl" class="font-weight-bold mr-3">Provide Company URL</label>
        <input autocomplete="off" type="text" class="form-control" id="inputUrl">
      </div>
      <button type="submit" class="btn btn-primary mb-2">Go</button>
    </form>
    <table class="table table-hover justify-content-center">
      <tbody>
        % for l in lines:
        <tr>
          <td>
            {{ l }}
          </td>
        </tr>
        % end
      </tbody>
    </table>
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
% include('footer.tpl', title='Footer')