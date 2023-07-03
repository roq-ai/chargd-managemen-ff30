import axios from 'axios';
import queryString from 'query-string';
import { UsageStatisticsInterface, UsageStatisticsGetQueryInterface } from 'interfaces/usage-statistics';
import { GetQueryInterface } from '../../interfaces';

export const getUsageStatistics = async (query?: UsageStatisticsGetQueryInterface) => {
  const response = await axios.get(`/api/usage-statistics${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createUsageStatistics = async (usageStatistics: UsageStatisticsInterface) => {
  const response = await axios.post('/api/usage-statistics', usageStatistics);
  return response.data;
};

export const updateUsageStatisticsById = async (id: string, usageStatistics: UsageStatisticsInterface) => {
  const response = await axios.put(`/api/usage-statistics/${id}`, usageStatistics);
  return response.data;
};

export const getUsageStatisticsById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/usage-statistics/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteUsageStatisticsById = async (id: string) => {
  const response = await axios.delete(`/api/usage-statistics/${id}`);
  return response.data;
};
