% v = vacancy['vac']['vacancyView']
<% work_schedule = {
  "flexible": 'Гибкий график',
  "fullDay": 'Полный день',
  "flyInFlyOut": 'Вахтовый метод',
  "remote": 'Удаленная работа',
  "shift": 'Сменный график'
}
experience = {
  "noExperience": 'Нет опыта',
  "between1And3": '1–3 года',
  "between3And6": '3–6 лет',
  "moreThan6": 'Более 6 лет'
}
employment = {
  "PART": 'Частичная занятость',
  "PROBATION": 'Стажировка',
  "PROJECT": 'Проектная/Временная работа',
  "VOLUNTEER": 'Волонтерство',
  "FULL": 'Полная занятость'
} %>

<!DOCTYPE html>
<html>
<head>
  <title>Анализ вакансии HH.RU</title>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
  <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
  <style>
    body {
      line-height: 21px;
      font-size: 14px;
      color: #333;
      font-family: ProximaNovaCond,Arial,sans-serif;
    }
    h1 {
      font-size: 36px;
      font-weight: 400;
      margin: 0 0 15px;
    }
    h1, h2 {
      display: inline;
    }
    .salary {
      font-size: 22px;
      font-weight: 400;
      font-family: ProximaNovaCond,Arial,sans-serif;
      padding: 0;
      margin-bottom: 25px;
    }
    .company-wrapper {
      margin-bottom: 25px;
    }
    .company-name {
      font-size: 22px;
      font-weight: 400;
      margin: 0 0 5px;
      padding: 0;
    }
    .vacancy-status {
      font-size: 22px;
      font-weight: 500;
      margin: 0 0 15px;
      padding: 0;
    }
    p {
      font-family: Arial,sans-serif;
    }
    .tag {
      display: inline-block;
      position: relative;
      flex-grow: 1;
      flex-shrink: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      box-sizing: border-box;
      padding: 0 11px;
      text-align: left;
      background-color: rgba(203,209,211,.3);
      color: #666;
      height: 30px;
      line-height: 28px;
      border: 1px solid transparent;
    }
    .company-trusted {
      border-color: #76777a;
      width: 20px;
      background-image: url(data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e);
    }
    .work-wrapper {
      margin-bottom: 25px;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      position: relative;
      line-height: 1.57;
      margin-bottom: 5px;
      margin-left: 20px;
    }
    ul>li:before {
      display: block;
      position: absolute;
      right: 100%;
      padding-right: 6px;
      content: '—';
    }
    .tags-wrapper {
      margin-bottom: 25px;
    }
    .vacancy, .tabs {
      padding: 20px 0;
    }
    .tabs-info {
      display: flex;
      flex-wrap: wrap;
    }
    .tabs-num {
      margin-right: 5px;
    }
    .tabs-num:last-child {
      margin-right: 0;
    }
    .tabs-wrapper {
      padding: 1rem 0;
    }
    .tab {
      box-shadow: 0 0 20px -5px #AAA;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 20px;
    }
    .tab-title {
      cursor: pointer;
      position: relative;
      padding: 0;
      padding-left: 15px;
      margin: 0;
    }
    p.tab-title:before {
      content: '';
      background: #848484;
      width: 5px;
      position: absolute;
      border-radius: 50px;
      height: 5px;
      left: 0;
      top: calc(50% - 3px);
      margin: 0;
    }
    .tab-type-recommend p.tab-title:before {
      background: #007bff;
    }
    .tab-type-fix p.tab-title:before {
      background: #de3d53;
    }
    .tab-type-analysis p.tab-title:before {
      background: #3ddec8;
    }
    .tab-descr {
      display: none;
      margin-top: 20px;
    }
    .showen .tab-descr {
      display: block;
    }
    .remark-for {
      /* box-shadow: 0px 15px 5px -5px #de3d53; */
      position: relative;
    }
    .remark-for:before {
      content: '';
      position: absolute;
      left: 0;
      bottom: -5px;
      width: 100%;
      height: 1px;
      background: #de3d53;
      box-shadow: 0 0 3px 2px #de3d53;
      border-radius: 10px;
      opacity: .5;
    }
  </style>
  <script>
    $(document).ready(function() {
      $('.tab .tab-title').on('click', function() {
        $(this).parent('.tab').toggleClass('showen');
      });
      const tabMark = {
        '1': {
          'key': 'description',
          searchText: 'Требования:'
        },
        '2': {
          'key': 'description',
          searchText: 'Условия:'
        },
        '3': {
          'key': 'description',
          searchText: 'Обязанности:'
        },
        '4': {
          'key': 'name'
        },
        '5': {
          'key': 'compensation',
        },
        '6': {
          'key': 'SHORT_DESCR'
        },
        '7': {
          'key': 'REGION',
        },
        '8': {
          'key': 'PROF'
        },
        '9': {
          'key': '@workSchedule'
        },
        '10': {
          'key': 'workExperience'
        },
        '11': {
          'key': 'employment'
        },
        '12': {
          'key': 'keySkills'
        }
      };
      const tabs = {{!json_tabs}};
      for (let i = 0, len = tabs.length; i < len; i++) {
        const {section} = tabs[i];
        const remarkType = tabMark[''+section];
        if(!remarkType.searchText) {
          const cands = document.getElementsByClassName(remarkType.key);
          cands.length && $(cands[0]).addClass('remark-for');
        } else {
          $(".description:contains('"+ remarkType.searchText +"')").html(function(_, html) {
            const regex = new RegExp(remarkType.searchText, 'g');
            return html.replace(regex, '<span class="remark-for">'+ remarkType.searchText +'</span>');
          });
        }
      }
    });
  </script>
