import Panel from '../common/Panel';

export default function TopLocationsChart({
  locations,
  repeatedCount,
  maxCount
}) {
  const chartMax = Math.max(
    ...locations.map((item) => item.count),
    1
  );

  return (
    <Panel
      title="高频劫难地点"
      subtitle="当前劫难类别下按同一地点发生的劫难数量排序，其中聚集地点指发生多起劫难的地点"
      className="top-locations-panel"
    >
      <div className="top-locations-content">
        <div className="top-locations-list">
          {locations.map((item, index) => (
            <div
              className="top-location-item"
              key={`${item.name}-${index}`}
            >
              <span className="top-location-rank">
                {String(index + 1).padStart(2, '0')}
              </span>

              <strong className="top-location-name">
                {item.name}
              </strong>

              <div className="top-location-track">
                <div
                  className="top-location-bar"
                  style={{
                    width: `${(item.count / chartMax) * 100}%`
                  }}
                />
              </div>

              <span className="top-location-count">
                {item.count} 难
              </span>
            </div>
          ))}
        </div>

        <div className="top-locations-summary">
          <div>
            <span>聚集地点</span>
            <strong>{repeatedCount}</strong>
          </div>

          <div>
            <span>最多劫难数</span>
            <strong>{maxCount} 难</strong>
          </div>
        </div>
      </div>
    </Panel>
  );
}