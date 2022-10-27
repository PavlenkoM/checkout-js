import { createInjectHoc } from '../common/hoc';
import AnalyticsContext, { AnalyticsContextProps } from './AnalyticsContext';

export type WithAnalyticsProps = AnalyticsContextProps;

const withAnalytics = createInjectHoc(AnalyticsContext, { displayNamePrefix: 'WithAnalytics' });

export default withAnalytics;
