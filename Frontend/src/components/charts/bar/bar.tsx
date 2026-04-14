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
    colors={['#006c49']} // Verde corporativo
    data={data}
    indexBy="fuente"
    indexScale={{ type: 'band', round: true }}
    keys={['leads']}
    labelSkipHeight={12}
    labelSkipWidth={12}
    labelTextColor="#ffffff"
    margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
    padding={0.4}
    role="application"
    valueScale={{ type: 'linear' }}
    axisBottom={{
      tickSize: 3,
      tickPadding: 3,
      tickRotation: -45
    }}
    axisLeft={{
      tickSize: 3,
      tickPadding: 3,
      tickRotation: 0,
      legend: 'Tasa %',
      legendPosition: 'middle',
      legendOffset: -50
    }}
    theme={{
      axis: {
        legend: {
          text: { fontSize: 12, fontWeight: 600, fill: '#182442' }
        },
        ticks: {
          text: { fontSize: 11, fill: '#64748b' }
        }
      },
      grid: {
        line: { stroke: '#e2e8f0', strokeWidth: 1 }
      },
      tooltip: {
        chip: {
          borderRadius: '4px'
        },
        container: {
          background: '#1e293b',
          color: '#f1f5f9',
          fontSize: '12px',
          borderRadius: '4px'
        }
      }
    }}
  />
);