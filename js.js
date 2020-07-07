const vacancy = {
  "vacancyId": 34458392,
  "@vacancyCode": null,
  "type": "open",
  "name": "Программист 1С",
  "multi": false,
  "status": {
    "active": false,
    "archived": true,
    "disabled": false
  },
  "acceptTemporary": false,
  "publicationDate": "2019-12-04T11:29:26.637+03:00",
  "compensation": {
    "from": null,
    "to": null,
    "currencyCode": null,
    "gross": null,
    "noCompensation": true
  },
  "company": {
    "@trusted": true,
    "id": 2635090,
    "visibleName": "Валенсия Экспресс",
    "employerOrganizationFormId": 0,
    "department": null,
    "logos": {
      "@showInSearch": false,
      "logo": [
        {
          "@type": "ORIGINAL",
          "@url": "/employer-logo-original/718826.jpg"
        },
        {
          "@type": "searchResultsPage",
          "@url": "/employer-logo/3316412.jpeg"
        },
        {
          "@type": "small",
          "@url": "/employer-logo/3316412.jpeg"
        },
        {
          "@type": "employerPage",
          "@url": "/employer-logo/3316411.jpeg"
        },
        {
          "@type": "vacancyPage",
          "@url": "/employer-logo/3316413.jpeg"
        },
        {
          "@type": "medium",
          "@url": "/employer-logo/3316413.jpeg"
        }
      ]
    }
  },
  "area": {
    "name": "Москва",
    "@id": "1",
    "@regionId": "1",
    "@countryIsoCode": "RU",
    "regionName": "Москва",
    "areaNamePre": "Москве",
    "areaCatalogTitle": "в Москве"
  },
  "address": {
    "city": null,
    "street": null,
    "building": null,
    "mapData": null,
    "displayName": null,
    "rawAddress": null,
    "metroStations": null
  },
  "contactInfo": null,
  "validThroughTime": "2019-12-07T11:57:54.707+03:00",
  "hr-brand": null,
  "@workSchedule": "fullDay",
  "@acceptHandicapped": false,
  "@acceptKids": false,
  "insider": null,
  "workExperience": "between3And6",
  "employment": {
    "@type": "FULL"
  },
  "description": "&lt;p&gt;&lt;strong&gt;Торгово-производственная компания приглашет Специалиста для участия в разработке и внедрении комплексной автоматизированной системы на базе 1С ERP ( переход с 1С Предприятие 8.2 на 1С:ERP Управление предприятием 2)&lt;/strong&gt;&lt;/p&gt; &lt;p&gt;&lt;strong&gt;Блоки:&lt;/strong&gt;&lt;/p&gt; &lt;p&gt;- Базовая настройка системы и подготовка нормативно-справочной информации;&lt;/p&gt; &lt;p&gt;- Автоматизация бизнес-процессов движения ТМЦ (продажи, закупки, склад),&lt;/p&gt; &lt;p&gt;- Учет в производстве;&lt;/p&gt; &lt;p&gt;- Управление финансами;&lt;/p&gt; &lt;p&gt;- Управленческий учет затрат, себестоимости&lt;/p&gt; &lt;p&gt;- Кадровый учет и зарплата;&lt;/p&gt; &lt;p&gt;- Консультирование пользователей;&lt;/p&gt; &lt;p&gt;- Доработка и устранение ошибок (проблем), возникающих в ходе эксплуатации.&lt;/p&gt; &lt;p&gt;&lt;strong&gt;Требования:&lt;/strong&gt;&lt;/p&gt; &lt;p&gt;&lt;strong&gt;- &lt;/strong&gt;Опыт внедрения&lt;strong&gt; &lt;/strong&gt;&lt;strong&gt;1С:ERP Управление предприятием 2 &lt;/strong&gt;на предприятиях Торгово-производственной деятельности;&lt;/p&gt; &lt;p&gt;&lt;strong&gt;Условия:&lt;/strong&gt;&lt;/p&gt; &lt;p&gt;&lt;strong&gt;Уровень дохода - ориентируемся на ваши ожидания и профессиональный опыт&lt;/strong&gt;.&lt;/p&gt; &lt;p&gt;График: с 9.00-18.00, 5/2 или рассмотрим варианты сотрудничества (офис частично, основное время - удалённо). &lt;/p&gt; &lt;p&gt;Оформление по ТК РФ&lt;/p&gt;",
  "keySkills": {
    "keySkill": [
      "1С: Управление предприятием"
    ]
  },
  "driverLicenseTypes": null,
  "mapDisabled": false,
  "cianPlacemarks": {
    "enabled": true,
    "originalRequestId": "15916272753955c5902fd9f2c19689b8",
    "utmSource": "?utm_source=hhru&amp;utm_medium=cpc&amp;utm_campaign=b2c_rf_new_partner_rent_mix&amp;utm_term=map"
  },
  "showSignupForm": false,
  "specializations": {
    "profArea": [
      {
        "@id": "1",
        "trl": "Информационные технологии, интернет, телеком",
        "translit": "Informacionnye-tehnologii-Internet-Telekom",
        "specialization": [
          {
            "@id": "221",
            "trl": "Программирование, Разработка",
            "translit": "Programmirovanie-Razrabotka"
          },
          {
            "@id": "50",
            "trl": "Системы управления предприятием (ERP)",
            "translit": "Sistemy-upravlenija-predprijatiem-ERP"
          }
        ]
      }
    ]
  },
  "vacancy-constructor-template": null
};

