<div class="row text-center">
  % for type,number in res['responseBody']['counters'].items():
    <div class="col">
      <div class="pt-2 border border-{{type}}">
        <h2 class="mb-0">{{number}}</h2>
        <p class="mb-2">{{type}}</p>
      </div>
    </div>
  % end
</div>
% for ll in res['responseBody']['result']:
  <div class="my-3 p-3 bg-white rounded shadow points">
    <h5 class="border-bottom border-gray pb-2 mb-0">
      {{ll['title']}}
    </h5>
    % for l in ll['rows']:
      <div class="text-muted pt-3 border-bottom border-gray">
        <p class="pb-3 mb-0 point">
          {{l['raw']}}
        </p>
        % for type, mes in l.get('comments',{}).items():
          <p class="pb-3 mb-0 mt--3 text-{{type}} small ml-3">
            {{mes}}
          </p>
        % end
      </div>
    % end
  </div>
% end