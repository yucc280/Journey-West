import { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

const WordRankBarChart = ({ wordRankData, height = 360, onWordClick }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !wordRankData?.length) return;
    const chart = echarts.getInstanceByDom(chartRef.current) || echarts.init(chartRef.current);
    
    // 只截取 Top 10，并反转数组以符合 ECharts yAxis 默认自下而上的渲染逻辑
    const top10Data = [...wordRankData].slice(0, 10).reverse();
    const names = top10Data.map(i => i.name || i.word);
    const values = top10Data.map(i => i.value || i.count);

    const option = {
      grid: {
        top: '6%',
        left: '18%',   
        right: '15%',  
        bottom: '12%', 
        containLabel: false
      },
      tooltip: { 
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: '{b}: {c} 次'
      },
      xAxis: { 
        type: 'value',
        name: '出现次数',
        nameLocation: 'end',
        nameGap: 8,
        axisLine: { show: true, lineStyle: { color: '#8c8c8c' } },
        axisLabel: {
          color: '#666',
          fontSize: 11,
          // 将千位数字简写，彻底解决 X 轴数字重叠挤爆
          formatter: (val) => val >= 1000 ? `${val / 1000}k` : val
        },
        splitLine: { lineStyle: { type: 'dashed', color: '#eaeaea' } }
      },
      yAxis: { 
        type: 'category', 
        data: names,
        axisLine: { lineStyle: { color: '#8c8c8c' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#333',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      series: [
        {
          type: 'bar',
          data: values,
          barWidth: '55%',
          itemStyle: { 
            color: '#8B2323',
            borderRadius: [0, 4, 4, 0] 
          },
          // 柱子右侧直接显示数值
          label: {
            show: true,
            position: 'right',
            color: '#8B2323',
            fontSize: 11,
            formatter: '{c}'
          }
        }
      ]
    };

    chart.setOption(option);

    chart.off('click');
    chart.on('click', (params) => {
      onWordClick?.(params.name);
    });

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [wordRankData, onWordClick]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};

export default WordRankBarChart;