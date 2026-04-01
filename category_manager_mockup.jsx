import React from 'react';

function StatCard({ title, value, subvalue, trend, trendType = 'neutral' }) {
  const trendClass =
    trendType === 'up'
      ? 'text-emerald-600'
      : trendType === 'down'
        ? 'text-rose-600'
        : 'text-slate-500';

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
      {subvalue && <div className="mt-1 text-sm text-slate-600">{subvalue}</div>}
      {trend && <div className={`mt-3 text-sm font-medium ${trendClass}`}>{trend}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    good: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    confirmed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    risk: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    bad: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    work: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
    wait: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
  };

  const labels = {
    good: 'Норма',
    confirmed: 'Заказ подтверждён',
    risk: 'Под риском',
    bad: 'Проблема',
    work: 'В работе',
    wait: 'Ожидает',
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status] || styles.wait}`}>
      {labels[status] || status}
    </span>
  );
}

function ProgressBar({ value }) {
  return (
    <div>
      <div className="h-2.5 rounded-full bg-slate-100">
        <div className="h-2.5 rounded-full bg-slate-900" style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <div className="mt-2 text-xs text-slate-500">Выполнение: {value}%</div>
    </div>
  );
}

function PlanFactTab() {
  const rows = [
    { category: 'Вейпы', store: 'ТТ Апатиты', availability: 84, dead: 14, plan: '500 000 ₽', fact: '420 000 ₽', exec: 84, status: 'bad' },
    { category: 'Табак', store: 'ТТ Мурманск', availability: 96, dead: 6, plan: '700 000 ₽', fact: '710 000 ₽', exec: 101, status: 'good' },
    { category: 'Жидкости', store: 'ТТ Кандалакша', availability: 88, dead: 10, plan: '400 000 ₽', fact: '350 000 ₽', exec: 88, status: 'risk' },
    { category: 'Снеки', store: 'ТТ Североморск', availability: 75, dead: 18, plan: '300 000 ₽', fact: '220 000 ₽', exec: 73, status: 'bad' },
    { category: 'Кальянка', store: 'ТТ Мончегорск', availability: 92, dead: 7, plan: '280 000 ₽', fact: '262 000 ₽', exec: 94, status: 'risk' },
  ];

  const problemPoints = [
    'ТТ Апатиты — низкая доступность по вейпам',
    'ТТ Североморск — высокая доля неликвида',
    'Жидкости — отставание от плана по выручке',
  ];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Монитор план / факт</h2>
            <p className="text-sm text-slate-500">Сразу видно, где по категории или точке проседают показатели</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <button className="rounded-2xl bg-slate-900 px-4 py-2 font-medium text-white">Все точки</button>
            <button className="rounded-2xl bg-slate-100 px-4 py-2 font-medium text-slate-700">Моя категория</button>
            <button className="rounded-2xl bg-slate-100 px-4 py-2 font-medium text-slate-700">Эта неделя</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full overflow-hidden rounded-2xl text-left">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="px-4 py-4 font-medium">Категория</th>
                <th className="px-4 py-4 font-medium">Торговая точка</th>
                <th className="px-4 py-4 font-medium">Доступность</th>
                <th className="px-4 py-4 font-medium">Неликвид</th>
                <th className="px-4 py-4 font-medium">План</th>
                <th className="px-4 py-4 font-medium">Факт</th>
                <th className="px-4 py-4 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.category}-${row.store}`} className="border-t border-slate-200 bg-white text-sm">
                  <td className="px-4 py-4 font-semibold text-slate-900">{row.category}</td>
                  <td className="px-4 py-4 text-slate-700">{row.store}</td>
                  <td className="px-4 py-4 text-slate-900">{row.availability}%</td>
                  <td className="px-4 py-4 text-slate-900">{row.dead}%</td>
                  <td className="px-4 py-4 text-slate-900">{row.plan}</td>
                  <td className="px-4 py-4 text-slate-900">{row.fact}</td>
                  <td className="px-4 py-4"><StatusBadge status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold">Требует внимания</h2>
          <p className="mt-1 text-sm text-slate-500">Быстрые сигналы по магазинам и категориям</p>
          <div className="mt-4 space-y-3">
            {problemPoints.map((point) => (
              <div key={point} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                {point}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold">Выполнение плана</h2>
          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-500">Выручка</span>
                <span className="font-medium">86%</span>
              </div>
              <ProgressBar value={86} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-500">Валовый доход</span>
                <span className="font-medium">79%</span>
              </div>
              <ProgressBar value={79} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BudgetTab() {
  const budgetRows = [
    { category: 'Вейпы', budget: '2 000 000 ₽', spent: '1 420 000 ₽', left: '580 000 ₽', debt: '310 000 ₽' },
    { category: 'Табак', budget: '3 400 000 ₽', spent: '2 900 000 ₽', left: '500 000 ₽', debt: '540 000 ₽' },
    { category: 'Жидкости', budget: '1 600 000 ₽', spent: '1 050 000 ₽', left: '550 000 ₽', debt: '120 000 ₽' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Бюджеты по категориям</h2>
          <p className="text-sm text-slate-500">Чтобы быстро понимать, на какую сумму можно делать закупку</p>
        </div>
        <div className="space-y-3">
          {budgetRows.map((row) => (
            <div key={row.category} className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-5">
              <div>
                <div className="text-sm text-slate-500">Категория</div>
                <div className="mt-1 font-semibold">{row.category}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Бюджет</div>
                <div className="mt-1 font-medium">{row.budget}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Потрачено</div>
                <div className="mt-1 font-medium">{row.spent}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Остаток</div>
                <div className="mt-1 font-medium">{row.left}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Дебиторка</div>
                <div className="mt-1 font-medium">{row.debt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold">Сводка недели</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Общий бюджет</span><span className="font-medium">7 000 000 ₽</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Потрачено</span><span className="font-medium">5 370 000 ₽</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Остаток</span><span className="font-medium">1 630 000 ₽</span></div>
            <div className="flex justify-between border-t border-slate-200 pt-3"><span className="text-slate-500">Всего дебиторки</span><span className="font-semibold">970 000 ₽</span></div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold">Комментарий</h2>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            По табаку бюджет почти выбран. Новые закупки лучше согласовывать через приоритет ТТ и оборачиваемость.
          </div>
        </div>
      </div>
    </div>
  );
}

function RequestsTab() {
  const requests = [
    { id: '#241', store: 'ТТ Апатиты', item: 'HQD 1200 Blueberry', from: 'Управляющий', status: 'work', assignee: 'Категорийный менеджер' },
    { id: '#242', store: 'ТТ Мурманск', item: 'Табак Darkside Core', from: 'Управляющий', status: 'wait', assignee: 'Склад' },
    { id: '#243', store: 'ТТ Кандалакша', item: 'Одноразки Lost Mary', from: 'Продавец', status: 'work', assignee: 'Категорийный менеджер' },
    { id: '#244', store: 'ТТ Мончегорск', item: 'Уголь кокосовый', from: 'Управляющий', status: 'confirmed', assignee: 'Закупки' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Заявки от магазинов</h2>
            <p className="text-sm text-slate-500">Похоже на задачи в Bitrix: видно, что пришло и кто это обрабатывает</p>
          </div>
          <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Создать заявку</button>
        </div>
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-slate-900">{r.id}</div>
                    <div className="text-sm text-slate-500">{r.store}</div>
                  </div>
                  <div className="mt-2 text-base font-medium text-slate-900">{r.item}</div>
                  <div className="mt-1 text-sm text-slate-500">Источник: {r.from}</div>
                </div>
                <div className="flex flex-col items-start gap-2 lg:items-end">
                  <StatusBadge status={r.status} />
                  <div className="text-sm text-slate-500">Ответственный: {r.assignee}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold">Свод по заявкам</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-slate-500">Всего</div>
              <div className="mt-1 text-2xl font-bold">18</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-slate-500">В работе</div>
              <div className="mt-1 text-2xl font-bold">7</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-slate-500">Ожидают</div>
              <div className="mt-1 text-2xl font-bold">5</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-slate-500">Закрыто</div>
              <div className="mt-1 text-2xl font-bold">6</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold">Логика обработки</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <div className="rounded-2xl bg-slate-50 p-3">1. Заявка приходит от ТТ</div>
            <div className="rounded-2xl bg-slate-50 p-3">2. Проверяем наличие на складе</div>
            <div className="rounded-2xl bg-slate-50 p-3">3. Если нет — проверяем поставщика и бюджет</div>
            <div className="rounded-2xl bg-slate-50 p-3">4. Назначаем ответственного и ведем статус</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryManagerMockup() {
  const [tab, setTab] = React.useState('planfact');

  const tabClass = (active) =>
    `rounded-2xl px-4 py-2 text-sm font-medium transition ${active ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200'}`;

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm text-slate-500">ERP / Категорийный менеджер</div>
            <h1 className="text-3xl font-bold">Дашборд категорийщика</h1>
            <div className="mt-1 text-sm text-slate-600">Неделя 14 • вейпы и табак • ТТ Мурманской области</div>
          </div>
          <div className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm text-slate-500">Быстрый итог недели</div>
            <div className="mt-1 text-2xl font-bold">86% выполнения плана</div>
            <div className="text-sm text-amber-600">2 категории требуют внимания</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Доступность товара" value="91%" trend="+3% за неделю" trendType="up" />
          <StatCard title="Доля неликвида" value="12%" trend="-2% к прошлой неделе" trendType="down" />
          <StatCard title="План по выручке" value="86%" subvalue="4.2M / 5M" />
          <StatCard title="Валовый доход" value="79%" subvalue="1.3M / 1.7M" />
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => setTab('planfact')} className={tabClass(tab === 'planfact')}>План / Факт</button>
          <button onClick={() => setTab('budgets')} className={tabClass(tab === 'budgets')}>Бюджеты</button>
          <button onClick={() => setTab('requests')} className={tabClass(tab === 'requests')}>Заявки</button>
        </div>

        {tab === 'planfact' && <PlanFactTab />}
        {tab === 'budgets' && <BudgetTab />}
        {tab === 'requests' && <RequestsTab />}
      </div>
    </div>
  );
}
