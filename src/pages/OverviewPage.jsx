import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Panel from '../components/common/Panel';
import PlaceholderChart from '../components/common/PlaceholderChart';
import ChapterRangeControl from '../components/common/ChapterRangeControl';
import { overviewStats, pageEntries } from '../data/mockData';

export default function OverviewPage() {
  return (
    <div className="page overview-page">
      <section className="hero-section">
        <PageHeader
          eyebrow="《西游记》多维可视分析系统"
          title="循西行之迹，观百回之变"
          description="从空间路线、八十一难、人物关系与文本情绪四个维度，探索《西游记》的叙事结构。"
          actions={<ChapterRangeControl />}
        />
      </section>

      <section className="metric-grid">
        {overviewStats.map((item) => (
          <article className="metric-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.note}</small>
          </article>
        ))}
      </section>

      <Panel
        title="百回叙事总览"
        subtitle="后续接入真实章节数据，可切换人物数、事件数、词数与冲突强度。"
        toolbar={<button type="button" className="text-button">指标：出场人物数</button>}
      >
        <PlaceholderChart
          type="timeline"
          title="章节时间轴占位区域"
          description="这里预留给 D3 折线图、柱状图或章节刷选时间轴。"
        />
      </Panel>

      <section className="entry-grid">
        {pageEntries.map((entry) => (
          <Link to={entry.path} className="entry-card" key={entry.path}>
            <span className="entry-index">{entry.index}</span>
            <span className="entry-meta">{entry.meta}</span>
            <h2>{entry.title}</h2>
            <p>{entry.text}</p>
            <span className="entry-link">进入分析 →</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
