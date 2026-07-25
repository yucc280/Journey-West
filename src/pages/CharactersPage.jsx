import React, { useState, useMemo } from 'react';
import PageHeader from '../components/common/PageHeader';
import Panel from '../components/common/Panel';

import allCharactersData from '../data/characters.json';
import CharacterNetworkChart from '../components/charactercharts/CharacterNetworkChart';
import CharacterRadarChart from '../components/charactercharts/CharacterRadarChart';
import CharacterTimelineChart from '../components/charactercharts/CharacterTimelineChart';
import CharacterDetailCard from '../components/charactercharts/CharacterDetailCard';

export default function CharactersPage() {
  const allCharacters = useMemo(() => {
    return Array.isArray(allCharactersData) ? allCharactersData : (allCharactersData.characters || []);
  }, []);

  // 初始化默认不选中任何角色，实现全景概览模式
  const [selectedName, setSelectedName] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [selectedCamp, setSelectedCamp] = useState('all');

  // 未选中角色时返回 null，传递给子组件显示空状态 / 全景引导
  const selectedChar = useMemo(() => {
    if (!selectedName) return null;
    return allCharacters.find(c => c.name === selectedName) || null;
  }, [selectedName, allCharacters]);

  const filteredCharacters = useMemo(() => {
    return allCharacters.filter(c => {
      const matchSearch = c.name.includes(searchKey) || (c.infobox?.别名 || '').includes(searchKey);
      
      let matchCamp = selectedCamp === 'all';
      if (!matchCamp) {
        if (selectedCamp === '其他') {
          const knownCamps = ['取经人', '取经团队', '天庭神仙', '佛门神仙', '妖魔'];
          matchCamp = !knownCamps.includes(c.camp);
        } else {
          matchCamp = c.camp === selectedCamp;
        }
      }

      return matchSearch && matchCamp;
    });
  }, [allCharacters, searchKey, selectedCamp]);

  return (
    <div className="page characters-page">
      <PageHeader
        eyebrow="CHARACTER ANALYSIS"
        title="人物关系与属性分析"
        description="观察人物关系拓扑网络、六维能力与登场回目分布，点击交互节点联动全图表。"
      />

      {/* 字符页专属三列网格 */}
      <div className="analysis-layout analysis-layout--characters">
        
        {/* 左侧：筛选面板与人物列表 */}
        <aside className="sidebar-stack sidebar-left">
          <Panel title="角色筛选" subtitle="按姓名或阵营快速定位">
            <div className="control-group">
              <label>
                搜索角色
                <input 
                  type="search" 
                  placeholder="如：孙悟空 / 猪八戒" 
                  value={searchKey} 
                  onChange={e => setSearchKey(e.target.value)}
                />
              </label>
            </div>

            <div className="control-group">
              <label>
                阵营归属
                <select value={selectedCamp} onChange={e => setSelectedCamp(e.target.value)}>
                  <option value="all">全部阵营</option>
                  <option value="取经人">取经人</option>
                  <option value="天庭神仙">天庭神仙</option>
                  <option value="佛门神仙">佛门神仙</option>
                  <option value="妖魔">妖魔</option>
                  <option value="其他">其他</option>
                </select>
              </label>
            </div>

            {/* 当有角色被选中时，提供重置回全景视图的按钮 */}
            {selectedName && (
              <div style={{ marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedName(null)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: 'transparent',
                    border: '1px solid #a33b31',
                    color: '#a33b31',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: "'Noto Serif SC', serif",
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#a33b31';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#a33b31';
                  }}
                >
                  ↺ 重置为全景视图
                </button>
              </div>
            )}
          </Panel>
        </aside>

        {/* 中间：主图区（网络图 + 登场分布） */}
        <main className="visual-stack main-content">
          <Panel className="network-panel" title="人物关系拓扑网络" subtitle={selectedName ? `当前选中：${selectedName}` : "点击图节点可切入角色专注模式"}>
            <div className="chart-container network-chart-container">
              <CharacterNetworkChart 
                characters={filteredCharacters} 
                selectedName={selectedName} 
                onNodeClick={setSelectedName} 
              />
            </div>
          </Panel>

          <Panel className="timeline-panel" title="角色首次登场回目分布 (1-100回)">
            <div className="chart-container timeline-chart-container">
              <CharacterTimelineChart 
                characters={filteredCharacters} 
                selectedName={selectedName} 
                onSelectName={setSelectedName} 
              />
            </div>
          </Panel>
        </main>

        {/* 右侧：人物档案 + 六维能力雷达 */}
        <aside className="sidebar-stack sidebar-right">
          <div className="detail-card-wrapper">
            <CharacterDetailCard character={selectedChar} />
          </div>

          <Panel className="radar-panel" title="能力属性雷达图">
            <div className="chart-container radar-chart-container">
              <CharacterRadarChart character={selectedChar} />
            </div>
          </Panel>
        </aside>

      </div>
    </div>
  );
}