import { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

const SentimentLineChart = ({ chartData, height = 380, onSelectChapter }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !chartData?.length) return;
    const chart = echarts.getInstanceByDom(chartRef.current) || echarts.init(chartRef.current);

    const xAxisData = chartData.map(item => `第${item.chapter}回`);
    const rawChapters = chartData.map(item => Number(item.chapter)); // 强制确保是数字类型
    const sentimentData = chartData.map(item => item.sentimentScore);
    const conflictData = chartData.map(item => item.conflict);

    const option = {
      grid: {
        top: '18%',
        left: '5%',
        right: '5%',
        bottom: '12%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ccc',
        borderWidth: 1,
        textStyle: { color: '#333' },
        axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
        formatter: (params) => {
          if (!params || !params.length) return '';
          let res = `<div style="font-weight:bold;margin-bottom:4px;">${params[0].name}</div>`;
          params.forEach(item => {
            const unit = item.seriesName === '冲突强度' ? '' : ' 分';
            res += `<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;">
                      <span>${item.marker} ${item.seriesName}</span>
                      <span style="font-weight:bold;">${item.value}${unit}</span>
                    </div>`;
          });
          res += `<div style="font-size:11px;color:#888;margin-top:4px;">💡 点击节点即可调阅原文</div>`;
          return res;
        }
      },
      legend: {
        data: ['情感分值', '冲突强度'],
        top: '2%',
        icon: 'roundRect',
        textStyle: { color: '#555', fontSize: 13 }
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#aaa' } },
        axisLabel: {
          color: '#666',
          fontSize: 11,
          interval: 'auto'
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '情感分数',
          min: 0,
          max: 1,
          interval: 0.2,
          nameTextStyle: { color: '#2b5c8f', padding: [0, 30, 0, 0] },
          axisLine: { show: true, lineStyle: { color: '#2b5c8f' } },
          splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
        },
        {
          type: 'value',
          name: '冲突强度',
          min: 0,
          max: 100,
          interval: 20,
          nameTextStyle: { color: '#a63a50', padding: [0, 0, 0, 30] },
          axisLine: { show: true, lineStyle: { color: '#a63a50' } },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: '情感分值',
          type: 'line',
          data: sentimentData,
          smooth: true,
          symbolSize: 6,
          showSymbol: false,
          itemStyle: { color: '#2b5c8f' },
          lineStyle: { width: 2.5 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(43, 92, 143, 0.25)' },
              { offset: 1, color: 'rgba(43, 92, 143, 0.01)' }
            ])
          }
        },
        {
          name: '冲突强度',
          type: 'line',
          yAxisIndex: 1,
          data: conflictData,
          smooth: true,
          symbolSize: 6,
          showSymbol: false,
          itemStyle: { color: '#a63a50' },
          lineStyle: { width: 2.5 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(166, 58, 80, 0.2)' },
              { offset: 1, color: 'rgba(166, 58, 80, 0.01)' }
            ])
          }
        }
      ]
    };

    chart.setOption(option);

    chart.off('click');
    chart.on('click', (params) => {
      let selectedChap = null;

      // 优先从数组索引取
      if (params.dataIndex !== undefined && rawChapters[params.dataIndex] !== undefined) {
        selectedChap = rawChapters[params.dataIndex];
      } else if (params.name) {
        const parsed = parseInt(params.name.replace(/[^\d]/g, ''), 10);
        if (!isNaN(parsed)) selectedChap = parsed;
      }

      if (selectedChap !== null && onSelectChapter) {
        onSelectChapter(selectedChap);
      }
    });

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [chartData, onSelectChapter]);

  return <div ref={chartRef} style={{ width: '100%', height, cursor: 'pointer' }} />;
};

export default SentimentLineChart;