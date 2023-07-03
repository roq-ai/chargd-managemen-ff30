import * as yup from 'yup';

export const usageStatisticsValidationSchema = yup.object().shape({
  uptime: yup.number().integer().required(),
  load_curve: yup.number().integer().required(),
  other_metrics: yup.string().required(),
  ev_charger_id: yup.string().nullable(),
});
