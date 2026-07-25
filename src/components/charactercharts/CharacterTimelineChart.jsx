import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function CharacterTimelineChart({ characters = [], selectedName, onSelectName }) {
  // 阵营色彩映射
  const campColors = {
    '取经人': '#a33b31',
    '取经团队': '#a33b31',
    '天庭神仙': '#315f58',
    '佛门神仙': '#c48d3f',
    '妖魔鬼怪': '#6d4c7d',
    '其他人物': '#7f8c8d'
  };

  // 1. 构建散点数据，加入纵向防重叠错位 
  const chapterCounts = {};

  const seriesData = characters
    .filter(c => typeof c.firstChapter === 'number')
    .map(c => {
      const isSelected = c.name === selectedName;
      const ch = c.firstChapter;
      
      // 计算当前回目的重叠次数，纵向交错抬高（Y 轴从 1 到 5 循环交错）
      chapterCounts[ch] = (chapterCounts[ch] || 0) + 1;
      const yOffset = ((chapterCounts[ch] - 1) % 4) * 1.2 + 1; 

      const campKey = Object.keys(campColors).find(k => c.camp?.includes(k) || c.subCamp?.includes(k)) || '其他人物';
      const color = campColors[campKey];

      return {
        name: c.name,
        value: [ch, yOffset, c.camp || '未知阵营'],
        symbolSize: isSelected ? 22 : 14,
        z: isSelected ? 10 : 2, // 选中的节点渲染在最上层
        itemStyle: {
          color: isSelected ? '#a33b31' : color,
          borderColor: isSelected ? '#ffffff' : '#fdfbf7',
          borderWidth: isSelected ? 3 : 1.5,
          shadowBlur: isSelected ? 10 : 2,
          shadowColor: isSelected ? 'rgba(163, 59, 49, 0.5)' : 'rgba(0,0,0,0.15)'
        },
        label: {
          show: true,
          formatter: c.name,
          position: 'top',
          distance: 6,
          color: isSelected ? '#a33b31' : '#4f483e',
          fontSize: isSelected ? 12 : 10,
          fontWeight: isSelected ? 'bold' : 'normal',
          fontFamily: "'Noto Serif SC', serif",
          backgroundColor: isSelected ? 'rgba(253, 251, 247, 0.95)' : 'rgba(253, 251, 247, 0.85)',
          padding: [2, 5],
          borderRadius: 3,
          borderColor: isSelected ? '#a33b31' : '#e2d9c8',
          borderWidth: 1
        }
      };
    });

  // 2. 配置 ECharts Option
  const getOption = () => ({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(253, 251, 247, 0.98)',
      borderColor: '#a33b31',
      extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.12); border-radius: 6px;',
      formatter: (params) => {
        const charName = params.data.name;
        const chapter = params.data.value[0];
        const camp = params.data.value[2];
        return `<div style="font-family: 'Noto Serif SC', serif; padding: 2px;">
                  <b style="color:#a33b31; font-size: 14px;">${charName}</b> 
                  <span style="font-size:11px; color:#666;">(${camp})</span><br/>
                  首次登场：<span style="color:#c48d3f; font-weight:bold;">第 ${chapter} 回</span>
                </div>`;
      }
    },
    grid: {
      top: '15%',
      bottom: '22%',
      left: '5%',
      right: '8%'
    },
    xAxis: {
      type: 'value',
      name: '回目',
      min: 1,
      max: 100,
      interval: 10,
      nameLocation: 'end',
      nameTextStyle: { color: '#7a7062', fontSize: 11, fontFamily: "'Noto Serif SC', serif" },
      axisLine: { lineStyle: { color: '#b2a593' } },
      splitLine: { lineStyle: { type: 'dashed', color: '#ece5d8' } },
      axisLabel: { color: '#4f483e', fontFamily: "'Noto Serif SC', serif", fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      show: false, // 隐藏 Y 轴，仅用于交错防重叠
      min: 0,
      max: 6
    },
    series: [
      {
        type: 'scatter',
        data: seriesData,
        animationDuration: 500,
        // 防止标签相互重叠覆盖
        labelLayout: {
          hideOverlap: true
        }
      }
    ]
  });

  return (
    <div style={{ height: '220px', width: '100%' }}>
      <ReactECharts
        option={getOption()}
        style={{ height: '100%', width: '100%' }}
        onEvents={{
          click: (params) => {
            if (params.data && params.data.name && onSelectName) {
              onSelectName(params.data.name);
            }
          }
        }}
      />
    </div>
  );
}