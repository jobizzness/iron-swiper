import './icons.js';
import './swiper-style.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import Swiper  from 'swiper';

/**
 * @polymer
 * @extends HTMLElement
 */
/**
`iron-swiper`
Polymer 2.x element that wraps around Swiper.js

@demo demo/index.html
@demo demo/selected.html Selected attribute usage
@demo demo/all.html Kitchen Sink demos
*/
class IronSwiper extends PolymerElement {
  static get is() {
    return 'iron-swiper';
  }

  static get properties() {
    return {

      /**
       * Internal storage for slide nodes
       */
      _nodes: {
        type: Array,
        value: []
      },

      /**
       * Gets or sets the selected slide by index
       */
      selected: {
        type: String,
        value: 0,
        notify: true,
        observer: 'setSelected'
      },

      /**
       * Set to true and click on any slide will produce transition to that slide
       */
      slideToClickedSlide: {
        type: Boolean,
        value: false
      },

      /**
       * Enable pagination functionality
       */
      pagination: {
        type: Boolean,
        value: false
      },

      /**
       * If true then clicking on pagination button will cause transition to appropriate slide
       */
      paginationClickable: {
        type: Boolean,
        value: false
      },

      /**
       * Enable navigation buttons
       */
      navigationButtons: {
        type: Boolean,
        value: false
      },

      /**
       * If `navigationButtons` then the next button icon can be set
       */
      nextIcon: {
        type: String,
        value: 'iron-swiper:arrow-forward'
      },
      /**
       * If `navigationButtons` then the prev button icon can be set
       */
      prevIcon: {
        type: String,
        value: 'iron-swiper:arrow-back'
      },

      /**
       * Enable scrollbar
       */
      scrollbar: {
        type: Boolean,
        value: false
      },

      /**
       * Initial slide to be shown
       */
      initialSlide: {
        type: Boolean,
        value: 0
      },

      /**
       * Enable ARIA
       */
      a11y: {
        type: Boolean,
        value: false
      },

      /**
       * Enable continuous loop mode
       */
      loop: {
        type: Boolean,
        value: false
      },

      /**
       * Enable keyboard control
       */
      keyboard: {
        type: Boolean,
        value: false
      },

      /**
       * Other Swiper options
       */
      options: {
        type: Object,
        value: function() {return {};}
      }
    };
  }

