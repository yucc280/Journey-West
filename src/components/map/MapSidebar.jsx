import Panel from '../common/Panel';

export default function MapSidebar({
  selectedType,
  setSelectedType,
  eventTypes,
  currentTrial,
  currentTrialIndex,
  totalTrials,
  progress,
  isPlaying,
  onTogglePlay,
  onPrevious,
  onNext,
  onReset,
  trialsCount,
  validCount,
  filteredCount,
  locationCount
}) {
  return (
    <aside className="sidebar-stack">
      <Panel
        title="西行进度"
        subtitle="按照八十一难顺序探索"
      >
        <div className="journey-current">
          <span>当前劫难</span>

          <strong>
            {currentTrial
              ? `第 ${currentTrial.编号} 难`
              : '尚未开始'}
          </strong>

          <h3>
            {currentTrial?.名称 || '等待数据加载'}
          </h3>

          <p>
            {currentTrial
              ? `${currentTrial.地点} · ${currentTrial.劫难类型}`
              : '—'}
          </p>
        </div>

        <div className="journey-progress">
          <div className="journey-progress-header">
            <span>取经进度</span>

            <strong>
              {totalTrials > 0
                ? `${currentTrialIndex + 1} / ${totalTrials}`
                : '0 / 0'}
            </strong>
          </div>

          <div className="journey-progress-track">
            <div
              className="journey-progress-value"
              style={{
                width: `${progress}%`
              }}
            />
          </div>

          <small>
            已完成 {Math.round(progress)}%
          </small>
        </div>

        <div className="journey-main-controls">
          <button
            type="button"
            onClick={onTogglePlay}
            disabled={totalTrials === 0}
          >
            {isPlaying
              ? '⏸ 暂停'
              : '▶ 播放'}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={totalTrials === 0}
          >
            ↺ 重置
          </button>
        </div>

        <div className="journey-step-controls">
          <button
            type="button"
            onClick={onPrevious}
            disabled={currentTrialIndex <= 0}
          >
            ← 上一难
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={
              currentTrialIndex >= totalTrials - 1
            }
          >
            下一难 →
          </button>
        </div>

        <div className="control-group">
          <label htmlFor="trial-type">
            劫难类型
          </label>

          <select
            id="trial-type"
            value={selectedType}
            onChange={(event) =>
              setSelectedType(event.target.value)
            }
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="map-stat-list">
          <div>
            <span>劫难总数</span>
            <strong>{trialsCount}</strong>
          </div>

          <div>
            <span>地点点位</span>
            <strong>{locationCount}</strong>
          </div>

          <div>
            <span>当前显示</span>
            <strong>{filteredCount}</strong>
          </div>
        </div>
      </Panel>

      <div className="note-card map-guide-card">
        <strong>使用说明</strong>
          <p>
            <span>01 </span>
            播放路线可依次查看第一难至第八十一难。
          </p>
          <p>
            <span>02 </span>
            点击聚合点可查看同一地点发生的多次劫难。
          </p>
          <p>
            <span>03 </span>
            劫难类型筛选会同步更新地图点位与统计数据。地点点位是包括长安的去重坐标。
          </p>
      </div>

    </aside>
  );
}

