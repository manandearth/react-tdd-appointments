import React from 'react';
import { createShallowRenderer, childrenOf, type } from './shallowHelpers';

const TestComponent = ({ children }) => (
  <>{children}</>
);


describe('element matching', () => {
  let render; let
    elementMatching;

  beforeEach(() => {
    ({ render, elementMatching } = createShallowRenderer());
  });

  it('finds the first direct child', () => {
    render(<TestComponent>
      <p>A</p>
      <p>B</p>
           </TestComponent>);
    expect(elementMatching(type('p'))).toEqual(
      <p>A</p>
    );
  });
});

describe('child', () => {
  let render; let
    child;

  beforeEach(() => {
    ({ render, child } = createShallowRenderer());
  });

  it('returns undefined if the child does not exist', () => {
    render(<TestComponent />);
    expect(child(0)).not.toBeDefined();
  });
  it('returned child of rendered element', () => {
    render(<TestComponent>
      <p>A</p>
      <p>B</p>
           </TestComponent>);
    expect(child(1)).toEqual(<p>B</p>);
  });
});

describe('childrenOf', () => {
  it('returns no children', () => {
    expect(childrenOf(<div />)).toEqual([]);
  });
  it('returns direct children', () => {
    expect(
      childrenOf(
        <div>
          <p>A</p>
          <p>B</p>
        </div>
      )
    ).toEqual([<p>A</p>, <p>B</p>]);
  });
  it('returns text as an array of one item', () => {
    expect(childrenOf(<div>text</div>)).toEqual(['text']);
  });
  it('returns no children for text', () => {
    expect(childrenOf('text')).toEqual([]);
  });
  it('returns array of children for elements with one child', () => {
    expect(childrenOf(
      <div>
        <p>A</p>
      </div>
    )).toEqual([<p>A</p>]);
  });
});
