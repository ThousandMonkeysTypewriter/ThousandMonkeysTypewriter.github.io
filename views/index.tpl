<!DOCTYPE html>
<html>
<head>
  <title>Спиок вакансий HH.RU</title>
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
    .salary, .title {
      font-size: 18px;
      font-weight: 400;
      font-family: ProximaNovaCond,Arial,sans-serif;
      padding: 0;
    }
    .salary {
      margin-left: auto;
    }
    .vacancy-wrapper {
      border: 1px solid #f1c846;
      padding: 20px;
      position: relative;
      font-size: 14px;
      line-height: 1.571;
      margin-top: -1px;
    }
    .col {
      padding: 20px 0;
    }
    .company-name, .address {
      color: #999;
      font-size: 12px;
    }
    a {
      color: #09f;
    }
    a:hover {
      text-decoration: none;
      color: #c00;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="row">
      <div class="col">
        % for v in vv:
          % v = v['vacancyView']
          <div class="vacancy-wrapper">
            <div style="display: flex;">
              <div class="title">
                <a href="/{{v['vacancyId']}}">
                  {{v['name']}}
                </a>
              </div>
              <div class="salary">
                <span class="compensation">
                  % if v['compensation']['noCompensation']:
                    з/п не указана
                  % else: 
                    % if 'from' in v['compensation']:
                      от {{v['compensation']['from']}}
                    % end
                    % if 'to' in v['compensation']:
                      до {{v['compensation']['to']}} руб.
                    % end
                  % end
                </span>
              </div>
            </div>
            <div class="company-name name">
              {{v['company']['visibleName']}}
              % if v['company']['@trusted']:
                <span class="company-trusted">&#10004;</span>
              % end
            </div>
            <div class="address">
              % if 'name' in v['area']:
                {{v['area']['name']}}
              % end
            </div>
            <div class="description">
              {{v['description'][0:320]}}...
            </div>
          </div>
        % end
      </div>
    </div>
  </div>
</body>
</html>

