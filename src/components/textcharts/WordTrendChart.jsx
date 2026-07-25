import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

const WordTrendChart = ({ seriesData, xAxisData, height = 280, onPointClick }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !seriesData?.length) return;
    const chartInstance = echarts.getInstanceByDom(chartRef.current) || echarts.init(chartRef.current);

    const option = {
      tooltip: { 
        trigger: 'axis',
        backgroundColor: 'rgba(248, 245, 236, 0.95)',
        borderColor: '#315f58',
        borderWidth: 1,
        textStyle: { color: '#27332f' },
        // 1. 优化 Tooltip 显示格式
        formatter: (params) => {
          if (!params || !params.length) return '';
          let res = `<div style="font-weight:bold;margin-bottom:4px;border-bottom:1px solid #ddd;padding-bottom:2px;">第 ${params[0].name} 回</div>`;
          params.forEach(item => {
            res += `<div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;margin:2px 0;">
                      <span>${item.marker} ${item.seriesName}</span>
                      <b>${item.value} 次</b>
                    </div>`;
          });
          return res;
        }
      },
      legend: { 
        data: seriesData.map(s => s.name),
        top: '0%',
        textStyle: { color: '#526956' }
      },
      grid: {
        top: '18%',
        bottom: '12%',
        left: '6%',
        right: '6%',
        containLabel: true
      },
      xAxis: { 
        type: 'category', 
        data: xAxisData, 
        boundaryGap: false, // 2. 折线从最左侧开始延伸，避免两端悬空
        axisLine: { lineStyle: { color: 'rgba(61, 70, 62, 0.3)' } },
        axisLabel: { fontSize: 10, color: '#77786f' }
      },
      yAxis: { 
        type: 'value',
        name: '频次',
        minInterval: 1, // 3. 强制 Y 轴刻度为整数，避免出现小数频次
        splitLine: { lineStyle: { type: 'dashed', color: 'rgba(0,0,0,0.05)' } }
      },
      // 古典多线配色方案
      color: ['#a33b31', '#315f58', '#a78143', '#526956', '#d96a5d'],
      series: seriesData.map(item => ({
        ...item,
        type: 'line',
        smooth: true,
        symbolSize: 6,
        showSymbol: true,
        lineStyle: { width: 2.5 },
        // 鼠标悬停在某条线上时，其他线自动淡化，突出当前线
        emphasis: {
          focus: 'series',
          lineStyle: { width: 3.5 }
        }
      }))
    };

    chartInstance.setOption(option);

    const handleClick = (params) => {
      if (onPointClick) {
        onPointClick({
          word: params.seriesName,
          chapter: params.name,
          value: params.value
        });
      }
    };

    chartInstance.off('click');
    chartInstance.on('click', handleClick);

    const handleResize = () => chartInstance.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.dispose();
    };
  }, [seriesData, xAxisData, onPointClick]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};

export default WordTrendChart;