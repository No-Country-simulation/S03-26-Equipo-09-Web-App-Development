export type FunctionComponent = React.ReactElement | null;

type HeroIconSVGProps = React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> &
	React.RefAttributes<SVGSVGElement>;
type IconProps = HeroIconSVGProps & {
	title?: string;
	titleId?: string;
};
export type Heroicon = React.FC<IconProps>;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// Dashboard & Lead Management Types
export type EstadoLead = 'LEAD_NUEVO' | 'CONTACTADO' | 'NEGOCIACION' | 'CLIENTE' | 'PERDIDO';

export interface DashboardStats {
  totalContactos: number;
  interaccionesTotales: number;
  mensajesSinLeer: number;
  nuevosLeadsHoy: number;
  tareasPendientes: number;
  contactosPorEstado: Record<EstadoLead, number>;
}
