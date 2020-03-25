% include('header.tpl', title='Автоматическая проверка резюме')
% if 'res' in locals():
<div class="row">
  <div class="col-sm-12">
    % include('cv.tpl', res=res)
  </div>
</div>
% end

<div class="row">
  <div class="col-sm-12">
    <form action='/reviews' method="POST" enctype="multipart/form-data">
      <h1 style="text-align:center;">Вставьте Резюме</h1>
      <div class="form-group">
        <input id="rand_id" name="[id]" type="hidden" value="" />
        <div class="input-group mt-1 mb-1">
          <div class="input-group-prepend">
            <span id="file_name" class="input-group-text" onclick="$('#file').trigger('click')">Выберите файл</span>
          </div>
          <textarea placeholder="Или вставьте текстом" rows="10" name="code_id" class="form-control"></textarea>
        </div>
        <input style="display:none" type="file" name="code_file" id="file" onchange="$('#file_name').text(this.files.length && this.files[0].name || 'Выберите файл')" />
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