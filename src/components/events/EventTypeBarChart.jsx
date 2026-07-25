import { useMemo } from 'react';
import * as d3 from 'd3';
import {
  TYPE_COLORS,
} from './eventConfig';

export default function EventTypeBarChart({
  data,
  selectedType,
  highlightedType,
  onSelectType,
}) {
  const width = 700;
  const height = 330;

  const margin = {
    top: 22,
    right: 92,
    bottom: 30,
    left: 92,
  };

  const maxCount =
    d3.max(data, (item) => item.count) || 1;

  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, maxCount])
        .nice()
        .range([margin.left, width - margin.right]),
    [maxCount],
  );

  const yScale = useMemo(
    () =>
      d3
        .scaleBand()
        .domain(data.map((item) => item.type))
        .range([margin.top, height - margin.bottom])
        .padding(0.3),
    [data],
  );

  const ticks = xScale.ticks(5);
  const total = d3.sum(data, (item) => item.count);

  function isSelected(type) {
    return selectedType === type;
  }

  function isHighlighted(type) {
    return highlightedType === type;
  }

  function getOpacity(type) {
    if (selectedType !== '全部') {
      return isSelected(type) ? 1 : 0.3;
    }

    if (highlightedType) {
      return isHighlighted(type) ? 1 : 0.55;
    }

    return 0.88;
  }

  return (
    <div className="event-type-chart-wrapper">
      <svg
        className="event-type-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="劫难类型数量分布"
      >
        {/* 纵向网格线 */}
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={xScale(tick)}
              x2={xScale(tick)}
              y1={margin.top}
              y2={height - margin.bottom}
              className="event-chart-grid"
            />

            <text
              x={xScale(tick)}
              y={height - 8}
              textAnchor="middle"
              className="event-chart-axis-text"
            >
              {tick}
            </text>
          </g>
        ))}

        {data.map((item) => {
          const color =
            TYPE_COLORS[item.type] ?? '#7f7568';

          const selected = isSelected(item.type);
          const highlighted =
            isHighlighted(item.type);

          const percentage =
            total > 0
              ? (item.count / total) * 100
              : 0;

          return (
            <g
              key={item.type}
              className="event-type-bar-group"
              onClick={() => onSelectType(item.type)}
              opacity={getOpacity(item.type)}
            >
              <title>
                {item.type}
                {'\n'}
                事件数量：{item.count}
                {'\n'}
                当前占比：{percentage.toFixed(1)}%
                {'\n'}
                平均参与人物：
                {item.avgCharacters.toFixed(1)}人
                {item.minChapter !== null
                  ? `\n涉及章节：${item.minChapter}—${item.maxChapter}回`
                  : ''}
              </title>

              {/* 左侧类型名称 */}
              <text
                x={margin.left - 14}
                y={
                  yScale(item.type) +
                  yScale.bandwidth() / 2
                }
                textAnchor="end"
                dominantBaseline="middle"
                className="event-type-label"
                fill={color}
              >
                {item.type}
              </text>

              {/* 背景轨道 */}
              <rect
                x={margin.left}
                y={yScale(item.type)}
                width={
                  width -
                  margin.left -
                  margin.right
                }
                height={yScale.bandwidth()}
                rx={8}
                fill="rgba(66, 92, 84, 0.07)"
              />

              {/* 数据条形 */}
              <rect
                x={margin.left}
                y={yScale(item.type)}
                width={Math.max(
                  item.count > 0 ? 4 : 0,
                  xScale(item.count) - margin.left,
                )}
                height={yScale.bandwidth()}
                rx={8}
                fill={color}
                stroke={
                  selected || highlighted
                    ? '#4a302b'
                    : 'transparent'
                }
                strokeWidth={
                  selected || highlighted ? 2 : 0
                }
                className="event-type-bar"
              />

              {/* 数量 */}
              <text
                x={
                  xScale(item.count) +
                  10
                }
                y={
                  yScale(item.type) +
                  yScale.bandwidth() / 2 -
                  5
                }
                dominantBaseline="middle"
                className="event-type-count"
              >
                {item.count} 难
              </text>

              {/* 占比 */}
              <text
                x={
                  xScale(item.count) +
                  10
                }
                y={
                  yScale(item.type) +
                  yScale.bandwidth() / 2 +
                  10
                }
                dominantBaseline="middle"
                className="event-type-percent"
              >
                {percentage.toFixed(1)}%
              </text>
            </g>
          );
        })}
      </svg>

      <p className="event-type-chart-note">
        当前章节范围共统计 {total} 项劫难，点击条形可筛选或取消对应类型。
      </p>
    </div>
  );
}