/**
 * Вкладка «План» у категорийного менеджера: плановые значения по столбцам дашборда (как выручка/маржа/Неликвид/ТЗ/доступность).
 */
(function () {
  var STORAGE_KEY = 'crm_category_manager_monthly_plan_v1';

  function buildStoreRows() {
    var names =
      window.CRM_TT && typeof window.CRM_TT.allRegions === 'function'
        ? window.CRM_TT.allRegions()
        : [];
    return names.map(function (name, i) {
      return { id: 'tt_dash_' + i, name: name };
    });
  }

  var STORES = [];

  function hash32(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function demoNumber(st, m) {
    var h = hash32(st.id + '|' + m.id);
    var r = (h % 10000) / 10000;
    if (m.type === 'currency') {
      return Math.round((600000 + r * 1800000) / 1000) * 1000;
    }
    if (m.type === 'currencyLow') {
      return Math.round((8000 + r * 420000) / 1000) * 1000;
    }
    if (m.type === 'int') {
      return Math.round(600 + r * 2000);
    }
    if (m.type === 'percent') {
      return Math.round(72 + Math.floor(r * 27));
    }
    return 0;
  }

  /** Со столбцами «план» таблицы детализации (дашборд категории). */
  var METRICS = [
    { id: 'rev', label: 'Выручка', unit: 'план, ₽', type: 'currency' },
    { id: 'margin', label: 'Маржинальность', unit: 'план, %', type: 'percent' },
    { id: 'gross', label: 'Валовая прибыль', unit: 'план, ₽', type: 'currency' },
    { id: 'ill30120', label: 'Неликвид 30–120', unit: 'план, ₽', type: 'currencyLow' },
    { id: 'ill120p', label: 'Неликвид 120+', unit: 'план, ₽', type: 'currencyLow' },
    { id: 'liquid', label: 'Товарные запасы ликвидные', unit: 'план, ₽', type: 'currency' },
    { id: 'availNea', label: 'Доступность НЕА', unit: 'план, %', type: 'percent' },
    { id: 'availProduct', label: 'Доступность товара', unit: 'план, %', type: 'percent' }
  ];

  function z(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function monthOptions() {
    var out = [];
    var d = new Date();
    var y = d.getFullYear();
    var m0 = d.getMonth();
    for (var k = -2; k <= 4; k++) {
      var t = m0 + k;
      var yv = y + Math.floor(t / 12);
      var mv = ((t % 12) + 12) % 12;
      var val = yv + '-' + z(mv + 1);
      var monthNames = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];
      out.push({ value: val, label: monthNames[mv] + ' ' + yv });
    }
    return out;
  }

  function loadAll() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (!s) return {};
      return JSON.parse(s) || {};
    } catch (e) {
      return {};
    }
  }

  function saveAll(obj) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      return true;
    } catch (e) {
      return false;
    }
  }

  function getMonthData(all, monthKey) {
    if (!all[monthKey]) return {};
    return all[monthKey];
  }

  function monthHasSavedData(all, monthKey) {
    var o = all[monthKey];
    if (!o) return false;
    return STORES.some(function (st) {
      var row = o[st.id];
      if (!row) return false;
      return METRICS.some(function (m) {
        var v = row[m.id];
        return v != null && String(v).trim() !== '';
      });
    });
  }

  function fieldName(storeId, metId) {
    return 'cat_mgr_plan_' + storeId + '__' + metId;
  }

  function formatValueForInput(type, n) {
    if (n === undefined || n === null || n === '') return '';
    if (type === 'int' || type === 'currency' || type === 'currencyLow' || type === 'percent') {
      if (type === 'int') return String(Math.round(Number(n)));
      return String(n);
    }
    return String(n);
  }

  function renderStatus(el, type, text) {
    if (!el) return;
    el.className = 'manager-plan-entry__status';
    if (type === 'ok') {
      el.classList.add('manager-plan-entry__status--ok');
      el.textContent = text || 'Сохранено';
    } else if (type === 'warn') {
      el.classList.add('manager-plan-entry__status--warn');
      el.textContent = text || '';
    } else {
      el.textContent = text || '';
    }
  }

  function validate() {
    var empty = 0;
    var total = 0;
    STORES.forEach(function (st) {
      METRICS.forEach(function (m) {
        total++;
        var inp = document.getElementById(fieldName(st.id, m.id));
        if (!inp) return;
        var v = (inp.value || '').replace(/\s/g, '').replace(',', '.');
        if (v === '') empty++;
      });
    });
    return { empty: empty, total: total, full: empty === 0 };
  }

  function collect() {
    var out = {};
    STORES.forEach(function (st) {
      out[st.id] = {};
      METRICS.forEach(function (m) {
        var inp = document.getElementById(fieldName(st.id, m.id));
        if (!inp) return;
        out[st.id][m.id] = (inp.value || '').trim();
      });
    });
    return out;
  }

  function applyData(monthData) {
    STORES.forEach(function (st) {
      var row = monthData[st.id] || {};
      METRICS.forEach(function (m) {
        var inp = document.getElementById(fieldName(st.id, m.id));
        if (!inp) return;
        var raw = row[m.id];
        if (raw != null && raw !== '') {
          inp.value = typeof raw === 'string' || typeof raw === 'number' ? String(raw) : raw;
        } else {
          inp.value = formatValueForInput(m.type, demoNumber(st, m));
        }
      });
    });
  }

  function prevMonthKey(key) {
    var p = key.split('-');
    var y = parseInt(p[0], 10);
    var m = parseInt(p[1], 10);
    m -= 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    return y + '-' + z(m);
  }

  function init() {
    var monthSel = document.getElementById('catPlanEntryMonth');
    var statusEl = document.getElementById('catPlanEntryStatus');
    var btnSave = document.getElementById('catPlanEntrySave');
    var btnCopy = document.getElementById('catPlanEntryCopyPrev');
    if (!monthSel) return;

    while (monthSel.firstChild) monthSel.removeChild(monthSel.firstChild);
    monthOptions().forEach(function (opt) {
      var o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      monthSel.appendChild(o);
    });
    var d = new Date();
    monthSel.value = d.getFullYear() + '-' + z(d.getMonth() + 1);

    function refreshMonth() {
      var all = loadAll();
      var mk = monthSel.value;
      var md = getMonthData(all, mk);
      if (monthHasSavedData(all, mk)) {
        applyData(md);
        renderStatus(statusEl, 'ok', 'Показан сохранённый план');
      } else {
        applyData({});
        renderStatus(statusEl, null, '');
      }
    }

    function save() {
      var v = validate();
      if (!v.full) {
        renderStatus(
          statusEl,
          'warn',
          'Заполните все ячейки. Пусто: ' + v.empty + ' из ' + v.total
        );
        return;
      }
      var all = loadAll();
      all[monthSel.value] = collect();
      if (saveAll(all)) {
        var el = document.getElementById('catPlanEntrySavedAt');
        if (el) {
          el.textContent = 'Последнее сохранение: ' + new Date().toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
        renderStatus(
          statusEl,
          'ok',
          'План на ' +
            monthSel.options[monthSel.selectedIndex].text +
            ' записан (локальное хранилище, прототип)'
        );
      } else {
        renderStatus(statusEl, 'warn', 'Не удалось сохранить (квота localStorage?)');
      }
    }

    function copyPrev() {
      var all = loadAll();
      var cur = monthSel.value;
      var prev = prevMonthKey(cur);
      var from = all[prev];
      if (!from) {
        renderStatus(statusEl, 'warn', 'Нет сохранённого плана за ' + prev);
        return;
      }
      applyData(from);
      renderStatus(
        statusEl,
        null,
        'Скопировано с ' + prev + '. Сохраните, чтобы закрепить за ' + monthSel.value
      );
    }

    if (btnSave) btnSave.addEventListener('click', save);
    if (btnCopy) btnCopy.addEventListener('click', copyPrev);
    monthSel.addEventListener('change', refreshMonth);
    refreshMonth();
  }

  function buildTable() {
    STORES = buildStoreRows();
    var thead = document.getElementById('catPlanMatrixHead');
    var tbody = document.getElementById('catPlanMatrixBody');
    if (!thead || !tbody) return;
    var trH = document.createElement('tr');
    var th0 = document.createElement('th');
    th0.scope = 'col';
    th0.className = 'manager-plan-entry__th-store';
    th0.textContent = 'Торговая точка';
    trH.appendChild(th0);
    METRICS.forEach(function (m) {
      var th = document.createElement('th');
      th.scope = 'col';
      th.className = 'manager-plan-entry__th-metric';
      th.innerHTML =
        '<span class="manager-plan-entry__th-label">' + m.label + '</span>' +
        '<span class="manager-plan-entry__th-unit">' + m.unit + '</span>';
      trH.appendChild(th);
    });
    thead.innerHTML = '';
    thead.appendChild(trH);
    tbody.innerHTML = '';
    STORES.forEach(function (st) {
      var tr = document.createElement('tr');
      var th = document.createElement('th');
      th.scope = 'row';
      th.className = 'manager-plan-entry__th-store';
      th.textContent = st.name;
      tr.appendChild(th);
      METRICS.forEach(function (m) {
        var td = document.createElement('td');
        var inp = document.createElement('input');
        inp.id = fieldName(st.id, m.id);
        inp.className = 'input manager-plan-entry__input';
        inp.type = 'text';
        inp.setAttribute(
          'inputmode',
          m.type === 'currency' || m.type === 'currencyLow' ? 'numeric' : 'decimal'
        );
        inp.setAttribute('autocomplete', 'off');
        if (m.type === 'currency' || m.type === 'currencyLow') {
          inp.placeholder = '0';
        } else if (m.type === 'percent') {
          inp.placeholder = '0';
        } else {
          inp.placeholder = '';
        }
        inp.setAttribute('aria-label', st.name + ' — ' + m.label + ', ' + m.unit);
        td.appendChild(inp);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      buildTable();
      init();
    });
  } else {
    buildTable();
    init();
  }
})();
