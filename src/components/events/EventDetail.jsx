export default function EventDetail({
  selectedEvent,
  onViewMap,
}) {
  if (!selectedEvent) {
    return (
      <div className="empty-detail">
        <span className="detail-number">—</span>
        <h3>尚未选择劫难</h3>
        <p>
          点击泳道图中的事件节点后，在此显示章节、地点、
          主要人物和事件简介。
        </p>
      </div>
    );
  }

  const chapterText =
    selectedEvent.startChapter === selectedEvent.endChapter
      ? `第 ${selectedEvent.startChapter} 回`
      : `第 ${selectedEvent.startChapter}—${selectedEvent.endChapter} 回`;

  return (
    <div className="trial-detail event-detail-panel">
      <div className="trial-detail-heading">
        <span>第 {selectedEvent.id} 难</span>
        <h3>{selectedEvent.name}</h3>
      </div>

      {/* 章节信息 */}
  <div className="chapter-highlight">
    <div className="chapter-number">
      第 {selectedEvent.startChapter} 回
    </div>
    <div className="chapter-title">
      {selectedEvent.chapterTitle}
    </div>
  </div>

      <div className="event-detail-info-grid">
        <div className="trial-detail-item">
          <span>章节范围</span>
          <strong>{chapterText}</strong>
        </div>

        <div className="trial-detail-item">
          <span>叙事阶段</span>
          <strong>{selectedEvent.stage}</strong>
        </div>

        <div className="trial-detail-item">
          <span>地点</span>
          <strong>{selectedEvent.location}</strong>
        </div>

        <div className="trial-detail-item">
          <span>劫难类型</span>
          <strong>{selectedEvent.displayType}</strong>
        </div>
      </div>

      {selectedEvent.originalType !==
        selectedEvent.displayType && (
        <p className="event-original-type">
          原始劫难分类：{selectedEvent.originalType}
        </p>
      )}

      <div className="trial-detail-section">
        <h4>事件简介</h4>
        <p>{selectedEvent.summary}</p>
      </div>

      <div className="trial-detail-section">
        <h4>
          主要人物
          <span className="event-character-count">
            {selectedEvent.characterCount} 人
          </span>
        </h4>

        <div className="trial-character-list">
          {selectedEvent.characters?.length > 0 ? (
            selectedEvent.characters.map((name) => (
              <span key={name}>{name}</span>
            ))
          ) : (
            <p>暂无人物信息</p>
          )}
        </div>
      </div>

      <button
        type="button"
        className="event-map-button"
        onClick={() => onViewMap?.(selectedEvent)}
      >
        在地图中查看
      </button>
    </div>
  );
}