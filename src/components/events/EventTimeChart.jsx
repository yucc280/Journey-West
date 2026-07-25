import { useMemo } from 'react';
import * as d3 from 'd3';
import {
  TYPE_COLORS,
  TYPE_ORDER,
} from './eventConfig';

export default function EventTimeChart({
  data,
  selectedType,
  selectedRange,
  onSelectRange,
  onSelectSegment,
}) {
  const width = 760;
  const height = 320;

  const margin = {
    top: 24,
    right: 20,
    bottom: 52,
    left: 42,
  };

  const xScale = useMemo(
    () =>
      d3
        .scaleBand()
        .domain(data.map((item) => item.key))
        .range([margin.left, width - margin.right])
        .padding(0.22),
    [data],
  );

  const maxValue = d3.max(data, (item) => item.total) || 1;

  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, maxValue])
        .nice()
        .range([height - margin.bottom, margin.top]),
    [maxValue],
  );

  const stackData = useMemo(() => {
    const rows = data.map((item) => ({
      key: item.key,
      ...item.typeCounts,
    }));

    return d3
      .stack()
      .keys(TYPE_ORDER)(rows);
  }, [data]);

  const yTicks = yScale.ticks(5);

  function isRangeSelected(item) {
    return (
      selectedRange?.[0] === item.start &&
      selectedRange?.[1] === item.end
    );
  }

  return (
    <div className="event-time-chart-wrapper">
      <svg
        className="event-time-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="每十回劫难数量与类型分布"
      >
        {/* 横向网格线 */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={margin.left}
              x2={width - margin.right}
              y1={yScale(tick)}
              y2={yScale(tick)}
              className="event-chart-grid"
            />

            <text
              x={margin.left - 10}
              y={yScale(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              className="event-chart-axis-text"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* 堆叠柱形 */}
        {stackData.map((series) =>
          series.map((segment, index) => {
            const bin = data[index];
            const type = series.key;

            const segmentValue =
              segment[1] - segment[0];

            if (segmentValue === 0) {
              return null;
            }

            const selected =
              selectedType === type ||
              isRangeSelected(bin);

            return (
              <g
                key={`${type}-${bin.key}`}
                className="event-time-segment"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectSegment(bin, type);
                }}
              >
                <title>
                  {bin.label}回｜{type}：
                  {segmentValue}难
                </title>

                <rect
                  x={xScale(bin.key)}
                  y={yScale(segment[1])}
                  width={xScale.bandwidth()}
                  height={
                    yScale(segment[0]) -
                    yScale(segment[1])
                  }
                  fill={TYPE_COLORS[type]}
                  opacity={
                    selectedType === '全部' || selected
                      ? 0.88
                      : 0.22
                  }
                />
              </g>
            );
          }),
        )}

        {/* 点击整个区间的透明区域
        {data.map((item) => (
          <rect
            key={`range-${item.key}`}
            x={xScale(item.key)}
            y={margin.top}
            width={xScale.bandwidth()}
            height={
              height - margin.top - margin.bottom
            }
            fill="transparent"
            className="event-time-range-hitbox"
            onClick={() => onSelectRange(item)}
          >
            <title>
              第{item.label}回，共{item.total}难
            </title>
          </rect>
        ))} */}

        {/* 横轴文字 */}
        {data.map((item) => (
          <text
            key={`label-${item.key}`}
            x={
              xScale(item.key) +
              xScale.bandwidth() / 2
            }
            y={height - margin.bottom + 24}
            textAnchor="middle"
            className={
              isRangeSelected(item)
                ? 'event-chart-axis-text event-chart-axis-text--selected'
                : 'event-chart-axis-text event-chart-axis-text--clickable'
            }
            onClick={() => onSelectRange(item)}
          >
            {item.label}
          </text>
        ))}        
        
        <text
          x={16}
          y={height / 2}
          textAnchor="middle"
          className="event-chart-axis-title"
          transform={`rotate(-90 16 ${height / 2})`}
        >
          劫难数量
        </text>
      </svg>

      <div className="event-time-legend">
        {TYPE_ORDER.map((type) => (
          <span key={type}>
            <i
              style={{
                backgroundColor: TYPE_COLORS[type],
              }}
            />
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}