import { ResponsiveBar } from '@nivo/bar';

interface BarChartProps {
  data: Array<any>;
}

export const BarChart = ({ data }: BarChartProps) => (
  <ResponsiveBar
    ariaLabel="Gráfico de fuentes de leads"
    axisRight={null}
    axisTop={null}
    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
    borderRadius={8}
    colors={['#008f60']} // Esmeralda Corporativo
    data={data}
    indexBy="fuente"
    indexScale={{ type: 'band', round: true }}
    keys={['leads']}
    labelSkipHeight={12}
    labelSkipWidth={12}
    labelTextColor="#ffffff"
    margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
    padding={0.3}
    role="application"
    valueScale={{ type: 'linear' }}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Canal',
      legendPosition: 'middle',
      legendOffset: 32
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