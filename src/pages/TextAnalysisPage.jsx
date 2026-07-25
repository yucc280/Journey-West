import React, { useState, useMemo } from 'react';
import PageHeader from '../components/common/PageHeader';
import Panel from '../components/common/Panel';

import SentimentLineChart from '../components/textcharts/SentimentLineChart';
import WordTrendChart from '../components/textcharts/WordTrendChart';
import WordRankBarChart from '../components/textcharts/WordRankBarChart';
import WordCloudChart from '../components/textcharts/WordCloudChart';

import chapterWord from '../data/chapterWord.json';
import chapterSentiment from '../data/chapterSentiment.json';
import rawTextData from '../data/chapterRawText.json';

import '../styles/textAnalysis.css';

const CLASSIC_CHAPTERS = [
  { name: '全书概览', range: [1, 100] },
  { name: '大闹天宫', range: [1, 7] },
  { name: '西天取经', range: [8, 12] },
  { name: '三打白骨精', range: [27, 29] },
  { name: '真假美猴王', range: [56, 58] },
  { name: '火焰山', range: [59, 61] }
];

export default function TextAnalysisPage() {
  const [startChap, setStartChap] = useState(1);
  const [endChap, setEndChap] = useState(100);
  const [compareWords, setCompareWords] = useState(['孙悟空', '唐僧', '八戒']);
  
  const [selectedChapter, setSelectedChapter] = useState(1);

  const handleQuickPreset = (range) => {
    setStartChap(range[0]);
    setEndChap(range[1]);
  };

  // 1. 聚合词频数据
  const wordCountMap = useMemo(() => {
    const map = {};
    chapterWord.forEach(ch => {
      if (ch.chapter < startChap || ch.chapter > endChap) return;
      ch.wordList.forEach(({ word, count }) => {
        map[word] = (map[word] || 0) + count;
      });
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [startChap, endChap]);

  const topWords = wordCountMap.slice(0, 10);
  const cloudWords = wordCountMap.slice(0, 80);

  // 2. 关键词趋势数据
  const trendX = useMemo(() => {
    const arr = [];
    for (let i = startChap; i <= endChap; i++) arr.push(i);
    return arr;
  }, [startChap, endChap]);

  const trendSeries = useMemo(() => {
    return compareWords.map(word => {
      const data = trendX.map(ch => {
        const item = chapterWord.find(d => d.chapter === ch);
        const w = item?.wordList?.find(x => x.word === word);
        return w ? w.count : 0;
      });
      return { name: word, data };
    });
  }, [compareWords, trendX]);

  // 3. 过滤情感趋势数据
  const filteredSentiment = useMemo(() => {
    return chapterSentiment.filter(
      item => item.chapter >= startChap && item.chapter <= endChap
    );
  }, [startChap, endChap]);

  // 4. 原文精准防呆匹配
  const currentChapterRaw = useMemo(() => {
    if (selectedChapter === null || selectedChapter === undefined) return null;
    
    const targetNum = parseInt(String(selectedChapter).replace(/[^\d]/g, ''), 10);
    if (isNaN(targetNum)) return null;

    return rawTextData.find(item => Number(item.chapter) === targetNum);
  }, [selectedChapter]);

  const handleWordClick = (word) => {
    setCompareWords(prev => {
      if (prev.includes(word)) return prev;
      if (prev.length < 3) return [...prev, word];
      return [prev[1], prev[2], word];
    });
  };

  return (
    <div className="page text-analysis-page">
      <PageHeader
        eyebrow="TEXT & SENTIMENT"
        title="章节词频与情感分析"
        description="比较章节关键词、情感倾向与冲突强度，并从统计结果回溯到原文片段。"
      />

      <div className="analysis-grid">
        {/* 左列：章节筛选 + 高频词云  */}
        <div className="grid-column">
          <Panel title="章节快速筛选">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* 显示当前区间 */}
              <div className="range-display-box">
                <span className="range-display-label">当前范围</span>
                <strong className="range-display-value">第 {startChap} — {endChap} 回</strong>
              </div>

              {/* 经典剧情 Tag 快选 */}
              <div>
                <div className="preset-section-title">经典剧情快选：</div>
                <div className="preset-tags-container">
                  {CLASSIC_CHAPTERS.map(preset => {
                    const isActive = startChap === preset.range[0] && endChap === preset.range[1];
                    return (
                      <button
                        key={preset.name}
                        onClick={() => handleQuickPreset(preset.range)}
                        className={`preset-tag-btn ${isActive ? 'active' : ''}`}
                      >
                        {preset.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 滑块微调 */}
              <div className="slider-control-group">
                <div className="slider-item">
                  <label className="slider-label">起始: {startChap}回</label>
                  <input
                    type="range"
                    min="1"
                    max={endChap}
                    value={startChap}
                    onChange={(e) => setStartChap(Number(e.target.value))}
                    className="slider-input"
                  />
                </div>
                <div className="slider-item">
                  <label className="slider-label">结束: {endChap}回</label>
                  <input
                    type="range"
                    min={startChap}
                    max="100"
                    value={endChap}
                    onChange={(e) => setEndChap(Number(e.target.value))}
                    className="slider-input"
                  />
                </div>
              </div>

            </div>
          </Panel>

          <Panel title="全书高频词云" subtitle="点击词汇加入右侧对比">
            <WordCloudChart 
              wordData={cloudWords} 
              height={400} 
              onWordClick={handleWordClick} 
            />
          </Panel>
        </div>

        {/* === 中列：情感折线图 + 趋势图 === */}
        <div className="grid-column">
          <Panel title="章节情感与冲突趋势" subtitle="点击折线点可右侧调阅原文。">
            <SentimentLineChart 
              chartData={filteredSentiment} 
              height={270} 
              onSelectChapter={(chap) => setSelectedChapter(chap)}
            />
          </Panel>

          <Panel 
            title="关键词趋势演变" 
            subtitle={`当前追踪：${compareWords.join(' vs ') || '暂无'} (最多3个)`}
          >
            <WordTrendChart 
              seriesData={trendSeries} 
              xAxisData={trendX} 
              height={260} 
            />
          </Panel>
        </div>

        {/* === 右列：高频词 TOP 10 + 原文回溯 === */}
        <div className="grid-column">
          <Panel title="当前范围高频词 TOP 10" subtitle="点击词语加入对比">
            <WordRankBarChart 
              wordRankData={topWords} 
              height={260} 
              onWordClick={handleWordClick} 
            />
          </Panel>

          <Panel title="原文回溯" subtitle="点击图表章节节点更新">
            <div className="raw-text-container">
              {selectedChapter && currentChapterRaw ? (
                <div>
                  <h4 className="raw-text-title">
                    第 {currentChapterRaw.chapter} 回 原文片段
                  </h4>
                  <p className="raw-text-paragraph">
                    “{currentChapterRaw.content}”
                  </p>
                </div>
              ) : (
                <div className="raw-text-placeholder">
                  点击中间折线图上的章节节点，在此处动态调阅对应回目的原文片段。
                </div>
              )}
            </div>
          </Panel>
        </div>

      </div>
    </div>
  );
}
