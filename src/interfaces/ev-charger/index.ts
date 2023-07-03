import { UsageStatisticsInterface } from 'interfaces/usage-statistics';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface EvChargerInterface {
  id?: string;
  name: string;
  ocpp_id: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  usage_statistics?: UsageStatisticsInterface[];
  organization?: OrganizationInterface;
  _count?: {
    usage_statistics?: number;
  };
}

export interface EvChargerGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  ocpp_id?: string;
  organization_id?: string;
}
