import { useState, useEffect } from 'react';
import quotesData from './quote.jsx';
import './App.css';

const STORAGE_KEY = 'meigen-records';

// "YYYY-MM-DD" 形式のキーを作る
function toKey(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function todayKey(date = new Date()) {
  return toKey(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDateJa(date) {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${days[date.getDay()]}）`;
}

function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('記録の読み込みに失敗しました', e);
    return {};
  }
}

function saveRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('記録の保存に失敗しました', e);
  }
}

export default function App() {
  const [view, setView] = useState('quote'); // 'quote' | 'feed'
  const [quotes, setQuotes] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [records, setRecords] = useState(() => loadRecords());
  const [currentQuote, setCurrentQuote] = useState(null);
  const [memo, setMemo] = useState('');
  const [saved, setSaved] = useState(false);

  const today = new Date();
  const key = todayKey(today);

  // 画面で使う格言データをローカルのモジュールから読み込む
  useEffect(() => {
    setQuotes(quotesData);
    setLoadError(false);
  }, []);

  // 今日の記録がすでにあればそれを表示、なければランダムに1件選ぶ
  useEffect(() => {
    if (quotes.length === 0) return;
    const existing = records[key];
    if (existing) {
      setCurrentQuote({ quote: existing.quote, author: existing.author });
      setMemo(existing.memo || '');
      setSaved(true);
    } else {
      const random = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(random);
      setMemo('');
      setSaved(false);
    }
    // quotes が読み込まれた直後の初期表示のみで良い
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotes]);

  const handleChange = () => {
    if (quotes.length < 2) return;
    let next = currentQuote;
    while (next && next.quote === currentQuote.quote) {
      next = quotes[Math.floor(Math.random() * quotes.length)];
    }
    setCurrentQuote(next);
    setSaved(false);
  };

  const handleSave = () => {
    if (!currentQuote) return;
    const next = {
      ...records,
      [key]: {
        quote: currentQuote.quote,
        author: currentQuote.author,
        memo,
      },
    };
    setRecords(next);
    saveRecords(next);
    setSaved(true);
  };

  return (
    <div className="app">
      <nav className="tabs">
        <button
          className={view === 'quote' ? 'tab tab-active' : 'tab'}
          onClick={() => setView('quote')}
        >
          格言
        </button>
        <button
          className={view === 'feed' ? 'tab tab-active' : 'tab'}
          onClick={() => setView('feed')}
        >
          フィード
        </button>
      </nav>

      {view === 'quote' ? (
        <QuotePage
          today={today}
          currentQuote={currentQuote}
          loadError={loadError}
          memo={memo}
          onMemoChange={setMemo}
          saved={saved}
          onChange={handleChange}
          onSave={handleSave}
        />
      ) : (
        <FeedPage records={records} />
      )}
    </div>
  );
}

function QuotePage({ today, currentQuote, loadError, memo, onMemoChange, saved, onChange, onSave }) {
  return (
    <div className="quote-page">
      <p className="today-date">{formatDateJa(today)}</p>

      <div className="quote-card">
        {loadError ? (
          <p className="error-text">
            格言データを読み込めませんでした。quotes.json を public フォルダに配置してください。
          </p>
        ) : currentQuote ? (
          <>
            <p className="quote-text">「{currentQuote.quote}」</p>
            <p className="quote-author">— {currentQuote.author}</p>
          </>
        ) : (
          <p className="loading-text">読み込み中…</p>
        )}
        <button className="change-btn" onClick={onChange} disabled={loadError || !currentQuote}>
          チェンジ
        </button>
      </div>

      <div className="memo-box">
        <label htmlFor="memo">今日のメモ</label>
        <textarea
          id="memo"
          value={memo}
          onChange={(e) => onMemoChange(e.target.value)}
          placeholder="この格言を受けて思ったこと、今日一日をどう過ごすか（過ごしたか）を書いてみましょう"
          rows={6}
        />
        <div className="memo-actions">
          <button className="save-btn" onClick={onSave}>
            保存する
          </button>
          {saved && <span className="saved-badge">保存済み</span>}
        </div>
      </div>
    </div>
  );
}

function FeedPage({ records }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-11
  const [selectedKey, setSelectedKey] = useState(null);

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const goPrevMonth = () => {
    setSelectedKey(null);
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    setSelectedKey(null);
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const weekdayLabels = ['日', '月', '火', '水', '木', '金', '土'];
  const selectedRecord = selectedKey ? records[selectedKey] : null;

  return (
    <div className="feed-page">
      <div className="calendar-header">
        <button className="month-nav" onClick={goPrevMonth} aria-label="前の月">
          ←
        </button>
        <p className="month-label">
          {year}年{month + 1}月
        </p>
        <button className="month-nav" onClick={goNextMonth} aria-label="次の月">
          →
        </button>
      </div>

      <div className="calendar-grid">
        {weekdayLabels.map((w) => (
          <div key={w} className="calendar-weekday">
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          if (d === null) {
            return <div key={`empty-${i}`} className="calendar-cell calendar-empty" />;
          }
          const k = toKey(year, month, d);
          const hasRecord = Boolean(records[k]);
          const isSelected = k === selectedKey;
          return (
            <button
              key={k}
              className={
                'calendar-cell' +
                (hasRecord ? ' has-record' : '') +
                (isSelected ? ' is-selected' : '')
              }
              onClick={() => setSelectedKey(k)}
            >
              <span className="calendar-day-num">{d}</span>
              {hasRecord && <span className="calendar-dot" />}
            </button>
          );
        })}
      </div>

      <div className="record-detail">
        {!selectedKey && (
          <p className="detail-hint">カレンダーの日付を選ぶと、その日の格言とメモを確認できます</p>
        )}
        {selectedKey && !selectedRecord && (
          <p className="detail-hint">この日の記録はありません</p>
        )}
        {selectedKey && selectedRecord && (
          <>
            <p className="detail-date">{selectedKey}</p>
            <p className="quote-text quote-text-small">「{selectedRecord.quote}」</p>
            <p className="quote-author">— {selectedRecord.author}</p>
            <p className="detail-memo">
              {selectedRecord.memo ? selectedRecord.memo : '（この日のメモは記録されていません）'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}