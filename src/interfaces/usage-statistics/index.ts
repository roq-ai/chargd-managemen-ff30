import { EvChargerInterface } from 'interfaces/ev-charger';
import { GetQueryInterface } from 'interfaces';

export interface UsageStatisticsInterface {
  id?: string;
  uptime: number;
  load_curve: number;
  other_metrics: string;
  ev_charger_id?: string;
  created_at?: any;
  updated_at?: any;

  ev_charger?: EvChargerInterface;
  _count?: {};
}

export interface UsageStatisticsGetQueryInterface extends GetQueryInterface {
  id?: string;
  other_metrics?: string;
  ev_charger_id?: string;
}
