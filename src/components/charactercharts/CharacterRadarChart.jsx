import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function CharacterRadarChart({ character }) {
  if (!character || !character.radar_stats) {
    return (
      <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '12px' }}>
        暂无该角色的能力数据
      </div>
    );
  }

  // 1. 提取雷达维度数据
  const stats = character.radar_stats;
  const indicator = Object.keys(stats).map(key => ({
    name: key,
    max: 100
  }));
  const values = Object.values(stats);

  // 2. 根据阵营匹配雷达图的主色调
  const getRadarColor = (camp) => {
    if (camp?.includes('妖')) return { line: '#8e44ad', area: 'rgba(142, 68, 173, 0.25)' };
    if (camp?.includes('天')) return { line: '#315f58', area: 'rgba(49, 95, 88, 0.25)' };
    if (camp?.includes('佛')) return { line: '#c48d3f', area: 'rgba(196, 141, 63, 0.25)' };
    return { line: '#a33b31', area: 'rgba(163, 59, 49, 0.25)' }; // 默认取经组朱红
  };

  const themeColor = getRadarColor(character.camp);

  const getOption = () => ({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(253, 251, 247, 0.95)',
      borderColor: themeColor.line,
      textStyle: { color: '#27332f', fontFamily: "'Noto Serif SC', serif" }
    },
    radar: {
      indicator: indicator,
      shape: 'polygon',
      splitNumber: 4,
      radius: '65%',
      center: ['50%', '52%'],
      axisName: {
        color: '#4f483e',
        fontSize: 11,
        fontFamily: "'Noto Serif SC', serif",
        fontWeight: 'bold'
      },
      splitLine: {
        lineStyle: {
          color: ['#e2d9c8', '#ece5d8', '#f2ece0', '#f8f5ee']
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(253, 251, 247, 0.8)', 'rgba(244, 238, 225, 0.5)']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#d5c8b3'
        }
      }
    },
    series: [
      {
        name: `${character.name} 能力属性`,
        type: 'radar',
        data: [
          {
            value: values,
            name: character.name,
            symbol: 'circle',
            symbolSize: 5,
            itemStyle: {
              color: themeColor.line
            },
            lineStyle: {
              color: themeColor.line,
              width: 2
            },
            areaStyle: {
              color: themeColor.area
            }
          }
        ]
      }
    ]
  });

  return (
    <div style={{ height: '240px', width: '100%' }}>
      <ReactECharts option={getOption()} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}