% include('header.tpl', title='USA')
<script>
  const urls = {{!lines}};
</script>
<div class="row">
  <div class="col-12 mt-2 text-center">
    <h1>Choose Url</h1>
    <form class="form-inline justify-content-center mb-2" onsubmit="goToUrl($('#inputUrl').val()); return false;">
      <div class="form-group mx-sm-3 mb-2">
        <label for="inputUrl" class="sr-only">Url</label>
        <input autocomplete="off" type="text" class="form-control" id="inputUrl">
      </div>
      <button type="submit" class="btn btn-primary mb-2">Choose</button>
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
</div>
% include('footer.tpl', title='Footer')