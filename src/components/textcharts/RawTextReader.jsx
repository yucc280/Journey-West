import React from 'react';

const RawTextReader = ({ chapter, rawTextData, highlightWord }) => {
  const currentItem = rawTextData?.find(item => item.chapter === Number(chapter));

  // 高亮显示选中的关键词
  const renderHighlightedContent = (content, word) => {
    if (!word || !content) return content;
    const parts = content.split(new RegExp(`(${word})`, 'gi'));
    return parts.map((part, index) =>
      part === word ? (
        <mark key={index} style={{ backgroundColor: '#fadb14', padding: '0 2px', borderRadius: '2px', fontWeight: 'bold' }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {currentItem ? (
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#8b261d', marginBottom: '8px' }}>
            第 {currentItem.chapter} 回 原文摘要
          </div>
          <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#444', textAlign: 'justify' }}>
            {renderHighlightedContent(currentItem.content, highlightWord)}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '13px' }}>
           点击折线图或高频词，在此调阅对应回目的原文片段。
        </div>
      )}
    </div>
  );
};

export default RawTextReader;