</head>
<body>
  <div class="container">
    <div class="row">
      <div class="col-8 vacancy">
        <div class="title-wrapper">
          <div class="title">
            <h1>{{v['name']}}</h1>
          </div>
          <div class="salary compensation">
            % if v['compensation']['noCompensation']:
              з/п не указана
            % else: 
              % if v['compensation']['to']:
                от {{v['compensation']['from']}} до {{v['compensation']['to']}} руб.
              % else:
                {{v['compensation']['from']}} руб.
              % end
            % end
          </div>
        </div>
        <div class="company-wrapper">
          <div class="company-name name">
            {{v['company']['visibleName']}}
            % if v['company']['@trusted']:
              <span class="company-trusted">&#10004;</span>
            % end
          </div>
          <div class="company-address">
            % address = []
            % for k in ['city', 'street', 'building']:
              % address.append(v['address'][k])
            % end
            {{', '.join(address)}}
          </div>
        </div>
        <div class="vacancy-status-wrapper">
          <h2 class="vacancy-status">
            % if v['status']['archived']:
              Вакансия в архиве
            % end
          </h2>
        </div>
        <div class="info">
          <div class="work-wrapper">
            <div class="work-experience workExperience">
              Требуемый опыт работы: {{experience[v['workExperience']] if v['workExperience'] in experience else 'Не имеет значения '}}
            </div>
            <div class="work-shedule">
              <span class="@workSchedule employment">Требуемый опыт работы</span>: {{employment[v['employment']['@type']] if v['employment']['@type'] in employment else 'Не указано'}}, 
              {{work_schedule[v['@workSchedule']] if v['@workSchedule'] in work_schedule else 'Не указано'}}
            </div>
          </div>
          <div class="description">
            {{!v['description']}}
          </div>
          <div class="tags-wrapper">
            <h2 class="tags-header keySkills">Ключевые навыки</h2>
            % if 'keySkills' in v:
              <div class="tags-list">
                % for skill in v['keySkills']['keySkill']:
                  <span class="tag">{{skill}}</span>
                % end
              </div>
            % end
          </div>
        </div>
      </div>
      <div class="col-4 tabs">
        <div class="tabs-info">
          <span class="tabs-num">
            <span class="badge badge-pill badge-dark">
              {{len([t for t in vacancy['tabs'] if t['message_type'] == 'fix'])}}
            </span> Fixes
          </span>
          <span class="tabs-num">
            <span class="badge badge-pill badge-dark">
              {{len([t for t in vacancy['tabs'] if t['message_type'] == 'recommend'])}}
            </span> Recommendations
          </span>
          <span class="tabs-num">
            <span class="badge badge-pill badge-dark">
              {{len([t for t in vacancy['tabs'] if t['message_type'] == 'analysis'])}}
            </span> Analysis
          </span>
        </div>
        <div class="tabs-wrapper">
          % for t in vacancy['tabs']:
            <div class="tab tab-type-{{t['message_type']}}">
              <p class="tab-title">{{t['title']}}</p>
              <div class="tab-descr">
                {{!t['text']}}
              </div>
            </div>
          % end
        </div>
      </div>
    </div>
  </div>
</body>
</html>