function generateField(fType, name, f) {
  let res = {};
  if (['string', 'boolean', 'number'].includes(typeof (f)) || f === null) {
    if (fType === 'schema') {
      res = {
        title: name,
        type: typeof (f)
      };
    } else if (fType === 'options') {
      res = {
        label: name
      }
    }
  } else if (Array.isArray(f)) {
    if (fType === 'schema') {
      const subF = {};
      $.each(f, (i, f2) => {
        subF[name] = generateField(fType, name, f2);
      });

      res = {
        list: {
          type: 'array',
          items: {
            properties: subF
          }
        }
      }
    } else if (fType === 'options') {
      const subF = {};
      $.each(f, (i, f2) => {
        subF[name] = generateField(fType, name, f2);
      });

      res = {
        list: {
          type: 'array',
          label: name,
          items: {
            fields: subF
          }
        }
      }
    }
  } else if (typeof (f) === 'object' && f !== null) {
    const subF = {};
    $.each(Object.keys(f), (i, k) => {
      subF[k] = generateField(fType, k, f[k]);
    });

    if (fType === 'schema') {
      res = {
        items: {
          type: "object",
          properties: subF
        }
      }
    } else if (fType === 'options') {
      res = {
        label: name,
        fields: subF
      }
    }
  }
  return res;
}

function generateFormJson(dataVacancy) {
  const res = {
    data: [],
    schema: {
      type: "object",
      items: {
        type: "object",
        properties: {
          // fields as key
        }
      }
    },
    options: {
      label: "Поля для проверки",
      fields: {
        // fields as key
      }
    },
    data: {
      // same as vacancy with selected keys
    }
  };
  const fields = [
    'compensation',
    'employment',
    'area',
    'specializations',
    '@workSchedule',
    'workExperience',
    'keySkills',
    'description'
  ];
  $.each(fields, (i, fName) => {
    const f = dataVacancy[fName];
    if (!f)
      return true;

    res.data[fName] = f;
    res.schema.items.properties[fName] = generateField('schema', fName, f);
    res.options.fields[fName] = generateField('options', fName, f);

    /* if (typeof (f) == 'string') {
      res.options.fields[fName] = {
        label: fName
      };
    } else {
      const subF2 = {};
      $.each(Object.keys(f), (i, k) => {
        subF2[k] = {
          label: k
        };
      });
      res.options.fields[fName] = {
        label: fName,
        fields: subF2
      };
    } */
  });

  return res;
}

function showVacancy(data) {
  console.log(generateFormJson(data));
  $('body').append(generateFormJson(data));
  $('#vacancy-form').alpaca(
    generateFormJson(data)
  );
}

$(document).ready(() => {
  // showVacancy(vacancy);
  $('.html-res').html($('.language-html').text());
});