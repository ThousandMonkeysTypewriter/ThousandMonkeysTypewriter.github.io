% include('header.tpl', title='Автоматическая проверка работ')

% if 'res' in locals():
    <div class="row">
      <div class="col-sm-12">
        <pre>
          <code class="html">{{res}}</code>
        </pre>
      </div>
    </div>
    <div class="fixed_btns">
      <form style="display: inline-block;" action="/raw", method="POST" target="_blank">
        <input name="code_id" type="hidden" value="{{res}}" />
        <button class="btn btn-light" type="submit">Raw</button>
      </form>
      <button class="btn btn-dark" onclick="saveMarks()">Сохранить</button>
    </div>
% end

<div class="row">
  <div class="col-sm-12">
    <form action='/reviews' method="POST">
        <h1 style="text-align:center;">Введите HTML работы "Научиться учиться"</h1>
      <div class="form-group">
        <textarea rows="10" name="code_id" class="form-control"></textarea>
      </div>
      <div class="form-group">
        <button class="form-control" type="submit">Проверить</button>
      </div>
    </form>
  </div>
  <div class="col-sm-8"></div>
</div>

% include('footer.tpl', title='Footer')