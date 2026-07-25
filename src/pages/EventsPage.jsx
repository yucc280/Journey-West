import * as d3 from 'd3';
import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Panel from '../components/common/Panel';
import { useNavigate } from 'react-router-dom';

import '../styles/events.css';

import EventSwimlane from '../components/events/EventSwimlane';
import EventDetail from '../components/events/EventDetail';
import { TYPE_ORDER } from '../components/events/eventConfig';
import EventTimeChart from '../components/events/EventTimeChart';
import EventTypeBarChart from '../components/events/EventTypeBarChart';


const STAGE_ORDER = ['取经缘起', '师徒集结', '漫长历险'];

function getDisplayType(type) {
  return type === '前世' ? '身世劫难' : type;
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [selectedType, setSelectedType] = useState('全部');
  const [selectedStage, setSelectedStage] = useState('全部');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [chapterRange, setChapterRange] = useState([1, 100]);
  
  const navigate = useNavigate();
  function handleViewMap(event) {
  if (!event) return;

  navigate('/map', {
    state: {
      trialId: event.id,
    },
  });
}

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/events_title.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('events_title.json 加载失败');
        }

        return response.json();
      })
      .then((data) => {
        const normalizedEvents = data.map((event) => ({
          ...event,
          originalType: event.type,
          displayType: getDisplayType(event.type),
        }));

        setEvents(normalizedEvents);
        setSelectedEvent(normalizedEvents[0] ?? null);
      })
      .catch((error) => {
        console.error(error);
        setLoadError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const eventTypes = useMemo(() => {
    return [...new Set(events.map((event) => event.displayType))];
  }, [events]);

const filteredEvents = useMemo(() => {
  return events.filter(event => {
    const matchesType =
      selectedType === '全部' ||
      event.displayType === selectedType;

    const matchesStage =
      selectedStage === '全部' ||
      event.stage === selectedStage;

    const matchesChapter =
      event.endChapter >= chapterRange[0] &&
      event.startChapter <= chapterRange[1];

    return matchesType && matchesStage && matchesChapter;
  });
}, [
  events,
  selectedType,
  selectedStage,
  chapterRange,
]);

const typeStats = useMemo(() => {
  const sourceEvents = events.filter((event) => {
    const matchesChapter =
      event.endChapter >= chapterRange[0] &&
      event.startChapter <= chapterRange[1];

    const matchesStage =
      selectedStage === '全部' ||
      event.stage === selectedStage;

    return matchesChapter && matchesStage;
  });

  const grouped = d3.rollup(
    sourceEvents,
    (items) => ({
      count: items.length,
      avgCharacters:
        d3.mean(items, (item) => item.characterCount) ?? 0,
      minChapter:
        d3.min(items, (item) => item.startChapter) ?? null,
      maxChapter:
        d3.max(items, (item) => item.endChapter) ?? null,
    }),
    (item) => item.displayType,
  );

  return TYPE_ORDER.map((type) => {
    const stat = grouped.get(type);

    return {
      type,
      count: stat?.count ?? 0,
      avgCharacters: stat?.avgCharacters ?? 0,
      minChapter: stat?.minChapter ?? null,
      maxChapter: stat?.maxChapter ?? null,
    };
  }).sort((a, b) => b.count - a.count);
}, [
  events,
  chapterRange,
  selectedStage,
]);

  const characterCount = useMemo(() => {
    const characters = new Set();

    filteredEvents.forEach((event) => {
      event.characters.forEach((character) => {
        characters.add(character);
      });
    });

    return characters.size;
  }, [filteredEvents]);

  function resetFilters() {
    setSelectedType('全部');
    setSelectedStage('全部');
    setChapterRange([1, 100]);
    setSelectedEvent(null);
  }

  const timeBinStats = useMemo(() => {
    const bins = Array.from({ length: 10 }, (_, index) => {
      const start = index * 10 + 1;
      const end = start + 9;

      return {
        key: `${start}-${end}`,
        label: `${start}—${end}`,
        start,
        end,
        total: 0,
        typeCounts: Object.fromEntries(
          TYPE_ORDER.map((type) => [type, 0]),
        ),
      };
    });

    events.forEach((event) => {
      const matchesType =
        selectedType === '全部' ||
        event.displayType === selectedType;

      if (!matchesType) {
        return;
      }

      const binIndex = Math.min(
        9,
        Math.floor((event.startChapter - 1) / 10),
      );

      const bin = bins[binIndex];

      bin.total += 1;
      bin.typeCounts[event.displayType] += 1;
    });

    return bins;
  }, [events, selectedType]);

  if (loading) {
    return (
      <div className="page">
        <p>正在加载八十一难数据……</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="page">
        <p>数据加载失败：{loadError}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="时间维度"
        title="八十一难事件分析"
        description="以全书一百回为时间坐标，观察八十一难的类型分布、叙事阶段与事件密度。"
      />

<div className="events-analysis-layout">
  {/* 左侧栏 */}
  <aside className="events-left-column">
    <Panel title="事件筛选">
      <div className="events-filter-column">
        <div className="control-group">
          <label htmlFor="event-type">劫难类型</label>

          <select
            id="event-type"
            value={selectedType}
            onChange={(event) => {
              setSelectedType(event.target.value);
              setSelectedEvent(null);
            }}
          >
            <option value="全部">全部类型</option>

            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="event-stage">叙事阶段</label>

          <select
            id="event-stage"
            value={selectedStage}
            onChange={(event) => {
              setSelectedStage(event.target.value);
              setSelectedEvent(null);
            }}
          >
            <option value="全部">全部阶段</option>

            {STAGE_ORDER.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        <div className="chapter-range-control">
          <div className="control-group">
            <label htmlFor="event-type">章节范围</label>
            <strong>
              {chapterRange[0]}—{chapterRange[1]} 回
            </strong>
          </div>

          <div className="chapter-range-control__sliders">
            <div className="chapter-range-control__row">
              <span className="chapter-range-control__value">
                {chapterRange[0]}
              </span>

              <input
                type="range"
                min="1"
                max="100"
                value={chapterRange[0]}
                aria-label="起始章节"
                onChange={(event) => {
                  const value = Number(event.target.value);

                  setChapterRange((current) => [
                    Math.min(value, current[1]),
                    current[1],
                  ]);

                  setSelectedEvent(null);
                }}
              />
            </div>

            <div className="chapter-range-control__row">
              <span className="chapter-range-control__value">
                {chapterRange[1]}
              </span>

              <input
                type="range"
                min="1"
                max="100"
                value={chapterRange[1]}
                aria-label="结束章节"
                onChange={(event) => {
                  const value = Number(event.target.value);

                  setChapterRange((current) => [
                    current[0],
                    Math.max(value, current[0]),
                  ]);

                  setSelectedEvent(null);
                }}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="events-reset-button"
          onClick={resetFilters}
        >
          ↻ 重置筛选
        </button>
      </div>
    </Panel>

      <div className="note-card map-guide-card">
        <strong>筛选说明</strong>
          <p>
            <span>01 </span>
            点击类型栏或滑动章节轴可以对八十一难进行事件、阶段和章节三个角度的筛选。
          </p>
          <p>
            <span>02 </span>
            叙事阶段分为取经缘起（1-12回）、师徒集结（13-22回）和漫长历险（23-100回）。
          </p>
          <p>
            <span>03 </span>
            事件筛选会同步更新泳道图和概览卡片数据。
          </p>
      </div>

    <Panel title="当前概览">
      <div className="events-mini-stats">
        <div className="events-mini-stat">
          <span>当前事件</span>
          <strong>{filteredEvents.length}</strong>
          <small>共81难</small>
        </div>

        <div className="events-mini-stat">
          <span>事件类型</span>
          <strong>
            {
              new Set(
                filteredEvents.map(
                  (event) => event.displayType,
                ),
              ).size
            }
          </strong>
          <small>当前范围</small>
        </div>

        <div className="events-mini-stat">
          <span>涉及人物</span>
          <strong>{characterCount}</strong>
          <small>去重统计</small>
        </div>

        <div className="events-mini-stat">
          <span>当前阶段</span>
          <strong className="events-mini-stat__text">
            {selectedStage === '全部'
              ? '全阶段'
              : selectedStage}
          </strong>
          <small>筛选状态</small>
        </div>
      </div>
    </Panel>

      <div className="note-card map-guide-card">
        <strong>数据说明</strong>
          <p>
          八十一难名称及顺序参考《西游记》第九十九回所列劫数，
          章节位置根据事件在原著中的主要发生章节人工整理。
          类型为本项目根据事件性质进行的分析性分类，并非原著固有分类。
          </p>
      </div>      

  </aside>

  {/* 中间图表 */}
  <main className="events-center-column">
    <Panel
      title="八十一难章节泳道图"
      subtitle="横轴表示章节，纵轴表示劫难类型；点击事件查看详情。"
    >
      <EventSwimlane
        events={filteredEvents}
        allTypes={eventTypes}
        selectedEvent={selectedEvent}
        onSelectEvent={setSelectedEvent}
        chapterRange={chapterRange}
      />
    </Panel>

    <Panel
      title="章节区间事件分布"
      subtitle="按每十回统计劫难数量及类型构成。点击或取消坐标轴可以筛选对应章节范围，点击柱状图色块可以筛选为对应类别。"
    >
      <EventTimeChart
        data={timeBinStats}
        selectedType={selectedType}
        selectedRange={chapterRange}
        onSelectRange={(bin) => {
          const sameRange =
            chapterRange[0] === bin.start &&
            chapterRange[1] === bin.end;

          setChapterRange(
            sameRange
              ? [1, 100]
              : [bin.start, bin.end],
          );

          setSelectedStage('全部');
          setSelectedEvent(null);
        }}
        onSelectSegment={(bin, type) => {
          setChapterRange([bin.start, bin.end]);
          setSelectedType(type);
          setSelectedStage('全部');
          setSelectedEvent(null);
        }}
      />
    </Panel>

    <Panel
      title="劫难类型分布"
      subtitle="比较当前章节范围内各类劫难的数量。"
    >
      <EventTypeBarChart
        data={typeStats}
        selectedType={selectedType}
        highlightedType={
          selectedEvent?.displayType ?? null
        }
        onSelectType={(type) => {
          setSelectedType((current) =>
            current === type ? '全部' : type,
          );

          setSelectedEvent(null);
        }}
      />
    </Panel>
  </main>

  {/* 右侧详情栏 */}
  <aside className="events-right-column">
    <Panel
      title="事件详情"
      subtitle="点击泳道图中的事件后更新"
    >
      <EventDetail
        selectedEvent={selectedEvent}
        onViewMap={handleViewMap}
      />
    </Panel>
  </aside>
</div>
      
    </div>
  );
}