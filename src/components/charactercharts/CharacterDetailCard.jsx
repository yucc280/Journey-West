import React from 'react';

export default function CharacterDetailCard({ character }) {
  if (!character) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #fdfbf7 0%, #f4eee1 100%)', 
        color: '#27332f', 
        padding: '24px 16px', 
        borderRadius: '8px', 
        border: '1px dashed #c48d3f',
        boxShadow: '0 4px 16px rgba(100, 80, 60, 0.06)',
        fontFamily: "'Noto Serif SC', 'SimSun', serif",
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '28px',
          marginBottom: '8px',
          color: '#a33b31'
        }}>
          📜
        </div>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          color: '#a33b31', 
          fontSize: '18px', 
          fontWeight: 'bold',
          letterSpacing: '2px'
        }}>
          西游人物谱
        </h3>
        <p style={{ 
          fontSize: '12px', 
          color: '#7a7062', 
          lineHeight: '1.8', 
          margin: '0 0 14px 0' 
        }}>
          当前处于<b>【全局拓扑全景】</b>模式<br/>
          点击图中任意人物节点，可聚焦查看其履历档案、六维能力雷达与专有关系网。
        </p>
        <div style={{
          display: 'inline-block',
          fontSize: '11px',
          color: '#c48d3f',
          background: 'rgba(196, 141, 63, 0.1)',
          border: '1px solid rgba(196, 141, 63, 0.3)',
          padding: '3px 10px',
          borderRadius: '12px'
        }}>
          试试点击拓扑图中的“孙悟空”或“唐僧”
        </div>
      </div>
    );
  }

  // 阵营对应的标签配色 
  const getCampBadgeStyle = (camp) => {
    if (camp?.includes('妖')) return { bg: '#efe6f2', border: '#a57bb0', text: '#5c3169' };
    if (camp?.includes('天庭')) return { bg: '#e8f0ed', border: '#315f58', text: '#21433e' };
    if (camp?.includes('佛')) return { bg: '#f9f3e6', border: '#c48d3f', text: '#8c5d18' };
    return { bg: '#f7ebec', border: '#a33b31', text: '#a33b31' }; // 默认取经组红
  };

  const badgeStyle = getCampBadgeStyle(character.camp);

  const infoboxLabelMap = {
    alias: '别名',
    gender: '性别',
    weapon: '武器',
    法宝: '法宝',
    法术: '法术',
    武器: '武器',
    别名: '别名',
    性别: '性别'
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #fdfbf7 0%, #f4eee1 100%)', 
      color: '#27332f', 
      padding: '16px', 
      borderRadius: '8px', 
      border: '1px solid #e2d9c8',
      boxShadow: '0 4px 16px rgba(100, 80, 60, 0.08)',
      fontFamily: "'Noto Serif SC', 'SimSun', serif"
    }}>
      {/* 头部：姓名与阵营 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'baseline', 
        justifyContent: 'space-between', 
        borderBottom: '2px solid #a33b31', 
        paddingBottom: '8px', 
        marginBottom: '10px' 
      }}>
        <h2 style={{ margin: 0, color: '#a33b31', fontSize: '22px', fontWeight: 'bold' }}>
          {character.name}
        </h2>
        <span style={{ 
          background: badgeStyle.bg, 
          border: `1px solid ${badgeStyle.border}`, 
          color: badgeStyle.text, 
          padding: '2px 8px', 
          borderRadius: '4px', 
          fontSize: '11px',
          fontWeight: '500'
        }}>
          {character.camp} {character.subCamp ? `· ${character.subCamp}` : ''}
        </span>
      </div>

      {/* 简介卷轴框 */}
      {character.summary && (
        <div style={{ 
          fontSize: '12px', 
          color: '#4f483e', 
          lineHeight: '1.6', 
          background: '#f8f5ee', 
          borderLeft: '3px solid #c48d3f', 
          padding: '8px 10px', 
          borderRadius: '0 4px 4px 0', 
          marginBottom: '10px',
          maxHeight: '90px',
          overflowY: 'auto'
        }}>
          {character.summary}
        </div>
      )}

      {/* 国风标签墙 */}
      {character.categories && character.categories.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {character.categories.map(tag => (
            <span key={tag} style={{ 
              background: 'rgba(163, 59, 49, 0.08)', 
              color: '#8c2d25', 
              border: '1px solid rgba(163, 59, 49, 0.2)',
              padding: '1px 6px', 
              borderRadius: '3px', 
              fontSize: '11px' 
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Wikitext Infobox 网格对齐列表 */}
      {character.infobox && Object.keys(character.infobox).length > 0 && (
        <div style={{ 
          borderTop: '1px dashed #d5c8b3', 
          paddingTop: '8px',
          maxHeight: '160px',
          overflowY: 'auto'
        }}>
          {Object.entries(character.infobox).map(([k, v]) => {
            const label = infoboxLabelMap[k] || k;
            return (
              <div key={k} style={{ 
                display: 'grid', 
                gridTemplateColumns: '70px 1fr', 
                gap: '6px',
                padding: '3px 0', 
                fontSize: '12px',
                lineHeight: '1.4'
              }}>
                <span style={{ color: '#7a7062', textAlign: 'right' }}>{label}：</span>
                <span style={{ color: '#27332f', fontWeight: '500', wordBreak: 'break-all' }}>{v}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}