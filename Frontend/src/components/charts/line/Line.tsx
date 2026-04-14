import { ResponsiveLine } from '@nivo/line';

interface LineChartProps {
  data: Array<any>;
}

export const LineChart = ({ data }: LineChartProps) => (
  <ResponsiveLine
    enableArea
    useMesh
    areaOpacity={0.1}
    axisRight={null}
    axisTop={null}
    colors={['#182442']} // Indigo Corporativo
    curve="catmullRom"
    data={data}
    margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
    pointBorderColor={{ from: 'serieColor' }}
    pointBorderWidth={2}
    pointColor={{ theme: 'background' }}
    pointLabelYOffset={-12}
    pointSize={10}
    xScale={{ type: 'point' }}
    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Mes',
      legendOffset: 36,
      legendPosition: 'middle'
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Ingresos ($)',
      legendOffset: -50,
      legendPosition: 'middle'
    }}
    theme={{
      axis: {
        legend: {
          text: { fontSize: 12, fontWeight: 600, fill: '#64748b' }
        },
        ticks: {
          text: { fontSize: 11, fill: '#94a3b8' }
        }
      },
      grid: {
        line: { stroke: '#f1f5f9', strokeWidth: 1 }
      }
    }}
  />
);