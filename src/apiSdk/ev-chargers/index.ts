import axios from 'axios';
import queryString from 'query-string';
import { EvChargerInterface, EvChargerGetQueryInterface } from 'interfaces/ev-charger';
import { GetQueryInterface } from '../../interfaces';

export const getEvChargers = async (query?: EvChargerGetQueryInterface) => {
  const response = await axios.get(`/api/ev-chargers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEvCharger = async (evCharger: EvChargerInterface) => {
  const response = await axios.post('/api/ev-chargers', evCharger);
  return response.data;
};

export const updateEvChargerById = async (id: string, evCharger: EvChargerInterface) => {
  const response = await axios.put(`/api/ev-chargers/${id}`, evCharger);
  return response.data;
};

export const getEvChargerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/ev-chargers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEvChargerById = async (id: string) => {
  const response = await axios.delete(`/api/ev-chargers/${id}`);
  return response.data;
};
