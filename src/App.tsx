import { FormEvent, useEffect, useMemo, useState } from 'react';

type BmiRecord = {
  id: string;
  createdAt: string;
  height: number;
  weight: number;
  bmi: number;
  category: string;
};

const STORAGE_KEY = 'bmi-calculator-history-v2';

function getCategory(bmi: number) {
  if (bmi < 18.5) return '偏瘦';
  if (bmi < 24) return '正常';
  if (bmi < 28) return '超重';
  return '肥胖';
}

function loadHistory(): BmiRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<BmiRecord[]>(loadHistory);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const category = result === null ? '' : getCategory(result);

  const healthyWeightRange = useMemo(() => {
    const h = Number(height) / 100;
    if (!Number.isFinite(h) || h <= 0) return null;
    return {
      min: 18.5 * h * h,
      max: 23.9 * h * h,
    };
  }, [height]);

  function calculate(event?: FormEvent) {
    event?.preventDefault();
    const h = Number(height);
    const w = Number(weight);

    if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || w <= 0) {
      setError('请输入有效的身高和体重。');
      setResult(null);
      return;
    }

    if (h < 50 || h > 250 || w < 10 || w > 500) {
      setError('输入值超出常见范围，请检查后重试。');
      setResult(null);
      return;
    }

    const bmi = w / Math.pow(h / 100, 2);
    setError('');
    setResult(Number(bmi.toFixed(1)));
  }

  function saveRecord() {
    if (result === null) return;

    const record: BmiRecord = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      height: Number(height),
      weight: Number(weight),
      bmi: result,
      category: getCategory(result),
    };

    setHistory((items) => [record, ...items].slice(0, 10));
  }

  const indicator = result === null
    ? 0
    : Math.max(0, Math.min(100, ((result - 14) / (36 - 14)) * 100));

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <span className="eyebrow">BMI Health Dashboard</span>
          <h1>BMI 健康仪表盘</h1>
          <p>一个使用 React + TypeScript 构建的可部署 Web App。计算 BMI、查看健康体重范围，并保存最近记录。</p>
        </div>
        <div className="badge">React App · v2</div>
      </header>

      <main className="dashboard-grid">
        <section className="panel calculator-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Calculator</span>
              <h2>计算你的 BMI</h2>
            </div>
          </div>

          <form onSubmit={calculate}>
            <div className="input-grid">
              <label>
                <span>身高</span>
                <div className="input-wrap">
                  <input
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    type="number"
                    min="50"
                    max="250"
                    step="0.1"
                    inputMode="decimal"
                  />
                  <b>cm</b>
                </div>
              </label>

              <label>
                <span>体重</span>
                <div className="input-wrap">
                  <input
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    type="number"
                    min="10"
                    max="500"
                    step="0.1"
                    inputMode="decimal"
                  />
                  <b>kg</b>
                </div>
              </label>
            </div>

            <button className="primary-button" type="submit">计算 BMI</button>
            {error && <p className="error" role="alert">{error}</p>}
          </form>

          <div className={`result-card ${result === null ? 'is-empty' : ''}`}>
            <div>
              <span className="muted">当前 BMI</span>
              <strong>{result ?? '--'}</strong>
            </div>
            <div className="result-meta">
              <span>分类</span>
              <b>{category || '等待计算'}</b>
            </div>
          </div>

          <div className="bmi-scale" aria-label="BMI 区间">
            <div className="scale-track">
              <span className="seg under" />
              <span className="seg normal" />
              <span className="seg over" />
              <span className="seg obese" />
              {result !== null && <i className="indicator" style={{ left: `${indicator}%` }} />}
            </div>
            <div className="scale-labels">
              <span>偏瘦</span><span>正常</span><span>超重</span><span>肥胖</span>
            </div>
          </div>

          {result !== null && (
            <button className="secondary-button" type="button" onClick={saveRecord}>保存本次记录</button>
          )}
        </section>

        <aside className="side-stack">
          <section className="panel insight-panel">
            <span className="section-kicker">Insight</span>
            <h2>健康体重参考</h2>
            {healthyWeightRange ? (
              <>
                <p className="big-stat">
                  {healthyWeightRange.min.toFixed(1)}–{healthyWeightRange.max.toFixed(1)} <small>kg</small>
                </p>
                <p className="muted">按当前身高和 BMI 18.5–23.9 粗略计算。</p>
              </>
            ) : (
              <p className="muted">输入身高后显示参考范围。</p>
            )}
          </section>

          <section className="panel info-panel">
            <span className="section-kicker">Reference</span>
            <h2>BMI 分类</h2>
            <ul className="reference-list">
              <li><span>偏瘦</span><b>&lt; 18.5</b></li>
              <li><span>正常</span><b>18.5–23.9</b></li>
              <li><span>超重</span><b>24.0–27.9</b></li>
              <li><span>肥胖</span><b>≥ 28.0</b></li>
            </ul>
          </section>
        </aside>
      </main>

      <section className="panel history-panel">
        <div className="panel-heading history-heading">
          <div>
            <span className="section-kicker">Local history</span>
            <h2>最近记录</h2>
          </div>
          {history.length > 0 && (
            <button className="text-button" onClick={() => setHistory([])}>清空</button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="empty-state">计算并保存后，你的最近 10 条记录会保存在当前浏览器中。</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>时间</th><th>身高</th><th>体重</th><th>BMI</th><th>分类</th></tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.createdAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{item.height} cm</td>
                    <td>{item.weight} kg</td>
                    <td><b>{item.bmi}</b></td>
                    <td>{item.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer>
        BMI 仅用于一般筛查参考，不能替代医生或其他专业医疗人员的评估。
      </footer>
    </div>
  );
}
