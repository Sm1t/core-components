import React from 'react';
import { render } from '@testing-library/react';
import * as hooks from '@alfalab/hooks';
import { SuperEllipse } from './super-ellipse';
import { Circle } from './circle';
import { Rectangle } from './rectangle';
import { NoShape } from './no-shape';

enum UseLoadingStates {
    LOADED = 'loaded',
    LOADING = 'loading',
    ERROR = 'error',
}

describe('IconView', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            const { baseElement } = render(<SuperEllipse />);

            expect(baseElement).toMatchSnapshot();
        });

        it('should match snapshot with border', () => {
            const { baseElement } = render(<SuperEllipse border={true} />);

            expect(baseElement).toMatchSnapshot();
        });

        it('should match snapshot with image', () => {
            jest.spyOn(hooks, 'useImageLoadingState').mockReturnValue('loaded' as UseLoadingStates);
            const { baseElement } = render(
                <SuperEllipse imageUrl='https://picsum.photos/id/1081/5512/3708' />,
            );

            expect(baseElement).toMatchSnapshot();
        });

        it('should match snapshot with addons', () => {
            expect(render(<SuperEllipse topAddons='Top addon' />).baseElement).toMatchSnapshot();

            expect(
                render(<SuperEllipse bottomAddons='Bottom addon' />).baseElement,
            ).toMatchSnapshot();

            expect(
                render(<SuperEllipse topAddons='Top addon' bottomAddons='Bottom addon' />)
                    .baseElement,
            ).toMatchSnapshot();
        });

        it('should match snapshot with text', () => {
            const { baseElement } = render(<SuperEllipse text={<span>text</span>} />);

            expect(baseElement).toMatchSnapshot();
        });
    });

    describe('Props tests', () => {
        it('should set `data-test-id` attribute', () => {
            const dataTestId = 'test-id';
            const { queryByTestId } = render(<SuperEllipse dataTestId={dataTestId} />);

            expect(queryByTestId(dataTestId)).toBeInTheDocument();
        });

        it('should set `className` class', () => {
            const className = 'test-class';
            const dataTestId = 'test-id';

            const { getByTestId } = render(
                <SuperEllipse dataTestId={dataTestId} className={className} />,
            );

            expect(getByTestId(dataTestId)).toHaveClass(className);
        });

        it('should set size', () => {
            const size = 128;

            const { baseElement } = render(<SuperEllipse size={size} />);

            const svgElement = baseElement.querySelector('svg') as SVGElement;

            const width = Number(svgElement.getAttribute('width'));
            const height = Number(svgElement.getAttribute('height'));
            const viewBox = svgElement.getAttribute('viewBox');

            expect(width).toBe(size);
            expect(height).toBe(size);
            expect(viewBox).toBe(`0 0 ${size} ${size}`);
        });

        it('should set 64 size by default', () => {
            const defaultSize = 64;

            const { baseElement } = render(
                <React.Fragment>
                    <SuperEllipse />
                    <Circle />
                    <Rectangle />
                    <NoShape />
                </React.Fragment>,
            );

            const svgElements = baseElement.querySelectorAll('svg');

            expect(Number(svgElements[0].getAttribute('width'))).toBe(defaultSize);
            expect(Number(svgElements[1].getAttribute('width'))).toBe(defaultSize);
        });

        it('should set background color', () => {
            const color = 'red';

            const { baseElement } = render(<SuperEllipse backgroundColor={color} />);

            const path = baseElement.querySelector('path') as SVGPathElement;

            expect(path).toHaveStyle({ fill: color });
        });

        it('should set background color color-light-bg-secondary by default', () => {
            const defaultColor = 'var(--color-light-base-bg-secondary)';

            const { baseElement } = render(<SuperEllipse />);

            const path = baseElement.querySelector('path') as SVGPathElement;

            expect(path).toHaveClass('bg');
        });

        it('should render border path', () => {
            const { baseElement } = render(<SuperEllipse border={true} />);

            const borderPath = baseElement.querySelector('.border') as SVGPathElement;

            expect(borderPath).toBeInTheDocument();
            expect(borderPath.tagName).toBe('path');
        });

        it('should render image', () => {
            const { baseElement } = render(
                <SuperEllipse imageUrl='https://picsum.photos/id/1081/5512/3708' />,
            );

            const image = baseElement.querySelector('image') as SVGImageElement;
            const clipPath = baseElement.querySelector('clipPath') as SVGClipPathElement;
            const path = baseElement.querySelector('path:not(.bg)') as SVGPathElement;

            const clipPathId = clipPath.getAttribute('id');

            expect(image).toBeInTheDocument();
            expect(clipPath).toBeInTheDocument();
            expect(path).toBeInTheDocument();
            expect(image.getAttribute('clip-path')).toBe(`url(#${clipPathId})`);
        });

        it('should render top addons', () => {
            const testId = 'test-id';

            const { queryByTestId } = render(
                <SuperEllipse topAddons={<div data-test-id={testId} />} />,
            );

            expect(queryByTestId(testId)).toBeInTheDocument();
        });

        it('should render bottom addons', () => {
            const testId = 'test-id';

            const { queryByTestId } = render(
                <SuperEllipse bottomAddons={<div data-test-id={testId} />} />,
            );

            expect(queryByTestId(testId)).toBeInTheDocument();
        });

        it('should render top & bottom addons', () => {
            const topAddonsTestId = 'top-addons-test-id';
            const bottomAddonsTestId = 'bottom-addons-test-id';

            const { queryByTestId } = render(
                <SuperEllipse
                    topAddons={<div data-test-id={topAddonsTestId} />}
                    bottomAddons={<div data-test-id={bottomAddonsTestId} />}
                />,
            );

            expect(queryByTestId(topAddonsTestId)).toBeInTheDocument();
            expect(queryByTestId(bottomAddonsTestId)).toBeInTheDocument();
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<SuperEllipse />);

        expect(unmount).not.toThrowError();
    });
});
