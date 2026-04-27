/**
 * Вкладка «План» у управляющего: ввод месячных планов по всем ТТ и показателям.
 * Сохранение в localStorage (прототип, без бэкенда).
 */
(function () {
  /** Новая версия ключа: строки привязаны к tt_dash_* из CRM_TT.allRegions() */
  var STORAGE_KEY = 'crm_manager_monthly_plan_v2';

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

  var AVG_CHECK_MIN = 1500;
  var AVG_CHECK_MAX = 3500;

  function clampAvgCheck(n) {
    var x = Number(n);
    if (isNaN(x)) return null;
    return Math.max(AVG_CHECK_MIN, Math.min(AVG_CHECK_MAX, Math.round(x)));
  }

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
    if (m.type === 'avgCheck') {
      return Math.round((AVG_CHECK_MIN + r * (AVG_CHECK_MAX - AVG_CHECK_MIN)) / 50) * 50;
    }
    if (m.type === 'currency') {
      return Math.round((600000 + r * 1800000) / 1000) * 1000;
    }
    if (m.type === 'int') {
      return Math.round(600 + r * 2000);
    }
    if (m.type === 'percent') {
      return Math.round(32 + r * 63);
    }
    if (m.type === 'depth') {
      return Math.round((1.5 + r * 1.5) * 10) / 10;
    }
    return 0;
  }

  /** Показатели в логике план-факта (как в отчётах по сети). */
  var METRICS = [
    { id: 'rev', label: 'Выручка', unit: '₽', type: 'currency' },
    { id: 'gross', label: 'Валовая прибыль', unit: '₽', type: 'currency' },
    { id: 'avail', label: 'Доступность', unit: '%', type: 'percent' },
    { id: 'margin', label: 'Маржинальность', unit: '%', type: 'percent' },
    { id: 'avgCheck', label: 'Средний чек', unit: '₽', type: 'avgCheck' },
    { id: 'checkDepth', label: 'Глубина чека', unit: 'от 1,5 до 3', type: 'depth' },
    { id: 'sellerIdx', label: 'Индекс продавцов', unit: '%', type: 'percent' }
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
    return 'plan_' + storeId + '__' + metId;
  }

  function formatValueForInput(type, n) {
    if (n === undefined || n === null || n === '') return '';
    if (type === 'int' || type === 'currency' || type === 'percent' || type === 'depth' || type === 'avgCheck') {
      if (type === 'int' || type === 'avgCheck') return String(Math.round(Number(n)));
      if (type === 'depth') return String(Math.round(Number(n) * 10) / 10).replace('.', ',');
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
    var badAvg = 0;
    STORES.forEach(function (st) {
      METRICS.forEach(function (m) {
        total++;
        var inp = document.getElementById(fieldName(st.id, m.id));
        if (!inp) return;
        var v = (inp.value || '').replace(/\s/g, '').replace(',', '.');
        if (v === '') {
          empty++;
          return;
        }
        if (m.type === 'avgCheck') {
          var n = parseFloat(v);
          if (isNaN(n) || n < AVG_CHECK_MIN || n > AVG_CHECK_MAX) {
            badAvg++;
          }
        }
      });
    });
    return { empty: empty, total: total, full: empty === 0, badAvgCheck: badAvg };
  }

  function collect() {
    var out = {};
    STORES.forEach(function (st) {
      out[st.id] = {};
      METRICS.forEach(function (m) {
        var inp = document.getElementById(fieldName(st.id, m.id));
        if (!inp) return;
        var raw = (inp.value || '').trim();
        if (m.type === 'avgCheck') {
          var cl = clampAvgCheck(parseFloat(raw.replace(/\s/g, '').replace(',', '.')));
          out[st.id][m.id] = cl == null ? raw : String(cl);
        } else {
          out[st.id][m.id] = raw;
        }
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
          var s = typeof raw === 'string' || typeof raw === 'number' ? String(raw) : raw;
          if (m.type === 'avgCheck') {
            var cl = clampAvgCheck(parseFloat(String(s).replace(/\s/g, '').replace(',', '.')));
            inp.value = cl == null ? s : String(cl);
          } else {
            inp.value = s;
          }
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
    var monthSel = document.getElementById('planEntryMonth');
    var statusEl = document.getElementById('planEntryStatus');
    var btnSave = document.getElementById('planEntrySave');
    var btnCopy = document.getElementById('planEntryCopyPrev');
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
      if (v.badAvgCheck) {
        renderStatus(
          statusEl,
          'warn',
          'Средний чек: в каждой ячейке столбца укажите целое число от ' +
            AVG_CHECK_MIN +
            ' до ' +
            AVG_CHECK_MAX +
            ' ₽ (сейчас ' +
            v.badAvgCheck +
            ' яч.)'
        );
        return;
      }
      var all = loadAll();
      all[monthSel.value] = collect();
      if (saveAll(all)) {
        var el = document.getElementById('planEntrySavedAt');
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
          'План на ' + monthSel.options[monthSel.selectedIndex].text + ' записан (локальное хранилище, прототип)'
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
    var thead = document.getElementById('planMatrixHead');
    var tbody = document.getElementById('planMatrixBody');
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
          m.type === 'int' || m.type === 'currency' || m.type === 'avgCheck' ? 'numeric' : 'decimal'
        );
        inp.setAttribute('autocomplete', 'off');
        if (m.type === 'depth') {
          inp.placeholder = '1,5–3';
        } else if (m.type === 'avgCheck') {
          inp.placeholder = String(Math.round((AVG_CHECK_MIN + AVG_CHECK_MAX) / 2));
        } else if (m.type === 'currency' || m.type === 'int') {
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
