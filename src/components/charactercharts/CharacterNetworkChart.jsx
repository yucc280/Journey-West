import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function CharacterNetworkChart({ characters = [], selectedName, onNodeClick }) {
  // 1. 阵营分类与色彩映射
  const categories = [
    { name: '取经团队', itemStyle: { color: '#a33b31' } }, // 朱红
    { name: '天庭神仙', itemStyle: { color: '#315f58' } }, // 墨绿
    { name: '佛门神仙', itemStyle: { color: '#c48d3f' } }, // 琥珀金
    { name: '妖魔鬼怪', itemStyle: { color: '#6d4c7d' } }, // 妖紫
    { name: '其他人物', itemStyle: { color: '#7f8c8d' } }  // 石青灰
  ];

  const getCategoryIndex = (camp) => {
    if (!camp) return 4;
    if (camp.includes('取经')) return 0;
    if (camp.includes('天')) return 1;
    if (camp.includes('佛')) return 2;
    if (camp.includes('妖')) return 3;
    return 4;
  };

  const charMap = new Map(characters.map(c => [c.name, c]));

  // 双向获取某个角色的所有关联人
  const getBiRelatedNames = (charName) => {
    if (!charName) return [];
    const relatedSet = new Set();

    characters.forEach(c => {
      const targets = Array.isArray(c.related_links) ? c.related_links : [];
      
      // 1. 如果当前角色是我，把他指向的人加进来
      if (c.name === charName) {
        targets.forEach(t => { if (charMap.has(t)) relatedSet.add(t); });
      }
      // 2. 如果别人指向我，把别人也加进来
      if (targets.includes(charName)) {
        relatedSet.add(c.name);
      }
    });

    return Array.from(relatedSet);
  };

  // 是否处于角色选中状态
  const hasSelection = Boolean(selectedName);

  // 2. 构建连线 Links
  const links = [];
  const addedEdges = new Set(); // 用于去重无向边

  characters.forEach(c => {
    const targets = Array.isArray(c.related_links) ? c.related_links : [];
    targets.forEach(targetName => {
      if (charMap.has(targetName)) {
        const edgeKey = [c.name, targetName].sort().join('---');

        if (!addedEdges.has(edgeKey)) {
          addedEdges.add(edgeKey);

          // 判断此线条是否与当前选中节点直接连接
          const isDirectlyConnected = hasSelection && (c.name === selectedName || targetName === selectedName);

          links.push({
            source: c.name,
            target: targetName,
            lineStyle: {
              color: isDirectlyConnected ? '#a33b31' : '#d5c8b3',
              width: isDirectlyConnected ? 2.5 : 1,
              // 未选中时全景线 0.3 透明度；选中时高亮线 0.95，其余降至 0.08
              opacity: hasSelection ? (isDirectlyConnected ? 0.95 : 0.08) : 0.3,
              curveness: 0.05
            }
          });
        }
      }
    });
  });

  // 3. 构建节点 Nodes
  const nodes = characters.map(c => {
    const isSelected = c.name === selectedName;
    const catIdx = getCategoryIndex(c.camp);
    const biRelatedList = getBiRelatedNames(c.name);

    return {
      id: c.name,
      name: c.name,
      category: catIdx,
      symbolSize: isSelected ? 38 : Math.max(16, Math.min(30, 14 + biRelatedList.length * 1.5)),
      itemStyle: {
        borderColor: isSelected ? '#ffffff' : '#fdfbf7',
        borderWidth: isSelected ? 3 : 1.5,
        shadowBlur: isSelected ? 14 : 3,
        shadowColor: isSelected ? 'rgba(163, 59, 49, 0.5)' : 'rgba(0,0,0,0.1)'
      },
      label: {
        show: isSelected || biRelatedList.length >= 5, // 关系多的核心人物或选中人物默认显示名字
        position: 'bottom',
        color: isSelected ? '#a33b31' : '#333333',
        fontSize: isSelected ? 13 : 11,
        fontWeight: isSelected ? 'bold' : 'normal',
        fontFamily: "'Noto Serif SC', serif",
        backgroundColor: 'rgba(253, 251, 247, 0.9)',
        padding: [2, 4],
        borderRadius: 3,
        distance: 5
      }
    };
  });

  // 4. ECharts 图表配置
  const getOption = () => ({
    legend: [
      {
        data: categories.map(a => a.name),
        textStyle: { color: '#4f483e', fontFamily: "'Noto Serif SC', serif", fontSize: 12 },
        top: '12px',
        left: 'center',
        itemGap: 20
      }
    ],
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(253, 251, 247, 0.98)',
      borderColor: '#a33b31',
      borderWidth: 1,
      extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.12); border-radius: 6px;',
      formatter: (params) => {
        if (params.dataType === 'node') {
          const charObj = charMap.get(params.name);
          const rels = getBiRelatedNames(params.name);
          
          return `<div style="font-family: 'Noto Serif SC', serif; padding: 2px;">
                    <b style="color: #a33b31; font-size: 15px;">${params.name}</b>
                    <span style="font-size: 11px; color: #666; margin-left: 6px;">(${charObj?.camp || '未知'})</span>
                    <div style="font-size: 12px; color: #444; margin-top: 4px;">关联人物数: <b>${rels.length}</b></div>
                    ${rels.length > 0 ? `<div style="font-size: 11px; color: #7a7062; margin-top: 4px; max-width: 240px; word-break: break-all; line-height: 1.4;">关联: ${rels.join('、')}</div>` : ''}
                  </div>`;
        }
        return `<div style="font-size: 12px; font-family: 'Noto Serif SC', serif; color: #a33b31;">
                  <b>${params.data.source}</b> ↔ <b>${params.data.target}</b>
                </div>`;
      }
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        categories: categories,
        data: nodes,
        links: links,
        roam: true,
        draggable: true,
        force: {
          repulsion: 750,
          edgeLength: 120,
          gravity: 0.04,
          friction: 0.6
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 3,
            opacity: 1
          }
        }
      }
    ]
  });

  return (
    <div style={{ height: '560px', width: '100%', position: 'relative' }}>
      <ReactECharts
        option={getOption()}
        style={{ height: '100%', width: '100%' }}
        onEvents={{
          click: (params) => {
            if (params.dataType === 'node' && onNodeClick) {
              onNodeClick(params.name);
            } else if (!params.dataType && onNodeClick) {
              // 点击空白处时，重置回到全景概览模式
              onNodeClick(null);
            }
          }
        }}
      />
    </div>
  );
}