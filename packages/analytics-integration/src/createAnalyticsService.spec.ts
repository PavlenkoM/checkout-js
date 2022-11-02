import createAnalyticsService from './createAnalyticsService';

describe('createAnalyticsService', () => {
    it('should be created once', () => {
        const createFn = jest.fn().mockImplementation(
            (...options) => (
                [...options]
            )
        );
        const createArguments = ['create', 'arguments'];

        const getService = createAnalyticsService(createFn, createArguments);

        expect(getService()[0]).toBe('create');
        expect(getService()[1]).toBe('arguments');
        expect(createFn).toBeCalledTimes(1);
    });
});