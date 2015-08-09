/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import EventEmitter from 'events';
import { canUseDOM } from '../../node_modules/react/lib/ExecutionEnvironment';

let eventEmitter;
let viewport = {width: 1366, height: 768}; // Default size for server-side rendering
const RESIZE_EVENT = 'resize';

function handleWindowResize() {
  if (viewport.width !== window.innerWidth || viewport.height !== window.innerHeight) {
    viewport = {width: window.innerWidth, height: window.innerHeight};
    eventEmitter.emit(RESIZE_EVENT, viewport);
  }
}

function withViewport(ComposedComponent) {
  return class WithViewport extends Component {

    constructor() {
      super();
      this.state = {
        viewport: canUseDOM ? {width: window.innerWidth, height: window.innerHeight} : viewport,
        isSmallViewport: canUseDOM ? this.isSmall(window.innerWidth, window.innerHeight) : this.isSmall(viewport.width, viewport.height)
      };
    }

    componentDidMount() {
      if (!eventEmitter) {
        eventEmitter = new EventEmitter();
        window.addEventListener('resize', handleWindowResize);
        window.addEventListener('orientationchange', handleWindowResize);
      }
      eventEmitter.on('resize', this.handleResize, this);
    }

    componentWillUnmount() {
      eventEmitter.removeListener(RESIZE_EVENT, this.handleResize, this);
      if (!eventEmitter.listeners(RESIZE_EVENT, true)) {
        window.removeventEmitterventListener('resize', handleWindowResize);
        window.removeventEmitterventListener('orientationchange', handleWindowResize);
        eventEmitter = null;
      }
    }

    render() {
      return <ComposedComponent {...this.props} viewport={this.state.viewport} isSmallViewport={this.state.isSmallViewport} />;
    }

    handleResize(value) {
      this.setState({viewport: value, isSmallViewport: this.isSmall(value.width)});
    }

    isSmall(width, height) {
      return width < 400 || height < 300;
    }
  };
}

export default withViewport;
