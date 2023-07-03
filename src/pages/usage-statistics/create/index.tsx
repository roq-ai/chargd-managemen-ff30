import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createUsageStatistics } from 'apiSdk/usage-statistics';
import { Error } from 'components/error';
import { usageStatisticsValidationSchema } from 'validationSchema/usage-statistics';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { EvChargerInterface } from 'interfaces/ev-charger';
import { getEvChargers } from 'apiSdk/ev-chargers';
import { UsageStatisticsInterface } from 'interfaces/usage-statistics';

function UsageStatisticsCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: UsageStatisticsInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createUsageStatistics(values);
      resetForm();
      router.push('/usage-statistics');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<UsageStatisticsInterface>({
    initialValues: {
      uptime: 0,
      load_curve: 0,
      other_metrics: '',
      ev_charger_id: (router.query.ev_charger_id as string) ?? null,
    },
    validationSchema: usageStatisticsValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Usage Statistics
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="uptime" mb="4" isInvalid={!!formik.errors?.uptime}>
            <FormLabel>Uptime</FormLabel>
            <NumberInput
              name="uptime"
              value={formik.values?.uptime}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('uptime', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.uptime && <FormErrorMessage>{formik.errors?.uptime}</FormErrorMessage>}
          </FormControl>
          <FormControl id="load_curve" mb="4" isInvalid={!!formik.errors?.load_curve}>
            <FormLabel>Load Curve</FormLabel>
            <NumberInput
              name="load_curve"
              value={formik.values?.load_curve}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('load_curve', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.load_curve && <FormErrorMessage>{formik.errors?.load_curve}</FormErrorMessage>}
          </FormControl>
          <FormControl id="other_metrics" mb="4" isInvalid={!!formik.errors?.other_metrics}>
            <FormLabel>Other Metrics</FormLabel>
            <Input
              type="text"
              name="other_metrics"
              value={formik.values?.other_metrics}
              onChange={formik.handleChange}
            />
            {formik.errors.other_metrics && <FormErrorMessage>{formik.errors?.other_metrics}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<EvChargerInterface>
            formik={formik}
            name={'ev_charger_id'}
            label={'Select Ev Charger'}
            placeholder={'Select Ev Charger'}
            fetcher={getEvChargers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'usage_statistics',
    operation: AccessOperationEnum.CREATE,
  }),
)(UsageStatisticsCreatePage);
