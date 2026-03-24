/**
 * Общий рейтинг продавцов для ролей «продавец» и «управляющий».
 * Список один на сессию (sessionStorage), пока не закрыта вкладка / не очищено хранилище.
 */
(function (global) {
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }

  function randomRating() {
    return Math.round((3 + Math.random() * 2) * 10) / 10;
  }

  function buildRatingPeople() {
    var first = [
      'Александр', 'Дмитрий', 'Максим', 'Сергей', 'Андрей', 'Алексей', 'Артём', 'Илья',
      'Кирилл', 'Михаил', 'Никита', 'Матвей', 'Роман', 'Егор', 'Арсений', 'Иван',
      'Денис', 'Евгений', 'Даниил', 'Тимофей', 'Владислав', 'Игорь', 'Владимир', 'Павел',
      'Константин', 'Николай', 'Глеб', 'Олег', 'Степан'
    ];
    var last = [
      'Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Петров', 'Соколов', 'Михайлов',
      'Новиков', 'Фёдоров', 'Морозов', 'Волков', 'Алексеев', 'Лебедев', 'Семёнов', 'Егоров',
      'Павлов', 'Козлов', 'Степанов', 'Николаев', 'Орлов', 'Андреев', 'Макаров', 'Никитин',
      'Захаров', 'Зайцев', 'Соловьёв', 'Борисов', 'Яковлев', 'Григорьев', 'Романов', 'Кузьмин'
    ];
    var used = {};
    var people = [];

    while (people.length < 23) {
      var fn = first[Math.floor(Math.random() * first.length)];
      var ln = last[Math.floor(Math.random() * last.length)];
      var full = fn + ' ' + ln;
      if (full === 'Иван Петров' || used[full]) continue;
      used[full] = true;
      people.push({ name: full, rating: randomRating() });
    }

    people.push({ name: 'Иван Петров', rating: randomRating() });

    shuffle(people);
    people.sort(function (a, b) {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return a.name.localeCompare(b.name, 'ru');
    });

    return people;
  }

  function getOrBuildRatingPeople() {
    try {
      var json = sessionStorage.getItem('crm_rating_people');
      if (json) {
        var parsed = JSON.parse(json);
        if (Array.isArray(parsed) && parsed.length === 24) return parsed;
      }
    } catch (e) {}

    var people = buildRatingPeople();
    try {
      sessionStorage.setItem('crm_rating_people', JSON.stringify(people));
    } catch (e) {}

    return people;
  }

  global.CRM = global.CRM || {};
  global.CRM.getRatingPeople = getOrBuildRatingPeople;
})(typeof window !== 'undefined' ? window : this);
