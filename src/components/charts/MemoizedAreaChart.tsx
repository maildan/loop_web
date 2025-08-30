import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ChartData {
  name: string;
  documents: number;
  words: number;
}

interface ChartColors {
  areaStroke: string;
  areaFill: string;
  gridStroke: string;
  axisColor: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
}

interface MemoizedAreaChartProps {
  data: ChartData[];
  chartColors: ChartColors;
  isDarkMode: boolean;
  height?: number;
  dataKey?: string;
  name?: string;
}

export const MemoizedAreaChart = React.memo<MemoizedAreaChartProps>(
  ({ data, chartColors, isDarkMode, height = 300, dataKey = 'documents', name = '문서 수' }) => {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.areaFill} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={chartColors.areaFill} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            tick={{ fill: chartColors.axisColor, fontSize: 12 }}
            axisLine={{ stroke: chartColors.gridStroke, strokeOpacity: 0.5 }}
          />
          <YAxis 
            tick={{ fill: chartColors.axisColor, fontSize: 12 }}
            axisLine={{ stroke: chartColors.gridStroke, strokeOpacity: 0.5 }}
          />
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={chartColors.gridStroke} 
            strokeOpacity={0.3} 
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: chartColors.tooltipBg,
              border: `1px solid ${chartColors.tooltipBorder}`,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              color: chartColors.tooltipText
            }}
            labelStyle={{ 
              color: chartColors.tooltipText, 
              fontWeight: 'bold' 
            }}
            itemStyle={{ color: chartColors.tooltipText }}
            formatter={(value: number | string) => [`${value}건`, name]}
          />
          <Area 
            type="monotone" 
            dataKey={dataKey}
            stroke={chartColors.areaStroke} 
            strokeWidth={2}
            fillOpacity={1} 
            fill={`url(#color${dataKey})`} 
            name={name}
            dot={{ 
              strokeWidth: isDarkMode ? 2 : 3, 
              r: isDarkMode ? 4 : 5, 
              fill: chartColors.tooltipBg,
              stroke: isDarkMode ? chartColors.areaStroke : '#1e293b'
            }}
            activeDot={{ 
              r: isDarkMode ? 6 : 8, 
              strokeWidth: isDarkMode ? 2 : 4, 
              fill: chartColors.areaStroke,
              stroke: isDarkMode ? '#ffffff' : '#1e293b'
            }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  },
  // 메모이제이션 조건: 데이터, 색상, 다크모드가 변경될 때만 리렌더링
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
      JSON.stringify(prevProps.chartColors) === JSON.stringify(nextProps.chartColors) &&
      prevProps.isDarkMode === nextProps.isDarkMode &&
      prevProps.height === nextProps.height &&
      prevProps.dataKey === nextProps.dataKey &&
      prevProps.name === nextProps.name
    );
  }
);

MemoizedAreaChart.displayName = 'MemoizedAreaChart';
