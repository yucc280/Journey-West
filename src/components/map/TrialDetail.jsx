export default function TrialDetail({ selectedTrial }) {
  if (!selectedTrial) {
    return (
      <div className="empty-detail">
        <span className="detail-number">—</span>
        <h3>尚未选择地点</h3>
        <p>
          选择地图中的劫难点位后，在此显示地点、人物和故事摘要。
        </p>
      </div>
    );
  }

  return (
    <div className="trial-detail">
      <div className="trial-detail-heading">
        <span>第 {selectedTrial.编号} 难</span>
        <h3>{selectedTrial.名称}</h3>
      </div>

      <div className="trial-detail-item">
        <span>地点</span>
        <strong>{selectedTrial.地点}</strong>
      </div>

      <div className="trial-detail-item">
        <span>劫难类型</span>
        <strong>{selectedTrial.劫难类型}</strong>
      </div>

      <div className="trial-detail-section">
        <h4>事件简介</h4>
        <p>{selectedTrial.简介}</p>
      </div>

      <div className="trial-detail-section">
        <h4>主要人物</h4>

        <div className="trial-character-list">
          {selectedTrial.主要人物.length > 0 ? (
            selectedTrial.主要人物.map((name) => (
              <span key={name}>{name}</span>
            ))
          ) : (
            <p>暂无人物信息</p>
          )}
        </div>
      </div>

    </div>
  );
}