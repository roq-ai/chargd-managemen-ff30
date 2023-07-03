import * as yup from 'yup';

export const evChargerValidationSchema = yup.object().shape({
  name: yup.string().required(),
  ocpp_id: yup.string().required(),
  organization_id: yup.string().nullable(),
});
