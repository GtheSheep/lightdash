import {
    type CartesianChartSqlConfig,
    type PieChartSqlConfig,
} from '@lightdash/common';
import { LoadingOverlay } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import EChartsReact, { type EChartsReactProps } from 'echarts-for-react';
import { memo, type FC } from 'react';
import SuboptimalState from '../../common/SuboptimalState/SuboptimalState';
import { type ResultsAndColumns } from '../Results';
import { useChart } from '../transformers/useChart';

type ChartViewProps = {
    data: ResultsAndColumns;
    config: CartesianChartSqlConfig | PieChartSqlConfig;
    isLoading: boolean;
} & Partial<Pick<EChartsReactProps, 'style'>>;

const ChartView: FC<ChartViewProps> = memo(
    ({ data, config, style, isLoading: isLoadingProp }) => {
        const {
            loading: transformLoading,
            error,
            value: spec,
        } = useChart(data.results, data.columns, config);
        const loading = isLoadingProp || transformLoading;

        // TODO: this could be more robust
        const errorMessage = error?.message.includes('Binder Error')
            ? 'Some specified columns do not exist in the data'
            : error?.message;

        if (error) {
            return (
                <SuboptimalState
                    title="Error generating chart"
                    description={errorMessage}
                    icon={IconAlertCircle}
                />
            );
        }

        return (
            <>
                <LoadingOverlay visible={loading || !spec} />
                {spec && (
                    <EChartsReact
                        option={spec}
                        notMerge
                        opts={{
                            renderer: 'svg',
                            width: 'auto',
                            height: 'auto',
                        }}
                        style={style}
                    />
                )}
            </>
        );
    },
);

export default ChartView;