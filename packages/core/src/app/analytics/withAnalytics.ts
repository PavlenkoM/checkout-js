import { AnalyticsContext, AnalyticsContextProps } from '@bigcommerce/checkout/analytics-integration';

import { createInjectHoc } from '../common/hoc';

export type WithAnalyticsProps = AnalyticsContextProps;

const withAnalytics = createInjectHoc(AnalyticsContext, { displayNamePrefix: 'WithAnalytics' });

export default withAnalytics;