  static get template(){
    return html `
    <style include="swiper-style">
       :host {
        display: block;
      }

      #slides {
        display: none;
      }

      .swiper-container {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        @apply --iron-swiper-container;
      }
      .swiper-wrapper {
        height: calc(100% - 25px);
        @apply --iron-swiper-wrapper;
      }
      .swiper-slide {
        background-color: var(--iron-swiper-slide-background-color, #eeeeee);
        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;
        @apply --iron-swiper-slide;
      }

      .swiper-slide-active {
        @apply --iron-swiper-slide-active;
      }

      .swiper-slide-prev {
        @apply --iron-swiper-slide-prev;
      }

      .swiper-slide-next {
        @apply --iron-swiper-slide-next;
      }

      .swiper-slide > * {
        @apply --iron-swiper-slide-child;
      }

      .swiper-slide-active.swiper-slide > * {
        @apply --iron-swiper-slide-child-active;
      }

      .swiper-slide .caption {
        display: inline-block;
        width: 100%;
        text-align: center;
        position: absolute;
        top: 8px;
        font-size: 80%;
        font-weight: bold;
        @apply --iron-swiper-caption;
      }

      .swiper-button-prev,
      .swiper-container-rtl .swiper-button-prev,
      .swiper-button-prev.swiper-button-black,
      .swiper-container-rtl .swiper-button-prev.swiper-button-black,
      .swiper-button-prev.swiper-button-white,
      .swiper-container-rtl .swiper-button-prev.swiper-button-white,
      .swiper-button-next,
      .swiper-container-rtl .swiper-button-next,
      .swiper-button-next.swiper-button-black,
      .swiper-container-rtl .swiper-button-next.swiper-button-black,
      .swiper-button-next.swiper-button-white,
      .swiper-container-rtl .swiper-button-next.swiper-button-white {
        background-image: none;
        width: 50px;
        height: 50px;
      }

      .swiper-button-prev,
      .swiper-container-rtl .swiper-button-next {
        @apply --iron-swiper-button-prev;
      }
      .swiper-button-next,
      .swiper-container-rtl .swiper-button-prev {
        @apply --iron-swiper-button-next;
      }

      .swiper-pagination-fraction,
      .swiper-pagination-custom,
      .swiper-container-horizontal > .swiper-pagination-bullets {
        bottom: 0;
      }
      .swiper-lazy-preloader:after {
        background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%270%200%20120%20120%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%3E%3Cdefs%3E%3Cline%20id%3D%27l%27%20x1%3D%2760%27%20x2%3D%2760%27%20y1%3D%277%27%20y2%3D%2727%27%20stroke%3D%27%236c6c6c%27%20stroke-width%3D%2711%27%20stroke-linecap%3D%27round%27%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.27%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.27%27%20transform%3D%27rotate(30%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.27%27%20transform%3D%27rotate(60%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.27%27%20transform%3D%27rotate(90%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.27%27%20transform%3D%27rotate(120%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.27%27%20transform%3D%27rotate(150%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.37%27%20transform%3D%27rotate(180%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.46%27%20transform%3D%27rotate(210%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.56%27%20transform%3D%27rotate(240%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.66%27%20transform%3D%27rotate(270%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.75%27%20transform%3D%27rotate(300%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.85%27%20transform%3D%27rotate(330%2060%2C60)%27%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
      }
      .swiper-lazy-preloader-white:after {
        background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%270%200%20120%20120%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%3E%3Cdefs%3E%3Cline%20id%3D%27l%27%20x1%3D%2760%27%20x2%3D%2760%27%20y1%3D%277%27%20y2%3D%2727%27%20stroke%3D%27%23fff%27%20stroke-width%3D%2711%27%20stroke-linecap%3D%27round%27%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.27%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.27%27%20transform%3D%27rotate(30%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.27%27%20transform%3D%27rotate(60%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.27%27%20transform%3D%27rotate(90%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.27%27%20transform%3D%27rotate(120%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.27%27%20transform%3D%27rotate(150%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.37%27%20transform%3D%27rotate(180%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.46%27%20transform%3D%27rotate(210%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.56%27%20transform%3D%27rotate(240%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.66%27%20transform%3D%27rotate(270%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.75%27%20transform%3D%27rotate(300%2060%2C60)%27%2F%3E%3Cuse%20xlink%3Ahref%3D%27%23l%27%20opacity%3D%27.85%27%20transform%3D%27rotate(330%2060%2C60)%27%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
      }

      .swiper-pagination {
        @apply --iron-swiper-pagination;
      }

      .swiper-scrollbar {
        @apply --iron-swiper-scrollbar;
      }

      .swiper-button-prev,
      .swiper-container-rtl .swiper-button-next,
      .swiper-button-next,
      .swiper-container-rtl .swiper-button-prev {
        color: var(--iron-swiper-active-color, var(--secondary-color));
      }

      .swiper-pagination-bullet-active,
      .swiper-pagination-progress .swiper-pagination-progressbar .swiper-pagination-bullet-active,
      .swiper-pagination-progress .swiper-pagination-progressbar {
        background: var(--iron-swiper-active-color, var(--secondary-color));
      }

      .swiper-button-disabled {
        display: none;
      }
    </style>

    <div id="slides" hidden="">
      <slot></slot>
    </div>

    <div class="swiper-container" id="swiper">

      <div class="swiper-pagination" id="pagination" hidden="[[!nav(pagination, _nodes)]]"></div>

      <div class="swiper-wrapper" id="wrapper"></div>

      <iron-icon icon="[[prevIcon]]" class="swiper-button-prev" id="prev" hidden="[[!nav(navigationButtons, _nodes)]]"></iron-icon>
      <iron-icon icon="[[nextIcon]]" class="swiper-button-next" id="next" hidden="[[!nav(navigationButtons, _nodes)]]"></iron-icon>

      <div class="swiper-scrollbar" id="scrollbar" hidden="[[!scrollbar]]"></div>

    </div>
    `;
  }

  ready() {
    super.ready();

    this.init();

    this.addEventListener('dom-change', this.init);
    this.addEventListener('track', this.preventTrack);
  }

  constructor() {
    super();
    this._view = this._view.bind(this);
    this._nodeClicked = this._nodeClicked.bind(this);
  }

  nav(property, _nodes) {
    return property && _nodes && _nodes.length && _nodes.length > 1;
  }

