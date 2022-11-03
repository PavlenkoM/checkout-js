import createAnalyticsService from './createAnalyticsService';

describe('createAnalyticsService', () => {
    it('should be created once', () => {
        const createFn = jest.fn().mockImplementation(
            (...options) => (
                [...options]
            )
        );
        const createArguments = ['create', 'arguments'];

        let getService = createAnalyticsService(createFn, createArguments);

        expect(getService()[0]).toBe('create');
        expect(getService()[1]).toBe('arguments');

        expect(createFn).toBeCalledTimes(1);
    });

    it('should be created without arguments', () => {
        const createFn = jest.fn().mockImplementation(
            (...options) => (
                [...options]
            )
        );

        let getService = createAnalyticsService(createFn);

        expect(getService().length).toBe(0);

        expect(createFn).toBeCalledTimes(1);
    });
});