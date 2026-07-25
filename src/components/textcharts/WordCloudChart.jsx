import { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import 'echarts-wordcloud';

const WordCloudChart = ({ wordData, height = 520, onWordClick }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !wordData?.length) return;
    const chart = echarts.getInstanceByDom(chartRef.current) || echarts.init(chartRef.current);

    const option = {
      tooltip: { show: true },
      series: [
        {
          type: 'wordCloud',
          shape: 'circle',
          sizeRange: [14, 64],
          rotationRange: [-30, 30],
          gridSize: 10,
          drawOutOfBound: false,
          textStyle: {
            fontFamily: 'SimSun, "Source Han Serif CN", serif',
            color: () => {
              const palette = ['#a82020', '#1e58aa', '#038c60', '#c27803', '#6f3fc9'];
              return palette[Math.floor(Math.random() * palette.length)];
            }
          },
          data: wordData
        }
      ]
    };
    chart.setOption(option);

    // 绑定点击事件
    chart.off('click');
    chart.on('click', (params) => {
      onWordClick?.(params.name);
    });

    // 窗口自适应
    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [wordData, onWordClick]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};

export default WordCloudChart;
