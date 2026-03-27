import React from 'react';

export function SellerAppMockup() {
  const metrics = [
    { name: 'Выручка', fact: '124 500 ₽', plan: '200 000 ₽', left: '75 500 ₽', progress: 62 },
    { name: 'Средний чек', fact: '1 820 ₽', plan: '2 100 ₽', left: '280 ₽', progress: 86 },
    { name: 'Глубина чека', fact: '2.4', plan: '3.0', left: '0.6', progress: 80 },
    { name: 'Оцифровка', fact: '18', plan: '22', left: '4 клиента', progress: 82 },
    { name: 'Красные ценники', fact: '14 200 ₽', plan: '18 000 ₽', left: '3 800 ₽', progress: 79 },
    { name: 'Доп. продажи', fact: '9 400 ₽', plan: '12 000 ₽', left: '2 600 ₽', progress: 78 },
  ];

  const rating = [
    { place: 1, name: 'Алина', point: 'ТТ Ауэзова', value: '96%' },
    { place: 2, name: 'Максим', point: 'ТТ Абая', value: '91%' },
    { place: 3, name: 'Дина', point: 'ТТ Сатпаева', value: '89%' },
    { place: 4, name: 'Вы', point: 'ТТ Арбат', value: '84%', me: true },
  ];

  const tasks = [
    { title: 'Проверить выкладку красных ценников', status: 'В работе', priority: 'Сегодня до 15:00' },
    { title: 'Запросить одноразки с ТТ Абая', status: 'Отправлен запрос', priority: 'Ожидает ответ' },
    { title: 'Ознакомиться с новым скриптом продаж', status: 'Не начато', priority: 'Новая задача' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Приложение продавца</div>
            <h1 className="text-3xl font-bold">Моя смена</h1>
            <div className="mt-1 text-sm text-slate-600">Арбат • Смена 10:00–22:00 • Сегодня</div>
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
                <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold"><span>Итого прогноз</span><span>4 850 ₽</span></div>
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
                <div className="mt-1 font-medium">Арбат, 14</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-slate-500">Статус</div>
                <div className="mt-1 font-medium">На смене 2 сотрудника</div>
              </div>
              <div className="col-span-2 rounded-2xl bg-slate-50 p-4">
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
    { name: 'ТТ Арбат', revenue: '182 400 ₽', plan: 82, avg: '1 720 ₽', status: 'risk' },
    { name: 'ТТ Абая', revenue: '241 800 ₽', plan: 104, avg: '2 140 ₽', status: 'good' },
    { name: 'ТТ Сатпаева', revenue: '139 200 ₽', plan: 71, avg: '1 580 ₽', status: 'bad' },
    { name: 'ТТ Ауэзова', revenue: '198 000 ₽', plan: 93, avg: '1 880 ₽', status: 'normal' },
  ];

  const employeesTop = [
    { name: 'Алина', percent: 96, store: 'Ауэзова' },
    { name: 'Максим', percent: 92, store: 'Абая' },
    { name: 'Дина', percent: 88, store: 'Арбат' },
  ];

  const employeesLow = [
    { name: 'Игорь', percent: 54, store: 'Сатпаева' },
    { name: 'Денис', percent: 61, store: 'Арбат' },
  ];

  const alerts = [
    'ТТ Сатпаева — риск не выполнить план',
    'ТТ Арбат — падает средний чек',
    '2 запроса продавцов без ответа',
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Дашборд управляющего</h1>
            <div className="text-slate-500">Сегодня • 4 магазина</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow">
            <div className="text-sm text-slate-500">Выручка сегодня</div>
            <div className="text-2xl font-bold">761 400 ₽</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow">
            <div className="text-sm text-slate-500">Выполнение плана</div>
            <div className="text-2xl font-bold">87%</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow">
            <div className="text-sm text-slate-500">Средний чек</div>
            <div className="text-2xl font-bold">1 890 ₽</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow">
            <div className="text-sm text-slate-500">Точек в риске</div>
            <div className="text-2xl font-bold">2</div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-semibold">Магазины</h2>
          <div className="space-y-3">
            {stores.map((s) => (
              <div key={s.name} className="grid grid-cols-1 items-center gap-2 rounded-xl bg-slate-50 p-4 md:grid-cols-5">
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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow">
            <h2 className="mb-3 font-semibold">Сигналы</h2>
            <div className="space-y-2">
              {alerts.map((a) => (
                <div key={a} className="rounded-xl bg-slate-50 p-3 text-sm">{a}</div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <h2 className="mb-3 font-semibold">Топ продавцов</h2>
            <div className="space-y-2">
              {employeesTop.map((e) => (
                <div key={`${e.name}-${e.store}`} className="flex justify-between rounded-xl bg-slate-50 p-3">
                  <div>
                    <div className="font-medium">{e.name}</div>
                    <div className="text-xs text-slate-500">{e.store}</div>
                  </div>
                  <div className="font-bold">{e.percent}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <h2 className="mb-3 font-semibold">Требуют внимания</h2>
            <div className="space-y-2">
              {employeesLow.map((e) => (
                <div key={`${e.name}-${e.store}`} className="flex justify-between rounded-xl bg-rose-50 p-3">
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

export function HRDashboardMockup() {
  const alerts = [
    '3 сотрудника в риске увольнения (адаптация)',
    '2 сотрудника не прошли обучение',
    '5 сотрудников не подтвердили ознакомление',
  ];

  const onboarding = [
    { name: 'Алина', day: '3 день', status: 'Адаптация' },
    { name: 'Максим', day: '7 день', status: 'Обучение' },
    { name: 'Игорь', day: '2 день', status: 'Новый сотрудник' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">HR Дашборд</h1>
          <div className="text-slate-500">Обзор сотрудников и процессов</div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow">
            <div className="text-sm text-slate-500">Всего сотрудников</div>
            <div className="text-2xl font-bold">87</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow">
            <div className="text-sm text-slate-500">Новые сотрудники</div>
            <div className="text-2xl font-bold">6</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow">
            <div className="text-sm text-slate-500">Текучка за месяц</div>
            <div className="text-2xl font-bold">12%</div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow">
            <div className="text-sm text-slate-500">Средний срок работы</div>
            <div className="text-2xl font-bold">4.2 мес</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow">
            <h2 className="mb-3 font-semibold">Требует внимания</h2>
            <div className="space-y-2">
              {alerts.map((a) => (
                <div key={a} className="rounded-xl bg-slate-50 p-3 text-sm">{a}</div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow xl:col-span-2">
            <h2 className="mb-3 font-semibold">Новые сотрудники</h2>
            <div className="space-y-3">
              {onboarding.map((e) => (
                <div key={`${e.name}-${e.day}`} className="flex justify-between rounded-xl bg-slate-50 p-3">
                  <div>
                    <div className="font-medium">{e.name}</div>
                    <div className="text-xs text-slate-500">{e.day}</div>
                  </div>
                  <div className="text-sm font-medium">{e.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow">
            <h2 className="mb-3 font-semibold">Воронка сотрудников</h2>
            <div className="space-y-2 text-sm">
              <div>Кандидаты: 24</div>
              <div>Вышли на работу: 9</div>
              <div>Прошли адаптацию: 6</div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow">
            <h2 className="mb-3 font-semibold">Текучка</h2>
            <div className="space-y-2 text-sm">
              <div>Уволилось: 8</div>
              <div>Активные: 87</div>
              <div>Текучка: 12%</div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow">
            <h2 className="mb-3 font-semibold">Развитие</h2>
            <div className="space-y-2 text-sm">
              <div>Junior: 23</div>
              <div>Middle: 41</div>
              <div>Senior: 23</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppMockup() {
  const [view, setView] = React.useState('hr');

  const buttonClass = (active) =>
    `rounded px-3 py-1 text-sm ${active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`;

  return (
    <div>
      <div className="flex gap-3 border-b bg-white p-4">
        <button onClick={() => setView('seller')} className={buttonClass(view === 'seller')}>Seller</button>
        <button onClick={() => setView('manager')} className={buttonClass(view === 'manager')}>Manager</button>
        <button onClick={() => setView('hr')} className={buttonClass(view === 'hr')}>HR</button>
      </div>
      {view === 'seller' && <SellerAppMockup />}
      {view === 'manager' && <ManagerDashboardMockup />}
      {view === 'hr' && <HRDashboardMockup />}
    </div>
  );
}
