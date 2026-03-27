export default function SellerAppMockup() {
  const metrics = [
    { name: 'Выручка', fact: '124 500 ₽', plan: '200 000 ₽', left: '75 500 ₽', progress: 62 },
    { name: 'Средний чек', fact: '1 820 ₽', plan: '2 100 ₽', left: '280 ₽', progress: 86 },
    { name: 'Глубина чека', fact: '2.4', plan: '3.0', left: '0.6', progress: 80 },
    { name: 'Оцифровка', fact: '18', plan: '22', left: '4 клиента', progress: 82 },
    { name: 'Красные ценники', fact: '14 200 ₽', plan: '18 000 ₽', left: '3 800 ₽', progress: 79 },
    { name: 'Доп. продажи', fact: '9 400 ₽', plan: '12 000 ₽', left: '2 600 ₽', progress: 78 },
  ];

  const rating = [
    { place: 1, name: 'Алина', point: 'ТТ Мурманск', value: '96%' },
    { place: 2, name: 'Максим', point: 'ТТ Североморск', value: '91%' },
    { place: 3, name: 'Дина', point: 'ТТ Кандалакша', value: '89%' },
    { place: 4, name: 'Вы', point: 'ТТ Апатиты', value: '84%', me: true },
  ];

  const tasks = [
    { title: 'Проверить выкладку красных ценников', status: 'В работе', priority: 'Сегодня до 15:00' },
    { title: 'Запросить одноразки с ТТ Североморск', status: 'Отправлен запрос', priority: 'Ожидает ответ' },
    { title: 'Ознакомиться с новым скриптом продаж', status: 'Не начато', priority: 'Новая задача' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Приложение продавца</div>
            <h1 className="text-3xl font-bold">Моя смена</h1>
            <div className="mt-1 text-sm text-slate-600">Апатиты • Смена 10:00–22:00 • Сегодня</div>
          </div>
          <div className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm text-slate-500">Прогноз заработка за смену</div>
            <div className="mt-1 text-2xl font-bold">4 850 ₽</div>
            <div className="text-sm text-emerald-600">+900 ₽ если добьете план по выручке</div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">План на сегодня</h2>
                <p className="text-sm text-slate-500">Сразу видно, что осталось до выполнения</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">Общий прогресс: 84%</div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {metrics.map((m) => (
                <div key={m.name} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-slate-500">{m.name}</div>
                      <div className="mt-1 text-xl font-bold">{m.fact}</div>
                      <div className="text-sm text-slate-600">План: {m.plan}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">Осталось</div>
                      <div className="font-semibold">{m.left}</div>
                    </div>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-slate-100">
                    <div className="h-3 rounded-full bg-slate-900" style={{ width: `${m.progress}%` }} />
                  </div>
                  <div className="mt-2 text-sm text-slate-500">Выполнение: {m.progress}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold">Место в рейтинге</h2>
              <p className="mt-1 text-sm text-slate-500">Соревнование между продавцами</p>
              <div className="mt-4 space-y-3">
                {rating.map((r) => (
                  <div
                    key={r.place}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 ${r.me ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold shadow-sm">#{r.place}</div>
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-slate-500">{r.point}</div>
                      </div>
                    </div>
                    <div className="font-semibold">{r.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-slate-900 p-4 text-white">
                <div className="text-sm opacity-80">До 3 места осталось</div>
                <div className="mt-1 text-2xl font-bold">5%</div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold">Доход за смену</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Ставка</span><span className="font-medium">2 500 ₽</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Бонус за KPI</span><span className="font-medium">1 750 ₽</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Бонус за топ-3</span><span className="font-medium">600 ₽</span></div>
                <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-semibold"><span>Итого прогноз</span><span>4 850 ₽</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Задачи и запросы</h2>
                <p className="text-sm text-slate-500">Чтобы ничего не терялось в чатах</p>
              </div>
              <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Создать запрос</button>
            </div>
            <div className="space-y-3">
              {tasks.map((t) => (
                <div key={t.title} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="mt-1 text-sm text-slate-500">{t.priority}</div>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">{t.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Карточка торговой точки</h2>
              <p className="text-sm text-slate-500">Полезно для подменных сотрудников</p>
            </div>
            <div className="overflow-hidden rounded-3xl bg-slate-200">
              <div className="flex h-52 items-center justify-center text-slate-500">Фото точки</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-slate-500">Адрес</div>
                <div className="mt-1 font-medium">Апатиты, Ферсмана 28</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-slate-500">Статус</div>
                <div className="mt-1 font-medium">На смене 2 сотрудника</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 col-span-2">
                <div className="text-slate-500">Особенности точки</div>
                <div className="mt-1 font-medium">Касса справа, одноразки у входа, премиум табак на верхней полке, расходники в нижнем шкафу.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ManagerDashboardMockup() {
  const stores = [
    { name: 'ТТ Апатиты', revenue: '182 400 ₽', plan: 82, avg: '1 720 ₽', status: 'risk' },
    { name: 'ТТ Мурманск', revenue: '241 800 ₽', plan: 104, avg: '2 140 ₽', status: 'good' },
    { name: 'ТТ Кандалакша', revenue: '139 200 ₽', plan: 71, avg: '1 580 ₽', status: 'bad' },
    { name: 'ТТ Североморск', revenue: '198 000 ₽', plan: 93, avg: '1 880 ₽', status: 'normal' },
  ];

  const employeesTop = [
    { name: 'Алина', percent: 96, store: 'Мурманск' },
    { name: 'Максим', percent: 92, store: 'Североморск' },
    { name: 'Дина', percent: 88, store: 'Апатиты' },
  ];

  const employeesLow = [
    { name: 'Игорь', percent: 54, store: 'Кандалакша' },
    { name: 'Денис', percent: 61, store: 'Апатиты' },
  ];

  const alerts = [
    'ТТ Кандалакша — риск не выполнить план',
    'ТТ Апатиты — падает средний чек',
    '2 запроса продавцов без ответа',
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Дашборд управляющего</h1>
            <div className="text-slate-500">Сегодня • 4 магазина</div>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow">
            <div className="text-sm text-slate-500">Выручка сегодня</div>
            <div className="text-2xl font-bold">761 400 ₽</div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <div className="text-sm text-slate-500">Выполнение плана</div>
            <div className="text-2xl font-bold">87%</div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <div className="text-sm text-slate-500">Средний чек</div>
            <div className="text-2xl font-bold">1 890 ₽</div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <div className="text-sm text-slate-500">Точек в риске</div>
            <div className="text-2xl font-bold">2</div>
          </div>
        </div>

        {/* Stores Table */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-xl font-semibold mb-4">Магазины</h2>

          <div className="space-y-3">
            {stores.map((s) => (
              <div
                key={s.name}
                className="grid grid-cols-5 items-center bg-slate-50 p-4 rounded-xl"
              >
                <div className="font-medium">{s.name}</div>
                <div>{s.revenue}</div>
                <div>{s.plan}%</div>
                <div>{s.avg}</div>
                <div>
                  {s.status === 'good' && '✅ Ок'}
                  {s.status === 'risk' && '⚠ Риск'}
                  {s.status === 'bad' && '🔴 Проблема'}
                  {s.status === 'normal' && '🟡 Нормально'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts + Employees */}
        <div className="grid grid-cols-3 gap-6">

          {/* Alerts */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <h2 className="font-semibold mb-3">Сигналы</h2>
            <div className="space-y-2">
              {alerts.map((a) => (
                <div className="bg-slate-50 p-3 rounded-xl text-sm">{a}</div>
              ))}
            </div>
          </div>

          {/* Top */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <h2 className="font-semibold mb-3">Топ продавцов</h2>
            <div className="space-y-2">
              {employeesTop.map((e) => (
                <div className="flex justify-between bg-slate-50 p-3 rounded-xl">
                  <div>
                    <div className="font-medium">{e.name}</div>
                    <div className="text-xs text-slate-500">{e.store}</div>
                  </div>
                  <div className="font-bold">{e.percent}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Outsiders */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <h2 className="font-semibold mb-3">Требуют внимания</h2>
            <div className="space-y-2">
              {employeesLow.map((e) => (
                <div className="flex justify-between bg-rose-50 p-3 rounded-xl">
                  <div>
                    <div className="font-medium">{e.name}</div>
                    <div className="text-xs text-slate-500">{e.store}</div>
                  </div>
                  <div className="font-bold">{e.percent}%</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
