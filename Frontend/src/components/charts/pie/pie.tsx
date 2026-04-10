import { ResponsivePie } from '@nivo/pie';

interface PieChartProps {
  data: Array<any>;
}

export const PieChart = ({ data }: PieChartProps) => (
  <ResponsivePie
    activeOuterRadiusOffset={8}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor="#ffffff"
    arcLinkLabelsColor={{ from: 'color' }}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#64748b"
    arcLinkLabelsThickness={2}
    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
    borderWidth={1}
    colors={['#182442', '#008f60', '#f59e0b', '#ef4444', '#6366f1']}
    cornerRadius={8}
    data={data}
    innerRadius={0.6}
    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
    padAngle={2}
    theme={{
      labels: {
        text: { fontSize: 12, fontWeight: 700 }
      },
      legends: {
        text: { fontSize: 12, fill: '#45464e' }
      }
    }}
  />
);