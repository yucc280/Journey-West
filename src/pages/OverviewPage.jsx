import React from 'react';
import { Link } from 'react-router-dom';
import AudioVisualizer from '../components/overview/AudioVisualizer';
import AIChatAssistant from '../components/overview/AIChatAssistant';
import '../styles/overview.css';

export default function OverviewPage() {
  const stats = [
    { label: '原著篇幅', value: '100', unit: '回', note: '从石猴出世到五圣成真' },
    { label: '九九归一', value: '81', unit: '难', note: '历经千山万水之劫难' },
    { label: '西行路途', value: '10.8', unit: '万公里', note: '长安至天竺灵山大雷音寺' },
    { label: '登场人物', value: '500+', unit: '位', note: '包含仙佛、妖怪与凡人' },
  ];

  const subPages = [
    {
      title: '地理路线',
      path: '/map',
      desc: '踏遍十万八千里，交互式重现师徒四人的西行空间轨迹与重山复水。',
      tag: '空间地图',
    },
    {
      title: '八十一难',
      path: '/events',
      desc: '解构九九八十一难的叙事分布，结合全书章节探究劫难类型、叙事阶段与事件密度。',
      tag: '叙事分布',
    },
    {
      title: '人物关系',
      path: '/characters',
      desc: '构建庞大的西游关系网络，探索仙界、佛界、妖界与人间错综复杂的人际联结。',
      tag: '网络图谱',
    },
    {
      title: '词频情感',
      path: '/text-analysis',
      desc: '基于原著百回文本的 NLP 挖掘，分析情节高潮的情感波动与高频意象。',
      tag: '文本挖掘',
    },
  ];

  return (
    <div className="overview-page">
      {/* 1. 顶部 Hero 巨幕区（夕阳剪影大图） */}
      <section
        className="hero-banner"
        style={{ backgroundImage: `url(/media/west-silhouette.jpg)` }}
      >
        <div className="hero-mask">
          <div className="hero-content">
            <span className="hero-badge">西游记多维数据可视化分析系统</span>
            <h1 className="hero-title">循西行之迹 · 观百回之变</h1>
            <p className="hero-description">
              “踏过坎坷成大道，斗罢艰险又出发。” 结合数据可视化与现代 AI 大模型，全方位解构古典名著《西游记》的叙事魅力。
            </p>
          </div>
        </div>
      </section>

      {/* 2. 国风数据指标大盘 */}
      <section className="stats-grid">
        {stats.map((item, idx) => (
          <div className="stat-card" key={idx}>
            <div className="stat-header">
              <span className="stat-label">{item.label}</span>
              <span className="stat-unit">{item.unit}</span>
            </div>
            <div className="stat-value">{item.value}</div>
            <div className="stat-note">{item.note}</div>
          </div>
        ))}
      </section>

      {/* 3. 中部核心双区：音频可视化 + 工笔画卷 */}
      <section className="interactive-grid">
        <div className="visualizer-wrapper">
          <AudioVisualizer audioSrc="/media/music.mp3" />
        </div>

        <div className="art-intro-wrapper">
          <div className="art-card">
            <img
              src="/media/west-characters.jpg"
              alt="西游师徒工笔重彩"
              className="art-img"
            />
            <div className="art-content">
              <h3>典籍多维探微</h3>
              <p>
                这是一个面向文学文本探索的交互式可视分析系统，从<strong>地理</strong>、<strong>难关</strong>、<strong>人物关系</strong>与<strong>情感词频</strong>四大维度入手，打破传统阅读方式，带你以全新的视角审视《西游记》这部东方奇幻史诗。
              </p>
              <div className="art-tag-list">
                <span>D3.js / ECharts 驱动</span>
                <span>全文本 NLP 情感分析</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 四大核心分析板块 */}
      <section className="navigation-section">
        <h2 className="section-title">四大核心分析板块</h2>
        <div className="nav-cards-grid">
          {subPages.map((page, idx) => (
            <Link to={page.path} className="nav-card" key={idx}>
              <div className="nav-card-header">
                <span className="nav-card-title">{page.title}</span>
                <span className="nav-card-tag">{page.tag}</span>
              </div>
              <p className="nav-card-desc">{page.desc}</p>
              <div className="nav-card-action">探索此维度 →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. 底部全宽：AI 大模型智囊 */}
      <section className="ai-assistant-section">
        <AIChatAssistant />
      </section>
    </div>
  );
}