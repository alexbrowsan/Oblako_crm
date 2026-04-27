    (function () {
      var REQ_STATUS = {
        work: { label: 'В работе', cls: 'cat-dash__badge--work' },
        wait: { label: 'Ожидает', cls: 'cat-dash__badge--wait' },
        confirmed: { label: 'Заказ подтверждён', cls: 'cat-dash__badge--ok' }
      };

      /** «Все точки» в селекте торговой точки; пустое значение — режим «Сводка». */
      var CAT_FILTER_STORE_ALL = '__all__';

      function formatRub(n) {
        return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0₽';
      }

      function formatMetricsInt(n) {
        return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
      }

      function formatDashDataIssuedLine(d) {
        var months = [
          'января',
          'февраля',
          'марта',
          'апреля',
          'мая',
          'июня',
          'июля',
          'августа',
          'сентября',
          'октября',
          'ноября',
          'декабря'
        ];
        var day = d.getDate();
        var mon = months[d.getMonth()];
        var h = d.getHours();
        var m = d.getMinutes();
        var hh = h < 10 ? '0' + h : '' + h;
        var mm = m < 10 ? '0' + m : '' + m;
        return day + ' ' + mon + ', данные обновлялись в ' + hh + ':' + mm;
      }

      function renderCatDashboardDataStamp() {
        var line = formatDashDataIssuedLine(new Date());
        var metricsStamp = document.getElementById('catMetricsDataStamp');
        if (metricsStamp) metricsStamp.textContent = line;
      }

      var activeMonth = 'mar';

      var MONTH_META = {
        feb: { label: 'Февраль 2026' },
        mar: { label: 'Март 2026' },
        apr: { label: 'Апрель 2026' }
      };

      var PLAN_CATEGORIES = [
        'Жевательный табак',
        'Жидкости',
        'кальяны',
        'Испарители',
        'одноразовые эл. сигареты',
        'Уголь',
        'табак для кальяна'
      ];

      function vgList() {
        return (window.CRM_TT && window.CRM_TT.volgograd) ? window.CRM_TT.volgograd.slice() : [];
      }
      function mrmList() {
        return (window.CRM_TT && window.CRM_TT.murmansk) ? window.CRM_TT.murmansk.slice() : [];
      }
      function mergeStoreListsUnique(a, b) {
        if (window.CRM_TT && typeof window.CRM_TT.merge === 'function') {
          return window.CRM_TT.merge(a, b);
        }
        var seen = {};
        var out = [];
        a.concat(b).forEach(function (s) {
          if (!seen[s]) {
            seen[s] = true;
            out.push(s);
          }
        });
        return out;
      }

      function crmRoleNormalized() {
        try {
          var r = sessionStorage.getItem('crm_role') || '';
          if (r === 'category') return 'category_lead';
          return r;
        } catch (e) {
          return '';
        }
      }

      function crmManagedCategory() {
        try {
          return sessionStorage.getItem('crm_managed_category') || '';
        } catch (e2) {
          return '';
        }
      }

      /** Совпадает с тем, что пишется при входе «Категорийный менеджер» в index.html */
      var CRM_PROTOTYPE_MANAGED_CATEGORY = 'Жевательный табак';

      function applyTopbarPersona() {
        var el = document.getElementById('categoryManagerName') || document.getElementById('managerName');
        if (!el) return;
        if (crmRoleNormalized() === 'category_manager') {
          var cat = crmManagedCategory() || CRM_PROTOTYPE_MANAGED_CATEGORY;
          var who = sessionStorage.getItem('crm_login') || 'Категорийный менеджер';
          el.textContent = who + ' · ' + cat;
        } else if (el.id === 'managerName') {
          var mLogin = sessionStorage.getItem('crm_login');
          if (mLogin) el.textContent = mLogin;
        } else {
          el.textContent = 'Алина Геранина';
        }
      }

      function applyCategoryManagerScope() {
        if (crmRoleNormalized() !== 'category_manager') return;
        var mc = crmManagedCategory() || CRM_PROTOTYPE_MANAGED_CATEGORY;
        if (PLAN_CATEGORIES.indexOf(mc) === -1) return;
        var catSel = document.getElementById('catFilterCategory');
        if (!catSel) return;
        catSel.value = mc;
        catSel.disabled = true;
        catSel.title = 'Доступ только к категории «' + mc + '»';
      }

      function planSeedHash(monthKey, store, category) {
        var s = monthKey + '|' + store + '|' + category;
        var h = 2166136261;
        for (var i = 0; i < s.length; i++) {
          h ^= s.charCodeAt(i);
          h = Math.imul(h, 16777619);
        }
        return h >>> 0;
      }

      function rndU01(seed) {
        var x = seed ^ (seed << 13);
        x ^= x >>> 17;
        x ^= x << 5;
        return (x >>> 0) / 4294967296;
      }

      var BUDGET_BY_MONTH = {
        feb: {
          rows: [
            { category: 'одноразовые эл. сигареты', budget: 1850000, spent: 1380000, left: 470000, debt: 335000 },
            { category: 'Жевательный табак', budget: 3200000, spent: 2750000, left: 450000, debt: 560000 },
            { category: 'Жидкости', budget: 1500000, spent: 980000, left: 520000, debt: 140000 }
          ],
          summary: [
            { label: 'Общий бюджет', value: 6550000 },
            { label: 'Потрачено', value: 5110000 },
            { label: 'Остаток', value: 1440000 },
            { label: 'Всего дебиторки', value: 1035000 }
          ],
        },
        mar: {
          rows: [
            { category: 'одноразовые эл. сигареты', budget: 2000000, spent: 1420000, left: 580000, debt: 310000 },
            { category: 'Жевательный табак', budget: 3400000, spent: 2900000, left: 500000, debt: 540000 },
            { category: 'Жидкости', budget: 1600000, spent: 1050000, left: 550000, debt: 120000 }
          ],
          summary: [
            { label: 'Общий бюджет', value: 7000000 },
            { label: 'Потрачено', value: 5370000 },
            { label: 'Остаток', value: 1630000 },
            { label: 'Всего дебиторки', value: 970000 }
          ],
        },
        apr: {
          rows: [
            { category: 'одноразовые эл. сигареты', budget: 2100000, spent: 1480000, left: 620000, debt: 280000 },
            { category: 'Жевательный табак', budget: 3500000, spent: 2980000, left: 520000, debt: 510000 },
            { category: 'Жидкости', budget: 1650000, spent: 1080000, left: 570000, debt: 105000 }
          ],
          summary: [
            { label: 'Общий бюджет', value: 7250000 },
            { label: 'Потрачено', value: 5540000 },
            { label: 'Остаток', value: 1710000 },
            { label: 'Всего дебиторки', value: 895000 }
          ],
        }
      };

      var REQUEST_BY_MONTH = {
        feb: [
          { id: '#201', store: 'Волгоград, Рабоче-Крестьянская 2/2', title: 'Табак Must Have', from: 'управляющий', status: 'confirmed', assignee: 'закупки' },
          { id: '#202', store: 'Волгоград Волжский Ленина', title: 'Вейпы HQD', from: 'продавец', status: 'wait', assignee: 'склад' },
          { id: '#203', store: 'Волгоград, Рокоссовского 107', title: 'Жидкость 30 ml', from: 'управляющий', status: 'work', assignee: 'категорийный менеджер' },
          { id: '#204', store: 'Волгоград, Шумского', title: 'Уголь', from: 'управляющий', status: 'work', assignee: 'категорийный менеджер' }
        ],
        mar: [
          { id: '#241', store: 'Волгоград Волжский Ленина', title: 'HQD 1200 Blueberry', from: 'управляющий', status: 'work', assignee: 'категорийный менеджер' },
          { id: '#242', store: 'Волгоград 30 лет победы', title: 'Табак Darkside Core', from: 'управляющий', status: 'wait', assignee: 'склад' },
          { id: '#243', store: 'Волгоград Ленина', title: 'Одноразки Lost Mary', from: 'продавец', status: 'work', assignee: 'категорийный менеджер' },
          { id: '#244', store: 'Волгоград, Шумского', title: 'Уголь кокосовый', from: 'управляющий', status: 'confirmed', assignee: 'закупки' },
          { id: '#245', store: 'Волгоград Кастерина', title: 'ELF BAR 1500', from: 'управляющий', status: 'wait', assignee: 'склад' },
          { id: '#246', store: 'Волгоград Волжский Ленина', title: 'Уголь для кальяна 1кг', from: 'продавец', status: 'work', assignee: 'категорийный менеджер' }
        ],
        apr: [
          { id: '#301', store: 'Волгоград, Рабоче-Крестьянская 2/2', title: 'Вейпы новая линейка', from: 'управляющий', status: 'work', assignee: 'категорийный менеджер' },
          { id: '#302', store: 'Волгоград Волжский Ленина', title: 'Табак Spectrum', from: 'продавец', status: 'wait', assignee: 'склад' },
          { id: '#303', store: 'Волгоград Кастерина', title: 'Снеки премиум', from: 'управляющий', status: 'work', assignee: 'категорийный менеджер' },
          { id: '#304', store: 'Волгоград, Рокоссовского 107', title: 'Жидкости ICE', from: 'продавец', status: 'confirmed', assignee: 'закупки' },
          { id: '#305', store: 'Волгоград, Шумского', title: 'Кальянные чаши', from: 'управляющий', status: 'wait', assignee: 'склад' }
        ]
      };

      var MURMANSK_REQUEST_BY_MONTH = {
        feb: [
          { id: '#M201', store: 'Апатиты Ферсмана 28', title: 'Поставка жидкостей 30 ml', from: 'управляющий', status: 'work', assignee: 'категорийный менеджер' },
          { id: '#M202', store: 'Кандалакша, Пронина 7А', title: 'Уголь кокосовый 1 кг', from: 'продавец', status: 'wait', assignee: 'склад' },
          { id: '#M203', store: 'Апатиты, Ленина 10', title: 'Одноразки — новая линейка', from: 'управляющий', status: 'confirmed', assignee: 'закупки' }
        ],
        mar: [
          { id: '#M241', store: 'Апатиты, Козлова 10', title: 'Табак для кальяна', from: 'управляющий', status: 'work', assignee: 'категорийный менеджер' },
          { id: '#M242', store: 'Кировск, Кондрикова 1', title: 'Вейпы HQD', from: 'продавец', status: 'wait', assignee: 'склад' },
          { id: '#M243', store: 'Апатиты, Сидоренко 1', title: 'Испарители — возврат брака', from: 'управляющий', status: 'work', assignee: 'категорийный менеджер' }
        ],
        apr: [
          { id: '#M301', store: 'Апатиты, Бредова 26А', title: 'Жидкости ICE', from: 'продавец', status: 'confirmed', assignee: 'закупки' },
          { id: '#M302', store: 'Апатиты, Козлова 10 (Smog Shop)', title: 'Кальянные чаши', from: 'управляющий', status: 'wait', assignee: 'склад' }
        ]
      };

      function fillSelectFromList(selectId, values, allLabel) {
        var sel = document.getElementById(selectId);
        if (!sel) return;
        sel.innerHTML = '';
        var o0 = document.createElement('option');
        o0.value = '';
        o0.textContent = allLabel;
        sel.appendChild(o0);
        values.forEach(function (v) {
          var o = document.createElement('option');
          o.value = v;
          o.textContent = v;
          sel.appendChild(o);
        });
      }

      function planRowDimensionLists() {
        return {
          categories: PLAN_CATEGORIES.slice(),
          stores: vgList()
        };
      }

      function volgogradStoreSet() {
        var o = {};
        vgList().forEach(function (s) {
          o[s] = true;
        });
        return o;
      }

      function murmanskStoreSet() {
        var o = {};
        mrmList().forEach(function (s) {
          o[s] = true;
        });
        return o;
      }

      function storesForRegionDropdown(regionValue) {
        if (regionValue === 'volgograd') return vgList();
        if (regionValue === 'murmansk') return mrmList();
        return mergeStoreListsUnique(vgList(), mrmList());
      }

      function updateStoreSelectOptions() {
        var reg = document.getElementById('catFilterRegion');
        var rv = reg ? reg.value : '';
        var stores = storesForRegionDropdown(rv);
        var sel = document.getElementById('catFilterStore');
        if (!sel) return;
        var prev = sel.value;
        sel.innerHTML = '';
        var oAll = document.createElement('option');
        oAll.value = CAT_FILTER_STORE_ALL;
        oAll.textContent = 'Все точки';
        sel.appendChild(oAll);
        stores.forEach(function (v) {
          var o = document.createElement('option');
          o.value = v;
          o.textContent = v;
          sel.appendChild(o);
        });
        if (prev === CAT_FILTER_STORE_ALL || prev === '' || stores.indexOf(prev) === -1) {
          sel.value = CAT_FILTER_STORE_ALL;
        } else {
          sel.value = prev;
        }
      }

      function metricsCategoryLabel() {
        if (crmRoleNormalized() === 'category_manager') {
          return crmManagedCategory() || CRM_PROTOTYPE_MANAGED_CATEGORY;
        }
        var catEl = document.getElementById('catFilterCategory');
        if (catEl && catEl.value) return catEl.value;
        return 'Все категории';
      }

      /** Упрощённые KPI+таблица (как у руководителя по категориям) — только для дашборда управляющего. Роли Алины и категорийного менеджера смотрят полный дашборд со всеми категориями. */
      function isCategoryLeadMetrics() {
        return crmRoleNormalized() === 'manager';
      }

      function metricsExecPct(plan, fact) {
        if (!plan || plan <= 0) return 0;
        return Math.round((fact / plan) * 100);
      }

      function metricsPctCellClass(pct) {
        if (pct >= 100) return 'cat-dash__metrics-cell--pct-good';
        return 'cat-dash__metrics-cell--pct-bad';
      }

      function metricsRevFactCellHtml(r) {
        if (r.isTotal) {
          return '<td>' + formatMetricsInt(r.revFact) + '</td>';
        }
        return (
          '<td class="cat-dash__metrics-rev-fact-cell">' +
          '<button type="button" class="cat-dash__metrics-rev-btn" data-store="' +
          encodeURIComponent(r.store) +
          '" title="Детализация выручки по точке">' +
          formatMetricsInt(r.revFact) +
          '</button>' +
          '</td>'
        );
      }

      function closeMetricsDrilldown() {
        var main = document.getElementById('catMetricsMainBlock');
        var drill = document.getElementById('catMetricsDrilldown');
        if (main) main.hidden = false;
        if (drill) drill.hidden = true;
      }

      function cmMetricsTheadRowHtml(firstColTitle) {
        return (
          '<tr>' +
          '<th>' +
          firstColTitle +
          '</th>' +
          '<th>Выручка<br />план</th>' +
          '<th>Выручка<br />факт</th>' +
          '<th>Маржинальность<br />план</th>' +
          '<th>Маржинальность<br />факт</th>' +
          '<th>Валовая прибыль<br />план</th>' +
          '<th>Валовая прибыль<br />факт</th>' +
          '<th>Неликвид<br />30–120 план</th>' +
          '<th>Неликвид<br />30–120 факт</th>' +
          '<th>Неликвид<br />120+ план</th>' +
          '<th>Неликвид<br />120+ факт</th>' +
          '<th>Товарные запасы<br />ликвидные план</th>' +
          '<th>Товарные запасы<br />ликвидные факт</th>' +
          '<th>Доступность товара<br />НЕА</th>' +
          '<th>Доступность<br />товара</th>' +
          '</tr>'
        );
      }

      function htmlCmMetricsDataRow(r, firstCellLabel, revFactAsButton) {
        var trCls = r.isTotal ? ' class="cat-dash__metrics-row-total"' : '';
        var revTd =
          revFactAsButton && !r.isTotal ? metricsRevFactCellHtml(r) : '<td>' + formatMetricsInt(r.revFact) + '</td>';
        return (
          '<tr' +
          trCls +
          '>' +
          '<td class="cat-dash__td-strong">' +
          firstCellLabel +
          '</td>' +
          '<td>' +
          formatMetricsInt(r.revPlan) +
          '</td>' +
          revTd +
          '<td>' +
          r.marginPlan +
          '%</td>' +
          '<td>' +
          r.marginFact +
          '%</td>' +
          '<td>' +
          formatMetricsInt(r.grossPlan) +
          '</td>' +
          '<td>' +
          formatMetricsInt(r.grossFact) +
          '</td>' +
          '<td>' +
          formatMetricsInt(r.illiquid30120Plan) +
          '</td>' +
          '<td>' +
          formatMetricsInt(r.illiquid30120Fact) +
          '</td>' +
          '<td>' +
          formatMetricsInt(r.illiquid120PlusPlan) +
          '</td>' +
          '<td>' +
          formatMetricsInt(r.illiquid120PlusFact) +
          '</td>' +
          '<td>' +
          formatMetricsInt(r.liquidStockPlan) +
          '</td>' +
          '<td>' +
          formatMetricsInt(r.liquidStockFact) +
          '</td>' +
          '<td>' +
          r.availNea +
          '%</td>' +
          '<td>' +
          r.availProduct +
          '%</td>' +
          '</tr>'
        );
      }

      function metricsDrilldownCategoryList() {
        if (crmRoleNormalized() === 'category_manager') {
          return [crmManagedCategory() || CRM_PROTOTYPE_MANAGED_CATEGORY];
        }
        return PLAN_CATEGORIES.slice();
      }

      function buildDrillCategoryRowsForStore(store) {
        var cats = metricsDrilldownCategoryList();
        return cats.map(function (cat) {
          var i = PLAN_CATEGORIES.indexOf(cat);
          if (i === -1) i = 0;
          return buildMetricsDataRow(activeMonth, store, i, cat);
        });
      }

      function renderRevDrillTable(store) {
        var thead = document.getElementById('catMetricsDrillThead');
        var tbody = document.getElementById('catMetricsDrillBody');
        if (thead) thead.innerHTML = cmMetricsTheadRowHtml('Категория');
        if (!tbody) return;
        var labelCats = metricsDrilldownCategoryList();
        var dataRows = buildDrillCategoryRowsForStore(store);
        var total = aggregateCmMetricsTotal(dataRows);
        var parts = dataRows.map(function (r, i) {
          return htmlCmMetricsDataRow(r, labelCats[i], false);
        });
        if (total && dataRows.length > 1) {
          parts.push(htmlCmMetricsDataRow(total, 'Итого', false));
        }
        tbody.innerHTML = parts.join('');
      }

      function openMetricsRevDrilldown(store) {
        var main = document.getElementById('catMetricsMainBlock');
        var drill = document.getElementById('catMetricsDrilldown');
        var title = document.getElementById('catMetricsDrillTitle');
        if (title) title.textContent = 'Выручка факт · ' + store;
        renderRevDrillTable(store);
        if (main) main.hidden = true;
        if (drill) {
          drill.hidden = false;
          if (drill.scrollIntoView) {
            try {
              drill.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } catch (e) {
              drill.scrollIntoView(true);
            }
          }
        }
      }

      function initMetricsRevDrillUi() {
        var tbody = document.getElementById('catMetricsTableBody');
        if (tbody && !tbody.dataset.revDrillBound) {
          tbody.dataset.revDrillBound = '1';
          tbody.addEventListener('click', function (e) {
            var btn = e.target.closest('.cat-dash__metrics-rev-btn');
            if (!btn) return;
            var enc = btn.getAttribute('data-store');
            if (!enc) return;
            try {
              openMetricsRevDrilldown(decodeURIComponent(enc));
            } catch (e2) {
              return;
            }
          });
        }
        var back = document.getElementById('catMetricsDrillBack');
        if (back && !back.dataset.bound) {
          back.dataset.bound = '1';
          back.addEventListener('click', closeMetricsDrilldown);
        }
      }

      function renderMetricsThead(isLead) {
        var thead = document.getElementById('catMetricsThead');
        if (!thead) return;
        if (isLead) {
          thead.innerHTML =
            '<tr>' +
            '<th>Магазин</th>' +
            '<th>Выручка<br />план</th>' +
            '<th>Выручка<br />факт</th>' +
            '<th>% выполнения</th>' +
            '<th>Валовая прибыль<br />план</th>' +
            '<th>Валовая прибыль<br />факт</th>' +
            '<th>% выполнения</th>' +
            '<th>Доступность товара<br />план</th>' +
            '<th>Доступность товара<br />факт</th>' +
            '<th>% выполнения</th>' +
            '<th>Индекс продавцов<br />план</th>' +
            '<th>Индекс продавцов<br />факт</th>' +
            '<th>% выполнения</th>' +
            '</tr>';
        } else {
          thead.innerHTML = cmMetricsTheadRowHtml('Магазин');
        }
      }

      function buildMetricsDataRow(monthKey, store, idx, category) {
        var h0 = planSeedHash(monthKey, store, 'metrics:' + category + ':' + idx);
        var r = rndU01(h0);
        var revPlan = 800000 + Math.floor(r * 900000) + idx * 12000;
        revPlan = Math.round(revPlan / 1000) * 1000;
        var revFact = Math.round(revPlan * (0.5 + rndU01(h0 + 1) * 0.65) / 1000) * 1000;

        var grossPlan = Math.round(revPlan * 0.42 / 1000) * 1000;
        var grossFact = Math.round(revFact * (0.45 + rndU01(h0 + 2) * 0.2) / 1000) * 1000;

        var marginPlan = 44;
        var marginFact = 40 + Math.floor(rndU01(h0 + 3) * 45);
        var illiquid30120Fact = 12000 + Math.floor(rndU01(h0 + 10) * 155000);
        illiquid30120Fact = Math.round(illiquid30120Fact / 1000) * 1000;
        var illiquid30120Plan = Math.round(
          illiquid30120Fact * (1.08 + rndU01(h0 + 4) * 0.32) / 1000
        ) * 1000;
        var illiquid120PlusFact = Math.floor(rndU01(h0 + 7) * 180000);
        illiquid120PlusFact = Math.round(illiquid120PlusFact / 1000) * 1000;
        var illiquid120PlusPlan = Math.round(
          illiquid120PlusFact * (1.1 + rndU01(h0 + 5) * 0.28) / 1000
        ) * 1000;
        var liquidStockPlan = 320000 + Math.floor(rndU01(h0 + 8) * 720000);
        liquidStockPlan = Math.round(liquidStockPlan / 1000) * 1000;
        var liquidStockFact = Math.round(liquidStockPlan * (0.86 + rndU01(h0 + 9) * 0.18) / 1000) * 1000;
        var availNea = 68 + Math.floor(rndU01(h0 + 11) * 28);
        var availProduct = 74 + Math.floor(rndU01(h0 + 12) * 24);

        return {
          store: store,
          revPlan: revPlan,
          revFact: revFact,
          grossPlan: grossPlan,
          grossFact: grossFact,
          marginPlan: marginPlan,
          marginFact: marginFact,
          illiquid30120Plan: illiquid30120Plan,
          illiquid30120Fact: illiquid30120Fact,
          illiquid120PlusPlan: illiquid120PlusPlan,
          illiquid120PlusFact: illiquid120PlusFact,
          liquidStockPlan: liquidStockPlan,
          liquidStockFact: liquidStockFact,
          availNea: availNea,
          availProduct: availProduct
        };
      }

      function buildLeadMetricsDataRow(monthKey, store, idx, category) {
        var h0 = planSeedHash(monthKey, store, 'lead-met:' + category + ':' + idx);
        var revPlan = 800000 + Math.floor(rndU01(h0) * 900000) + idx * 12000;
        revPlan = Math.round(revPlan / 1000) * 1000;
        var revFact = Math.round(revPlan * (0.82 + rndU01(h0 + 1) * 0.22) / 1000) * 1000;
        var grossPlan = Math.round(revPlan * 0.36 / 1000) * 1000;
        var grossFact = Math.round(grossPlan * (0.78 + rndU01(h0 + 2) * 0.28) / 1000) * 1000;
        var availPlan = 88 + Math.floor(rndU01(h0 + 3) * 11);
        var availFact = Math.max(72, Math.min(99, availPlan - Math.floor(rndU01(h0 + 4) * 15)));
        var sellPlan = 92 + Math.floor(rndU01(h0 + 5) * 18);
        var sellFact = Math.max(75, Math.min(115, sellPlan - Math.floor(rndU01(h0 + 6) * 20)));
        return {
          store: store,
          revPlan: revPlan,
          revFact: revFact,
          grossPlan: grossPlan,
          grossFact: grossFact,
          availPlan: availPlan,
          availFact: availFact,
          sellPlan: sellPlan,
          sellFact: sellFact
        };
      }

      function aggregateCmMetricsTotal(rows) {
        if (!rows.length) return null;
        var revPlan = 0;
        var revFact = 0;
        var grossPlan = 0;
        var grossFact = 0;
        var marginSum = 0;
        var illMid120PlanSum = 0;
        var illMid120FactSum = 0;
        var ill120PlusPlanSum = 0;
        var ill120PlusFactSum = 0;
        var liquidPlanSum = 0;
        var liquidFactSum = 0;
        var availNeaSum = 0;
        var availProductSum = 0;
        rows.forEach(function (r) {
          revPlan += r.revPlan;
          revFact += r.revFact;
          grossPlan += r.grossPlan;
          grossFact += r.grossFact;
          marginSum += r.marginFact;
          illMid120PlanSum += r.illiquid30120Plan;
          illMid120FactSum += r.illiquid30120Fact;
          ill120PlusPlanSum += r.illiquid120PlusPlan;
          ill120PlusFactSum += r.illiquid120PlusFact;
          liquidPlanSum += r.liquidStockPlan;
          liquidFactSum += r.liquidStockFact;
          availNeaSum += r.availNea;
          availProductSum += r.availProduct;
        });
        var n = rows.length;
        return {
          store: 'Итого',
          revPlan: revPlan,
          revFact: revFact,
          grossPlan: grossPlan,
          grossFact: grossFact,
          marginPlan: 44,
          marginFact: Math.round(marginSum / n),
          illiquid30120Plan: illMid120PlanSum,
          illiquid30120Fact: illMid120FactSum,
          illiquid120PlusPlan: ill120PlusPlanSum,
          illiquid120PlusFact: ill120PlusFactSum,
          liquidStockPlan: liquidPlanSum,
          liquidStockFact: liquidFactSum,
          availNea: Math.round(availNeaSum / n),
          availProduct: Math.round(availProductSum / n),
          isTotal: true
        };
      }

      function aggregateLeadMetricsTotal(rows) {
        if (!rows.length) return null;
        var revPlan = 0;
        var revFact = 0;
        var grossPlan = 0;
        var grossFact = 0;
        var availPlanSum = 0;
        var availFactSum = 0;
        var sellPlanSum = 0;
        var sellFactSum = 0;
        rows.forEach(function (r) {
          revPlan += r.revPlan;
          revFact += r.revFact;
          grossPlan += r.grossPlan;
          grossFact += r.grossFact;
          availPlanSum += r.availPlan;
          availFactSum += r.availFact;
          sellPlanSum += r.sellPlan;
          sellFactSum += r.sellFact;
        });
        var n = rows.length;
        return {
          store: 'Итого',
          revPlan: revPlan,
          revFact: revFact,
          grossPlan: grossPlan,
          grossFact: grossFact,
          availPlan: Math.round(availPlanSum / n),
          availFact: Math.round(availFactSum / n),
          sellPlan: Math.round(sellPlanSum / n),
          sellFact: Math.round(sellFactSum / n),
          isTotal: true
        };
      }

      function getMetricsStoresForRegionOnly() {
        var regEl = document.getElementById('catFilterRegion');
        var rv = regEl ? regEl.value : '';
        if (rv === 'murmansk') return mrmList();
        if (rv === 'volgograd') return vgList();
        return mergeStoreListsUnique(vgList(), mrmList());
      }

      function getMetricsDetailStores() {
        var stores = getMetricsStoresForRegionOnly();
        var storeF = document.getElementById('catFilterStore');
        if (!storeF || !storeF.value || storeF.value === CAT_FILTER_STORE_ALL) return stores;
        return stores.filter(function (s) { return s === storeF.value; });
      }

      function buildMetricsRowsForStores(stores) {
        var cat = metricsCategoryLabel();
        if (isCategoryLeadMetrics()) {
          return stores.map(function (s, i) {
            return buildLeadMetricsDataRow(activeMonth, s, i, cat);
          });
        }
        return stores.map(function (s, i) {
          return buildMetricsDataRow(activeMonth, s, i, cat);
        });
      }

      function leadKpiCardHtml(title, planHtml, factHtml, pct) {
        var pctCls = metricsPctCellClass(pct);
        return (
          '<article class="cat-dash__lead-kpi-card" role="listitem">' +
          '<h4 class="cat-dash__lead-kpi-card__title">' +
          title +
          '</h4>' +
          '<ul class="cat-dash__lead-kpi-card__stats">' +
          '<li><span class="muted">План</span> ' +
          planHtml +
          '</li>' +
          '<li><span class="muted">Факт</span> ' +
          factHtml +
          '</li>' +
          '<li><span class="muted">% выполнения</span> ' +
          '<span class="cat-dash__lead-kpi-pct ' +
          pctCls +
          '">' +
          pct +
          '%</span></li>' +
          '</ul>' +
          '</article>'
        );
      }

      function renderLeadMetricsKpiBlocks(agg) {
        var el = document.getElementById('catMetricsSummaryKpis');
        if (!el) return;
        if (!isCategoryLeadMetrics()) {
          el.hidden = true;
          el.innerHTML = '';
          return;
        }
        if (!agg) {
          el.hidden = true;
          el.innerHTML = '';
          return;
        }
        var pRev = metricsExecPct(agg.revPlan, agg.revFact);
        var pGr = metricsExecPct(agg.grossPlan, agg.grossFact);
        var pAv = metricsExecPct(agg.availPlan, agg.availFact);
        var pSl = metricsExecPct(agg.sellPlan, agg.sellFact);
        el.hidden = false;
        el.innerHTML =
          '<div class="cat-dash__lead-kpi-grid" role="list">' +
          leadKpiCardHtml(
            'Выручка',
            formatMetricsInt(agg.revPlan) + '\u00a0₽',
            formatMetricsInt(agg.revFact) + '\u00a0₽',
            pRev
          ) +
          leadKpiCardHtml(
            'Валовая прибыль',
            formatMetricsInt(agg.grossPlan) + '\u00a0₽',
            formatMetricsInt(agg.grossFact) + '\u00a0₽',
            pGr
          ) +
          leadKpiCardHtml(
            'Доступность товара',
            agg.availPlan + '%',
            agg.availFact + '%',
            pAv
          ) +
          leadKpiCardHtml(
            'Индекс продавцов',
            agg.sellPlan + '%',
            agg.sellFact + '%',
            pSl
          ) +
          '</div>';
      }

      function renderCmMetricsKpiBlocks(agg) {
        var el = document.getElementById('catMetricsSummaryKpis');
        if (!el) return;
        if (isCategoryLeadMetrics()) {
          el.hidden = true;
          el.innerHTML = '';
          return;
        }
        if (!agg) {
          el.hidden = true;
          el.innerHTML = '';
          return;
        }
        var pRev = metricsExecPct(agg.revPlan, agg.revFact);
        var pMargin = metricsExecPct(agg.marginPlan, agg.marginFact);
        var pGr = metricsExecPct(agg.grossPlan, agg.grossFact);
        var pIll30120 = metricsExecPct(agg.illiquid30120Plan, agg.illiquid30120Fact);
        var pIll120P = metricsExecPct(agg.illiquid120PlusPlan, agg.illiquid120PlusFact);
        var pLiqStock = metricsExecPct(agg.liquidStockPlan, agg.liquidStockFact);
        el.hidden = false;
        el.innerHTML =
          '<div class="cat-dash__lead-kpi-grid" role="list">' +
          leadKpiCardHtml(
            'Выручка',
            formatMetricsInt(agg.revPlan) + '\u00a0₽',
            formatMetricsInt(agg.revFact) + '\u00a0₽',
            pRev
          ) +
          leadKpiCardHtml(
            'Маржинальность',
            agg.marginPlan + '%',
            agg.marginFact + '%',
            pMargin
          ) +
          leadKpiCardHtml(
            'Валовая прибыль',
            formatMetricsInt(agg.grossPlan) + '\u00a0₽',
            formatMetricsInt(agg.grossFact) + '\u00a0₽',
            pGr
          ) +
          leadKpiCardHtml(
            'Неликвид 30–120',
            formatMetricsInt(agg.illiquid30120Plan) + '\u00a0₽',
            formatMetricsInt(agg.illiquid30120Fact) + '\u00a0₽',
            pIll30120
          ) +
          leadKpiCardHtml(
            'Неликвид 120+',
            formatMetricsInt(agg.illiquid120PlusPlan) + '\u00a0₽',
            formatMetricsInt(agg.illiquid120PlusFact) + '\u00a0₽',
            pIll120P
          ) +
          leadKpiCardHtml(
            'Товарные запасы ликвидные',
            formatMetricsInt(agg.liquidStockPlan) + '\u00a0₽',
            formatMetricsInt(agg.liquidStockFact) + '\u00a0₽',
            pLiqStock
          ) +
          '</div>';
      }

      function renderMetricsTable() {
        closeMetricsDrilldown();
        var tbody = document.getElementById('catMetricsTableBody');
        if (!tbody) return;
        var isLead = isCategoryLeadMetrics();
        renderMetricsThead(isLead);
        var kpiRows = buildMetricsRowsForStores(getMetricsDetailStores());
        if (isLead) {
          renderCmMetricsKpiBlocks(null);
          renderLeadMetricsKpiBlocks(aggregateLeadMetricsTotal(kpiRows));
        } else {
          renderLeadMetricsKpiBlocks(null);
          renderCmMetricsKpiBlocks(aggregateCmMetricsTotal(kpiRows));
        }
        var kpiSec = document.getElementById('catMetricsKpiSection');
        var kpiSum = document.getElementById('catMetricsSummaryKpis');
        if (kpiSec && kpiSum) {
          kpiSec.hidden = kpiSum.hidden;
        }

        var dataRows = kpiRows;
        var total = isLead ? aggregateLeadMetricsTotal(dataRows) : aggregateCmMetricsTotal(dataRows);
        var allRows =
          total && dataRows.length > 1 ? dataRows.concat([total]) : dataRows;
        if (isLead) {
          tbody.innerHTML = allRows
            .map(function (r) {
              var trCls = r.isTotal ? ' class="cat-dash__metrics-row-total"' : '';
              var pRev = metricsExecPct(r.revPlan, r.revFact);
              var pGr = metricsExecPct(r.grossPlan, r.grossFact);
              var pAv = metricsExecPct(r.availPlan, r.availFact);
              var pSl = metricsExecPct(r.sellPlan, r.sellFact);
              return (
                '<tr' +
                trCls +
                '>' +
                '<td class="cat-dash__td-strong">' +
                r.store +
                '</td>' +
                '<td>' +
                formatMetricsInt(r.revPlan) +
                '</td>' +
                metricsRevFactCellHtml(r) +
                '<td class="' +
                metricsPctCellClass(pRev) +
                '">' +
                pRev +
                '%</td>' +
                '<td>' +
                formatMetricsInt(r.grossPlan) +
                '</td>' +
                '<td>' +
                formatMetricsInt(r.grossFact) +
                '</td>' +
                '<td class="' +
                metricsPctCellClass(pGr) +
                '">' +
                pGr +
                '%</td>' +
                '<td>' +
                r.availPlan +
                '%</td>' +
                '<td>' +
                r.availFact +
                '%</td>' +
                '<td class="' +
                metricsPctCellClass(pAv) +
                '">' +
                pAv +
                '%</td>' +
                '<td>' +
                r.sellPlan +
                '%</td>' +
                '<td>' +
                r.sellFact +
                '%</td>' +
                '<td class="' +
                metricsPctCellClass(pSl) +
                '">' +
                pSl +
                '%</td>' +
                '</tr>'
              );
            })
            .join('');
        } else {
          tbody.innerHTML = allRows
            .map(function (r) {
              return htmlCmMetricsDataRow(r, r.store, true);
            })
            .join('');
        }
      }

      function refreshFilteredPanels() {
        renderCatDashboard();
        renderMetricsTable();
        if (document.getElementById('catBudgetRows')) {
          renderBudgets();
          renderRequests();
        }
      }

      function initFilterBar() {
        var lists = planRowDimensionLists();
        fillSelectFromList('catFilterCategory', lists.categories, 'Все категории');
        updateStoreSelectOptions();
        var monthSel = document.getElementById('catFilterMonth');
        if (monthSel) {
          monthSel.value = activeMonth;
          monthSel.addEventListener('change', function () {
            activeMonth = monthSel.value;
            refreshFilteredPanels();
          });
        }
        ['catFilterCategory', 'catFilterStore', 'catFilterPeriod'].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.addEventListener('change', refreshFilteredPanels);
        });
        var regEl = document.getElementById('catFilterRegion');
        if (regEl) {
          regEl.addEventListener('change', function () {
            updateStoreSelectOptions();
            refreshFilteredPanels();
          });
        }
        applyCategoryManagerScope();
      }

      function renderCatDashboard() {
        renderCatDashboardDataStamp();
      }

      function renderBudgets() {
        var bd = BUDGET_BY_MONTH[activeMonth];
        var rowsEl = document.getElementById('catBudgetRows');
        var sumEl = document.getElementById('catBudgetSummary');
        var sumTitle = document.getElementById('catBudgetSummaryTitle');
        var bk = document.getElementById('catBudgetKicker');
        if (bk) bk.textContent = MONTH_META[activeMonth].label + ' · лимиты закупок и дебиторка';
        if (sumTitle) sumTitle.textContent = 'Сводка · ' + MONTH_META[activeMonth].label;
        if (!rowsEl || !bd || !bd.rows) return;

        var budgetRows = bd.rows.slice();
        var catF = document.getElementById('catFilterCategory');
        if (catF && catF.value) budgetRows = budgetRows.filter(function (r) { return r.category === catF.value; });

        rowsEl.innerHTML = budgetRows
          .map(function (r) {
            return (
              '<div class="cat-dash__budget-row">' +
              '<div><span class="muted cat-dash__budget-label">Категория</span><p class="cat-dash__budget-strong">' +
              r.category +
              '</p></div>' +
              '<div><span class="muted cat-dash__budget-label">Бюджет</span><p>' +
              formatRub(r.budget) +
              '</p></div>' +
              '<div><span class="muted cat-dash__budget-label">Потрачено</span><p>' +
              formatRub(r.spent) +
              '</p></div>' +
              '<div><span class="muted cat-dash__budget-label">Остаток</span><p>' +
              formatRub(r.left) +
              '</p></div>' +
              '<div><span class="muted cat-dash__budget-label">Дебиторка</span><p>' +
              formatRub(r.debt) +
              '</p></div>' +
              '</div>'
            );
          })
          .join('');

        sumEl.innerHTML = bd.summary
          .map(function (s) {
            var val = formatRub(s.value);
            var inner = '<span class="muted">' + s.label + '</span><span class="hr-dash__stat-value">' + val + '</span>';
            return '<li>' + inner + '</li>';
          })
          .join('');
      }

      function countRequests(list) {
        var c = { work: 0, wait: 0, confirmed: 0 };
        list.forEach(function (r) {
          if (c[r.status] !== undefined) c[r.status]++;
        });
        return {
          total: list.length,
          work: c.work,
          wait: c.wait,
          closed: c.confirmed
        };
      }

      function renderRequests() {
        var listEl = document.getElementById('catRequestList');
        var statsEl = document.getElementById('catRequestStats');
        var rk = document.getElementById('catRequestKicker');
        if (rk) rk.textContent = MONTH_META[activeMonth].label + ' · заявки от торговых точек';
        var regR = document.getElementById('catFilterRegion');
        var rvR = regR ? regR.value : '';
        var data;
        if (rvR === 'murmansk') {
          data = (MURMANSK_REQUEST_BY_MONTH[activeMonth] || []).slice();
        } else {
          data = (REQUEST_BY_MONTH[activeMonth] || []).slice();
          if (rvR === 'volgograd') {
            var vgR = volgogradStoreSet();
            data = data.filter(function (r) { return vgR[r.store]; });
          } else if (!rvR) {
            data = data.concat((MURMANSK_REQUEST_BY_MONTH[activeMonth] || []).slice());
          }
        }
        var storeF = document.getElementById('catFilterStore');
        if (storeF && storeF.value && storeF.value !== CAT_FILTER_STORE_ALL) {
          data = data.filter(function (r) { return r.store === storeF.value; });
        }
        if (!listEl) return;

        listEl.innerHTML = data.map(function (r) {
          var st = REQ_STATUS[r.status] || REQ_STATUS.wait;
          return (
            '<li class="cat-dash__request-item">' +
            '<div>' +
            '<p class="cat-dash__request-meta"><strong>' +
            r.id +
            '</strong> <span class="muted">' +
            r.store +
            '</span></p>' +
            '<p class="cat-dash__request-title">' +
            r.title +
            '</p>' +
            '<p class="muted cat-dash__request-from">Источник: ' +
            r.from +
            '</p>' +
            '</div>' +
            '<div class="cat-dash__request-side">' +
            '<span class="cat-dash__badge ' +
            st.cls +
            '">' +
            st.label +
            '</span>' +
            '<p class="muted cat-dash__request-assignee">Ответственный: ' +
            r.assignee +
            '</p>' +
            '</div>' +
            '</li>'
          );
        }).join('');

        var cnt = countRequests(data);
        statsEl.innerHTML =
          '<div class="cat-dash__request-stat"><span class="muted">Всего</span><span class="cat-dash__request-stat-val">' +
          cnt.total +
          '</span></div>' +
          '<div class="cat-dash__request-stat"><span class="muted">В работе</span><span class="cat-dash__request-stat-val">' +
          cnt.work +
          '</span></div>' +
          '<div class="cat-dash__request-stat"><span class="muted">Ожидают</span><span class="cat-dash__request-stat-val">' +
          cnt.wait +
          '</span></div>' +
          '<div class="cat-dash__request-stat"><span class="muted">Закрыто</span><span class="cat-dash__request-stat-val">' +
          cnt.closed +
          '</span></div>';
      }

      var MESSAGE_DATA = [
        {
          from: 'Склад · Волгоград',
          preview: 'Поступление по одноразовым эл. сигаретам — можно резервировать под точку «Волгоград Волжский Ленина»',
          time: 'Сегодня, 11:40',
          unread: true
        },
        {
          from: 'Управляющий · Волгоград, Рокоссовского 107',
          preview: 'Нужно согласовать поставку жидкостей на следующую неделю',
          time: 'Вчера, 16:05',
          unread: true
        },
        {
          from: 'Система',
          preview: 'Отчёт по бюджетам за март сформирован',
          time: 'Вчера, 09:00',
          unread: false
        },
        {
          from: 'Закупки',
          preview: 'По табаку для кальяна — новый прайс от поставщика во вложении',
          time: '25 марта',
          unread: false
        }
      ];

      function renderMessages() {
        var listEl = document.getElementById('catMessageList');
        if (!listEl) return;
        listEl.innerHTML = MESSAGE_DATA.map(function (m) {
          var rowCls = 'cat-dash__msg-item' + (m.unread ? ' cat-dash__msg-item--unread' : '');
          return (
            '<li class="' +
            rowCls +
            '">' +
            '<div class="cat-dash__msg-top">' +
            '<span class="cat-dash__msg-from">' +
            m.from +
            '</span>' +
            '<span class="muted cat-dash__msg-time">' +
            m.time +
            '</span>' +
            '</div>' +
            '<p class="cat-dash__msg-preview">' +
            m.preview +
            '</p>' +
            '</li>'
          );
        }).join('');
      }

      applyTopbarPersona();
      initFilterBar();
      initMetricsRevDrillUi();
      renderCatDashboard();
      renderMetricsTable();
      if (document.getElementById('catBudgetRows')) {
        renderBudgets();
        renderRequests();
        renderMessages();
      }
    })();