  getOptions() {
    return Object.keys(IronSwiper.properties).reduce(function(options, key) {
      if (key === 'navigationButtons') {
        options.navigation = options.navigation || {};
        options.navigation.prevEl = this.$.prev;
        options.navigation.nextEl = this.$.next;
      }
      else if (key === 'pagination') {
        options.pagination = options.pagination || {};
        options.pagination.el = this.$.pagination;
        options.pagination.type = 'bullets';
      }
      else if (key === 'paginationClickable') {
        options.pagination = options.pagination || {};
        options.pagination.clickable = this[key];
      }
      else if (key === 'options') {
        Object.assign(options, this[key]);
      }
      else {
        options[key] = this[key];
      }

      // Disable loop for 1 or less slides
      if (!this._nodes || this._nodes.length <= 1) {
        options.loop = false;
      }

      return options;
    }.bind(this), {
      on: {
        slideChangeTransitionStart: function() {
          if (this._swiper && this._swiper.realIndex>=0) {
            this.selected = this._swiper.realIndex;
          }
          this.stopPlayers();
        }.bind(this)
      }

    });
  }

  stopPlayers() {
    var players = this.querySelectorAll('video, audio');
    for (var i = 0; i < players.length; i++) {
      if (players[i].pause) {
        players[i].pause();
      }
      else if (players[i].stop) {
        players[i].stop();
      }
    }
  }

  preventTrack(e) {
    if (!e) {
      return e;
    }

    e.cancelBubble = true;
    e.preventDefault();
  }

  _copyProperties(node1, node2) {
    if (!node1 || !node2 ||
        !node1.constructor || !node1.constructor ||
        !node1.constructor.properties || !node2.constructor.properties) {
      return;
    }
    Object.keys(node1.constructor.properties).forEach(key => node2[key] = node1[key]);
  }

  init() {
    clearTimeout(this._initializer);
    this._initializer = setTimeout(function() {
      // First clone real nodes into the wrapper
      const _nodes = [];
      const excludeTagNames = ['TEMPLATE', 'DOM-REPEAT', 'DOM-IF'];
      let slides = FlattenedNodesObserver.getFlattenedNodes(this)
        .filter(
          function(node) {
            return node.tagName &&
            excludeTagNames.indexOf(node.tagName) === -1 &&
            !node.classList.contains('swiper-slide');
          });

      const wrapper = this.$.wrapper;
      wrapper.innerHTML = '';
      wrapper.removeAttribute('style');

      for (var i = 0; i < slides.length; i++) {
        // Otherwise IE controls don't work
        if ('ActiveXObject' in window && /video|audio/i.test(slides[i].tagName.toLowerCase())) {
          slides[i].classList.add('swiper-no-swiping');
        }

        const node = wrapper.appendChild(slides[i].cloneNode(true));
        this._copyProperties(slides[i], node);
        node.classList.add('swiper-slide');
        node.setAttribute('index', i.toString());
        node.removeEventListener('click', this._nodeClicked);
        node.addEventListener('click', this._nodeClicked);

        var url = node.style.backgroundImage;
        if (url) {
          url = url.replace(/^url\(['"]?([^'")]*).*?$/, '$1');
          var img = new window.Image();

          img.addEventListener('error', function() {
            this.dispatchEvent(new CustomEvent('error', {
              composed: true,
              detail: {img: img, url: url}
            }));
          }.bind(this));

          img.addEventListener('load', function(e) {
            this.dispatchEvent(new CustomEvent('load', {
              composed: true,
              detail: {img: img, url: url}
            }));
          }.bind(this));

          img.crossOrigin = true;
          img.src = url;
        }

        _nodes.push(node);
      }

      // Then create the Swiper instance
      this.set('_nodes', _nodes);
      this.render();
    }.bind(this), 10);
  }

  render() {
    // TODO: figure out a nicer way for this crap...
    if (!this.$.wrapper.clientHeight) {
      return setTimeout(this.render.bind(this), 50);
    }

    if (this._swiper) {
      this.$.prev.classList.remove(this._swiper.params.buttonDisabledClass);
      this.$.next.classList.remove(this._swiper.params.buttonDisabledClass);
      this._swiper.destroy();
    }

    this._swiper = new Swiper(this.$.swiper, this.getOptions());
  }

  _nodeClicked(e) {
    var index = e.target.getAttribute('index');
    if (this.slideToClickedSlide && index) {
      this.setSelected(index);
    }
    this._view(e);
  }

  _view(e) {
    e.cancelBubble = true;
    var url = e.currentTarget && e.currentTarget.getAttribute('data-url');
    this.dispatchEvent(new CustomEvent('view', {bubbles: true, composed: true, detail: {url: url}}));
  }

  setSelected(index) {
    if (this.selected != index) {
      this.selected=index;
    }
    if (this._swiper && this._swiper.realIndex != index) {
      this._swiper.slideTo(index);
    }
  }
}
window.customElements.define(IronSwiper.is, IronSwiper);
