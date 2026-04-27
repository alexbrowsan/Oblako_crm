/**
 * Справочник торговых точек — те же наборы, что и на дашборде (кат / управляющий).
 * Подключается до crm-cat-dashboard-metrics.js и crm-manager-plan.js
 */
(function (w) {
  var VOLGOGRAD_STORES_LIST = [
    'Волгоград, Рабоче-Крестьянская 2/2',
    'Волгоград, Рокоссовского 107',
    'Волгоград, Шумского',
    'Волгоград Кастерина',
    'Волгоград Волжский Ленина',
    'Волгоград 30 лет победы',
    'Волгоград Ленина'
  ];

  var MURMANSK_STORES = [
    'Апатиты Ферсмана 28',
    'Апатиты, Бредова 26А',
    'Апатиты, Дзержинского 37',
    'Апатиты, Жемчужная 15А',
    'Апатиты, Козлова 10',
    'Апатиты, Козлова 10 (Smog Shop)',
    'Апатиты, Ленина 10',
    'Апатиты, Сидоренко 1',
    'Кандалакша, Пронина 7А',
    'Кировск, Кондрикова 1'
  ];

  function mergeStoreListsUnique(a, b) {
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

  w.CRM_TT = {
    volgograd: VOLGOGRAD_STORES_LIST,
    murmansk: MURMANSK_STORES,
    merge: mergeStoreListsUnique,
    /** Сводный список, как на дашборде при «Все регионы». */
    allRegions: function () {
      return mergeStoreListsUnique(VOLGOGRAD_STORES_LIST.slice(), MURMANSK_STORES.slice());
    }
  };
})(window);
