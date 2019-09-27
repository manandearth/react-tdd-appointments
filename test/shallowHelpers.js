import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

const elementMatching = (element, matcherFn) => childrenOf(element).filter(matcherFn);

export const createShallowRenderer = () => {
  const renderer = new ShallowRenderer();

  return {
    render: (component) => renderer.render(component),
    elementMatching: (matcherFn) => elementMatching(renderer.getRenderOutput(), matcherFn),
    child: (n) => childrenOf(renderer.getRenderOutput())[n],
  };
};

export const childrenOf = (element) => {
  if (typeof element === 'string') {
    return [];
  }
  const {
    props: { children },
  } = element;

  if (!children) {
    return [];
  }
  if (typeof children === 'string') {
    return [children];
  }
  if (Array.isArray(children)) {
    return children;
  }
  return [children];
};
