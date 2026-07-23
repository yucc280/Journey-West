import { useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3';

import 'leaflet/dist/leaflet.css';
import '../styles/map.css';

import PageHeader from '../components/common/PageHeader';
import Panel from '../components/common/Panel';
import ChapterRangeControl from '../components/common/ChapterRangeControl';
import { TYPE_COLORS, createLocationIcon } from '../components/map/mapConfig';
import TrialDetail from '../components/map/TrialDetail';
import MapSidebar from '../components/map/MapSidebar';
import JourneyMap from '../components/map/JourneyMap';

const DATA_URL = `${import.meta.env.BASE_URL}data/trials.csv`;

function normalizeRow(row) {
  const cleanedRow = {};

  Object.entries(row).forEach(([key, value]) => {
    const cleanKey = key.replace(/^\uFEFF/, '').trim();
    cleanedRow[cleanKey] =
      typeof value === 'string' ? value.trim() : value;
  });

  return cleanedRow;
}

export default function MapPage() {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [selectedType, setSelectedType] = useState('全部');

  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 1. 读取CSV
  useEffect(() => {
    d3.csv(DATA_URL)
      .then((rawData) => {
        const parsedData = rawData.map((rawRow) => {
          const row = normalizeRow(rawRow);

          return {
            编号: Number(row['编号']),
            名称: row['名称'] || '',
            地点: row['地点'] || '',
            劫难类型: row['劫难类型'] || '其他',
            简介:
              row['简介'] ||
              row['30字以内简介'] ||
              '',
            经度: Number(row['经度']),
            纬度: Number(row['纬度']),
            主要人物: row['主要人物']
              ? row['主要人物']
                  .split('|')
                  .map((name) => name.trim())
                  .filter(Boolean)
              : []
          };
        });

        parsedData.sort((a, b) => a.编号 - b.编号);

        console.log('CSV原始表头：', rawData.columns);
        console.log('处理后的八十一难数据：', parsedData);

        setTrials(parsedData);
      })
      .catch((error) => {
        console.error('CSV读取失败：', error);
        setLoadError('八十一难数据加载失败，请检查CSV路径和文件名。');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 2. 数据计算
  const validTrials = useMemo(() => {
    return trials.filter(
      (trial) =>
        Number.isFinite(trial.编号) &&
        Number.isFinite(trial.纬度) &&
        Number.isFinite(trial.经度) &&
        trial.纬度 >= -90 &&
        trial.纬度 <= 90 &&
        trial.经度 >= -180 &&
        trial.经度 <= 180
    );
  }, [trials]);

  const playbackTrials = useMemo(() => {
    return [...validTrials].sort(
      (a, b) => a.编号 - b.编号
    );
  }, [validTrials]);

  const currentTrial =
    playbackTrials[currentTrialIndex] || null;

  const progress =
    playbackTrials.length > 0
      ? ((currentTrialIndex + 1) /
          playbackTrials.length) *
        100
      : 0;

  // 3. 其他筛选数据
  const filteredTrials = useMemo(() => {
    if (selectedType === '全部') {
      return validTrials;
    }

    return validTrials.filter(
      (trial) => trial.劫难类型 === selectedType
    );
  }, [validTrials, selectedType]);

  // 5. 自动播放
  useEffect(() => {
  if (!isPlaying || playbackTrials.length === 0) {
    return undefined;
  }

  const timer = window.setInterval(() => {
    setCurrentTrialIndex((currentIndex) => {
      if (
        currentIndex >=
        playbackTrials.length - 1
      ) {
        setIsPlaying(false);
        return currentIndex;
      }

      const nextIndex = currentIndex + 1;
      setSelectedTrial(playbackTrials[nextIndex]);

      return nextIndex;
    });
  }, 1500);

  return () => {
    window.clearInterval(timer);
    };
  }, [isPlaying, playbackTrials]);

  // 6. 控制函数
  const groupedLocations = useMemo(() => {
    const groups = new Map();

    filteredTrials.forEach((trial) => {
      const key = `${trial.纬度.toFixed(5)},${trial.经度.toFixed(5)}`;

      if (!groups.has(key)) {
        groups.set(key, {
          纬度: trial.纬度,
          经度: trial.经度,
          地点: trial.地点,
          trials: []
        });
      }

      groups.get(key).trials.push(trial);
    });

    return Array.from(groups.values()).map((group) => ({
      ...group,
      trials: group.trials.sort((a, b) => a.编号 - b.编号)
    }));
  }, [filteredTrials]);

  const routePositions = useMemo(() => {
    return [...filteredTrials]
      .sort((a, b) => a.编号 - b.编号)
      .map((trial) => [
        trial.纬度,
        trial.经度
      ]);
  }, [filteredTrials]);

  const eventTypes = useMemo(() => {
    return [
      '全部',
      ...new Set(
        validTrials
          .map((trial) => trial.劫难类型)
          .filter(Boolean)
      )
    ];
  }, [validTrials]);


  function selectTrial(trial) {
  if (!trial) return;

  const index = playbackTrials.findIndex(
    (item) => item.编号 === trial.编号
  );

  if (index >= 0) {
    setCurrentTrialIndex(index);
  }

  setSelectedTrial(trial);
}

function goToPreviousTrial() {
  setIsPlaying(false);

  const nextIndex = Math.max(
    0,
    currentTrialIndex - 1
  );

  setCurrentTrialIndex(nextIndex);
  setSelectedTrial(playbackTrials[nextIndex]);
}

function goToNextTrial() {
  setIsPlaying(false);

  const nextIndex = Math.min(
    playbackTrials.length - 1,
    currentTrialIndex + 1
  );

  setCurrentTrialIndex(nextIndex);
  setSelectedTrial(playbackTrials[nextIndex]);
}

function resetJourney() {
  setIsPlaying(false);
  setCurrentTrialIndex(0);
  setSelectedTrial(playbackTrials[0] || null);
}


  return (
    <div className="page">
      <PageHeader
        eyebrow="空间维度"
        title="西行地理路线"
        description="在地理底图上展示八十一难的地点分布、事件类型与主要人物。部分文学地点采用近似坐标，仅用于叙事空间分析，详情请见附录参考资料。"
      />

      <div className="analysis-layout analysis-layout--map">
        
        <MapSidebar
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          eventTypes={eventTypes}
          currentTrial={currentTrial}
          currentTrialIndex={currentTrialIndex}
          totalTrials={playbackTrials.length}
          progress={progress}
          isPlaying={isPlaying}
          onTogglePlay={() =>
            setIsPlaying((value) => !value)
          }
          onPrevious={goToPreviousTrial}
          onNext={goToNextTrial}
          onReset={resetJourney}

          trialsCount={trials.length}
          validCount={validTrials.length}
          filteredCount={filteredTrials.length}
          locationCount={groupedLocations.length + 1}
        />

        <Panel
          title="八十一难空间分布"
          subtitle="点位颜色表示劫难类型，点击点位查看事件摘要。"
          className="main-visual-panel"
        >
          {loading && (
            <div className="map-loading">
              正在加载八十一难数据……
            </div>
          )}

          {!loading && loadError && (
            <div className="map-error">
              {loadError}
            </div>
          )}

          {!loading && !loadError && (
            <JourneyMap
              trials={filteredTrials}
              groupedLocations={groupedLocations}
              routePositions={routePositions}
              selectedTrial={selectedTrial}
              onSelectTrial={selectTrial}
            />
          )}
        </Panel>

        <Panel
          title="地点详情"
          subtitle="点击地图点位后更新"
        >
          <TrialDetail selectedTrial={selectedTrial} />
        </Panel>
      </div>
    </div>
  );
}