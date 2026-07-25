import { useMemo } from 'react';
import * as d3 from 'd3';

export const TYPE_COLORS = {
  神佛考验: '#c69a44',
  身份伪装: '#7c67a7',
  妖怪袭击: '#b94f47',
  道路阻隔: '#3f8294',
  师徒心性: '#53856b',
  身世劫难: '#b8753f',
};

export const TYPE_LIGHT_COLORS = {
  神佛考验: '#ead8ad',
  身份伪装: '#d8d0e8',
  妖怪袭击: '#e6b8b3',
  道路阻隔: '#b8d3da',
  师徒心性: '#bed5c7',
  身世劫难: '#dfc2a6',
};

function assignStackInfo(events) {
  const groups = d3.group(
    events,
    event => `${event.displayType}-${event.startChapter}`,
  );

  return events.map(event => {
    const key = `${event.displayType}-${event.startChapter}`;
    const group = groups.get(key) ?? [event];
    const stackIndex = group.findIndex(item => item.id === event.id);

    return {
      ...event,
      stackIndex,
      stackSize: group.length,
    };
  });
}

export default function EventSwimlane({
  events,
  allTypes,
  selectedEvent,
  onSelectEvent,
  chapterRange,
}) {
  const width = 1000;
  // const height = Math.max(520, allTypes.length * 78 + 110);

  const margin = {
    top: 20,
    right: 18,
    bottom: 56,
    left: 90,
  };

  const laneHeight = 78;
const height = margin.top + margin.bottom + allTypes.length * laneHeight;

  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain(chapterRange)
        .range([margin.left, width - margin.right]),
    [chapterRange],
  );

  const yScale = useMemo(
    () =>
      d3
        .scaleBand()
        .domain(allTypes)
        .range([margin.top, height - margin.bottom])
        .padding(0.25),
    [allTypes, height],
  );

  const stackedEvents = useMemo(
    () => assignStackInfo(events),
    [events],
  );

  const chapterTicks = useMemo(() => {
    const [start, end] = chapterRange;
    const tickStep = end - start > 50 ? 10 : 5;

    const ticks = [];
    const firstTick = Math.ceil(start / tickStep) * tickStep;

    if (start === 1) {
      ticks.push(1);
    }

    for (
      let chapter = firstTick;
      chapter <= end;
      chapter += tickStep
    ) {
      ticks.push(chapter);
    }

    if (!ticks.includes(end)) {
      ticks.push(end);
    }

    return [...new Set(ticks)];
  }, [chapterRange]);

  function getEventY(event) {
    const baseY =
      yScale(event.displayType) + yScale.bandwidth() / 2;

    const spacing = 10;
    const offset =
      (event.stackIndex - (event.stackSize - 1) / 2) * spacing;

    return baseY + offset;
  }

  function isSelected(event) {
    return selectedEvent?.id === event.id;
  }

  function getOpacity(event) {
    if (!selectedEvent) {
      return 0.88;
    }

    return isSelected(event) ? 1 : 0.28;
  }

  if (events.length === 0) {
    return (
      <div className="swimlane-empty">
        当前筛选条件下没有符合要求的劫难。
      </div>
    );
  }

  return (
    <div className="swimlane-wrapper">
      <svg
        className="event-swimlane"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="八十一难章节泳道图"
      >
        {/* 泳道背景 */}
        {allTypes.map((type, index) => {
          const y = yScale(type);

          return (
            <g key={type}>
              <rect
                x={margin.left}
                y={y}
                width={width - margin.left - margin.right}
                height={yScale.bandwidth()}
                rx="8"
                fill={
                  index % 2 === 0
                    ? 'rgba(255,255,255,0.28)'
                    : 'rgba(88,77,57,0.035)'
                }
              />

              <text
                x={margin.left - 16}
                y={y + yScale.bandwidth() / 2}
                textAnchor="end"
                dominantBaseline="middle"
                className="swimlane-type-label"
              >
                {type}
              </text>
            </g>
          );
        })}

        {/* 章节网格线 */}
        {chapterTicks.map(chapter => (
          <g key={chapter}>
            <line
              x1={xScale(chapter)}
              x2={xScale(chapter)}
              y1={margin.top}
              y2={height - margin.bottom}
              className="swimlane-grid-line"
            />

            <text
              x={xScale(chapter)}
              y={height - margin.bottom + 28}
              textAnchor="middle"
              className="swimlane-axis-label"
            >
              {chapter}
            </text>
          </g>
        ))}

        <text
          x={(margin.left + width - margin.right) / 2}
          y={height - 8}
          textAnchor="middle"
          className="swimlane-axis-title"
        >
          章节回数
        </text>

        {/* 事件 */}
        {stackedEvents.map(event => {
          const y = getEventY(event);
          const selected = isSelected(event);
          const activeColor =
            TYPE_COLORS[event.displayType] ?? '#806b54';

          const normalColor =
            TYPE_COLORS[event.displayType] ?? '#d8cfc0';
                  
          const fillColor = selected ? activeColor : normalColor;

          const titleText =
            event.startChapter === event.endChapter
              ? `第${event.id}难 · ${event.name}｜第${event.startChapter}回`
              : `第${event.id}难 · ${event.name}｜第${event.startChapter}—${event.endChapter}回`;

          if (event.duration > 1) {
            const visibleStartChapter = Math.max(
              event.startChapter,
              chapterRange[0],
            );
          
            const visibleEndChapter = Math.min(
              event.endChapter,
              chapterRange[1],
            );
          
            const chapterPixelWidth =
              (width - margin.left - margin.right) /
              (chapterRange[1] - chapterRange[0] + 1);
          
            const startX = xScale(visibleStartChapter);
          
            const eventWidth = Math.max(
              16,
              (visibleEndChapter - visibleStartChapter + 1) *
                chapterPixelWidth,
            );
          
            return (
              <g
                key={event.id}
                className="swimlane-event"
                onClick={() => onSelectEvent(event)}
                opacity={getOpacity(event)}
              >
                <title>{titleText}</title>
            
                <rect
                  x={startX}
                  y={y - 8}
                  width={eventWidth}
                  height={15}
                  rx={5}
                  fill={selected ? activeColor : normalColor}
                  stroke={selected ? '#2f332d' : '#fffaf0'}
                  strokeWidth={selected ? 3 : 1.5}
                  style={{
                    '--event-active-color': activeColor,
                  }}
                />
              </g>
            );
          }

          const radius = Math.min(12, 5.5 + event.characterCount * 0.75);

          return (
            <g
              key={event.id}
              className="swimlane-event"
              onClick={() => onSelectEvent(event)}
              opacity={getOpacity(event)}
            >
              <title>{titleText}</title>

              <circle
                cx={xScale(event.startChapter)}
                cy={y}
                r={radius}
                fill={selected ? activeColor : normalColor}
                stroke={selected ? '#2f332d' : '#fffaf0'}
                strokeWidth={selected ? 3 : 1.5}
                style={{
                '--event-active-color': activeColor,
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}