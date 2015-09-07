import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import withStyles from '../../decorators/withStyles';
import styles from './Map.less';
//import TextBox from '../TextBox';
import AntykaGeometry from './AntykaGeometry';
//import { canUseDOM } from 'react/lib/ExecutionEnvironment';
import NeighbourhoodService from '../../services/NeighbourhoodService';
import NeighbourhoodStore from '../../stores/NeighbourhoodStore';
import _ from 'lodash';

@withStyles(styles)
class Map extends Component {

  static propTypes = {
    position: PropTypes.instanceOf(Object),
    drawMode: PropTypes.bool,
    onNeighbourhoodChange: React.PropTypes.func.isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    position: null
  };

  constructor() {
    super();
    this.neighbourhood = null;
    this.state = {
      //address: '',
      existingPolygons: null,
      error: false,
      //neighbourhood: null,
      map: null
    };
  }

  // Life cycle methods
  shouldComponentUpdate(nextProps, nextStates) {
    console.log('shouldComponentUpdate() position:', this.props.position, nextProps.position, _.isEqual(this.props.position, nextProps.position));
    console.log('shouldComponentUpdate() drawMode:', this.props.drawMode, nextProps.drawMode, this.props.drawMode !== nextProps.drawMode);
    console.log('shouldComponentUpdate() existingPolygons:', this.state.existingPolygons, nextStates.existingPolygons, this.state.existingPolygons !== nextStates.existingPolygons);
    //return this.props.position !== nextProps.position || this.props.drawMode !== nextProps.drawMode;
    // TODO: need a more gracefull way to do this
    
    if(!nextProps.drawMode) {
      console.log('discard mode:', nextProps.drawMode); 
      this.drawingManager.setDrawingMode(null);
      /*if(this.neighbourhood) {
        console.log('discard mode2');
        this.neighbourhood.setMap(null);
        this.closeInfoWindow();
      }*/
    }
    return !_.isEqual(this.props.position, nextProps.position) || this.props.drawMode !== nextProps.drawMode || this.state.existingPolygons !== nextStates.existingPolygons;
  }

  componentWillUnmount() {
    NeighbourhoodStore.removeChangeListener(this.neighbourhoodStoreListener);
  }

  componentDidMount() {
    console.log('Map.componentDidMount()| props:', this.props);

    this.neighbourhoodStoreListener = this.onNeighbourhoodStoreChange.bind(this);
    NeighbourhoodStore.addChangeListener(this.neighbourhoodStoreListener);

    NeighbourhoodService.findNeighbourhoodsByViewport();

/*
    if(this.props.user.neighbourhood) {
      NeighbourhoodService.searchNeighbourhoodById(this.props.user.neighbourhood);
    }
*/
    let mapOptions = {
          center: {lat: -34.397, lng: 150.644},
          zoom: 15,
          zoomControl: true,
          panControl: true,
          panControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
          },
          zoomControlOptions: {
              style: google.maps.ZoomControlStyle.LARGE,
              position: google.maps.ControlPosition.RIGHT_TOP
          }
        };
    let map = new google.maps.Map(React.findDOMNode(this), mapOptions);
    let infoWindow = new google.maps.InfoWindow({map: map});

    google.maps.event.addListener(map, 'dragend', function() {
      // TODO: load existing polygons according to bound
      console.log('Map map event: dragend:', map.getBounds(), map.getZoom());
    });

    google.maps.event.addListener(map, 'zoom_changed', function() {
      // TODO: load existing polygons according to bound, Do not load if zoom level is less then 10
      console.log('Map map event: zoom_changed:', map.getBounds(), map.getZoom());
    });

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: false,
      polygonOptions: {
          fillColor: '#FFFF00',
          fillOpacity: 0.1,
          strokeWeight: 1,
          strokeColor: '#DD2200',
          clickable: true,
          editable: true,
          zIndex: 2
        },
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          //google.maps.drawing.OverlayType.POLYGON
        ]
      }
    });
    this.drawingManager.setMap(map);


    let _this = this;
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', function(e) {
      //console.log('Overlay complete:', e);
      console.debug('Overlay complete:', e.overlay.getPath().getArray());
      console.debug('Overlay complete:', this.props);
      let newShape = e.overlay;
      this.drawingManager.setDrawingMode(null);

      this.validateShapeAndUpdate(newShape);

      console.debug('Overlay complete polygon:', newShape);
      this.neighbourhood = newShape;

      this.attachEventListenersToOverlayPolygon(newShape, true);
    }.bind(this));

    this.setState({map: map, infoWindow: infoWindow});
    console.log('Map.componentDidMount end!!!');
  }
  // ...................

  // supporting methods
  attachEventListenersToOverlayPolygon(newShape, editable) {
    google.maps.event.addListener(newShape, 'click', function(event) {
      console.log('overlay click:', event);
    });
    if(editable) {
      let _this = this;
      google.maps.event.addListener(newShape.getPath(), 'set_at', function(event) {
        console.debug('overlay edit set_at:', event, newShape.getPath().getArray());
        _this.validateShapeAndUpdate(newShape);
      });

      google.maps.event.addListener(newShape.getPath(), 'insert_at', function(event) {
        console.log('overlay edit insert_at:', event);
        _this.validateShapeAndUpdate(newShape);
      });

      google.maps.event.addListener(newShape.getPath(), 'remove_at', function(event) {
        console.log('overlay edit remove_at:', event);
        _this.validateShapeAndUpdate(newShape);
      });
    }
  }

  renderExistingNeighbourhoods() {
    let map = this.state.map;
    if(map) {
      console.debug('Rendering Existing Neighbourhoods...');
      _.forEach(this.state.existingPolygons, (polygon) => {
        polygon.setMap(map);
      });
    }
  }

  onNeighbourhoodStoreChange() {
    this.loadExistingPolygons();
  }

  loadExistingPolygons() {
    console.log('Map.loadExistingPolygons():');

    let existingPolygons = [];
    let encodedNeighbourhoods = NeighbourhoodStore.getNeighbourhoods();
    let ownNeighbourhood = this.props.user.neighbourhood;

    _.forEach(encodedNeighbourhoods, (encodedNeighbourhood) => {
      console.log('Map.loadExistingPolygons() encodedNeighbourhood:', encodedNeighbourhood, google.maps.geometry);
      let decodedPath = google.maps.geometry.encoding.decodePath(encodedNeighbourhood.encodedpolygon);
      console.log('Map.loadExistingPolygons() decodedNeighbourhood:', decodedPath);
      let userNeighbourhood = ownNeighbourhood && ownNeighbourhood === encodedNeighbourhood._id;
      let poly = new google.maps.Polygon({
        paths: decodedPath,
        strokeColor: '#008888',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: userNeighbourhood ? '#00FF00' : '#FF6600',
        fillOpacity: 0.1,
        zIndex: 2,
        editable: userNeighbourhood
      });
      this.attachEventListenersToOverlayPolygon(poly, userNeighbourhood);
      existingPolygons.push(poly);
    }.bind(this));

    this.setState({existingPolygons: existingPolygons});
  }

  findPolygonCenter(path) {
    let bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < path.length; i++) {
      bounds.extend(path.getAt(i));
    }
    return bounds.getCenter();
  }

  validateShapeAndUpdate(newShape) {
    let isValid = false;

    if(!this.findSelfIntersectsAndShowError(newShape) && !this.findIntersectsAndShowError(newShape) && this.validNeighbourhoodArea(newShape)) {
      isValid = true;
    }
    let encodedPath = google.maps.geometry.encoding.encodePath(newShape.getPath());
    console.log('validateShapeAndUpdate()|', isValid, this.state.infoWindow.getContent());
    //this.setState({neighbourhood: newShape, error: !isValid});
    let changed = {isValid: isValid, encodedpolygon: encodedPath};
    if(!isValid) {
      changed.errorMsg = this.state.infoWindow.getContent();
    } else {
      let centerPos = this.findPolygonCenter(newShape.getPath());
      changed.neighbourhoodCenter = {lat: centerPos.lat(), lng: centerPos.lng()};
    }
    this.props.onNeighbourhoodChange(changed);
  }

  validNeighbourhoodArea(newShape) {
    let area = google.maps.geometry.spherical.computeArea(newShape.getPath());
    console.log('Map.validNeighbourhoodArea()| area of polygon:', area);
    if(area > 250000 || area < 1000)
    {
      let centerPos = this.findPolygonCenter(newShape.getPath());
      console.log('Map.validNeighbourhoodArea()| center of polygon:', centerPos);
      this.handleMapError('Neighbourhood area must be between 1000 and 250000 sq meters, your drawing area: ' + area + ' sq meters', centerPos);
      return false;
    }
    return true;
  }

  findIntersectsAndShowError(inputShape) {
    let geometry = new AntykaGeometry();
    console.log('findIntersectsAndShowError():', inputShape);
    let hasIntersection = false;
    _.forEach(this.state.existingPolygons, (existingPolygon) => {
      console.log('findIntersectsAndShowError():', _.isEqual(inputShape, existingPolygon));
      if(!_.isEqual(inputShape, existingPolygon)) {
        let intersection = geometry.isIntersectingPolygon(inputShape.getPath(), existingPolygon.getPath());
        if(intersection) {
          let pos = new google.maps.LatLng(parseFloat(intersection[0].x), parseFloat(intersection[0].y));
          console.debug('AMIT:', intersection, pos);
          this.handleMapError('Your neighbourhood can not overlap with existing neighbourhoods, please retry or modify this...', pos);
          hasIntersection = true;
          return;
        }
      }
    });
    return hasIntersection;
  }

  findSelfIntersectsAndShowError(inputShape) {
    let geometry = new AntykaGeometry();

    let intersections = geometry.findSelfIntersects(inputShape.getPath());

    //console.log("findSelfIntersectsAndShowError() Patharray:", inputShape.getPath().getArray());
    console.log('findSelfIntersectsAndShowError() intersections:', intersections);

    if(intersections) {
      let pos = new google.maps.LatLng(parseFloat(intersections[0][0]), parseFloat(intersections[0][1]));
      this.handleMapError('A self interescting polygon can not be a neighbourhood, please retry or modify this...', pos);
      return true;
    } else {
      let infoWindow = this.state.infoWindow;
      infoWindow.close();
      return false;
    }
  }

  handleMapError(errorMsg, position) {
    let map = this.state.map;
    let infoWindow = this.state.infoWindow;//new google.maps.InfoWindow({map: map});
    if(position) {
      infoWindow.setPosition(position);
    } else {
      infoWindow.setPosition(map.getCenter());
    }
    infoWindow.setContent(errorMsg);

    if(!this.isInfoWindowOpen(infoWindow))
    {
      infoWindow.open(map);
    }
  }

  handleLocationError(browserHasGeolocation) {
    let msg = browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.';
    this.handleMapError(msg);
  }

  findAndSetLocation(lat, lng, showInfo, msg) {
    let map = this.state.map;
    if(map) {
      let pos = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
      map.setCenter(pos);
      if(showInfo) {
        let infoWindow = this.state.infoWindow;//new google.maps.InfoWindow({map: map});
        infoWindow.setPosition(pos);
        if(!msg) {
          infoWindow.setContent('Location: (lat,long)=(' + lat + ', ' + lng + ')');
        } else {
          infoWindow.setContent(msg);
        }

        if(!this.isInfoWindowOpen(infoWindow))
        {
          infoWindow.open(map);
        }
      }
    }
  }

  closeInfoWindow() {
    if(this.state.infoWindow && this.isInfoWindowOpen(this.state.infoWindow)) {
      this.state.infoWindow.close();
    }
  }

  isInfoWindowOpen(infoWindow){
    let map = infoWindow.getMap();
    return (map !== null && typeof map !== 'undefined');
  }

  findCurrentGeoLocation() {
    let _this = this;
    if (navigator.geolocation) { // Try HTML5 geolocation.
      navigator.geolocation.getCurrentPosition((position) => {
        console.debug('Map.findCurrentGeoLocation()| Current position:', position);
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        this.findAndSetLocation(lat, lng, true, 'We\'ve found your location.(lat,long)=(' + lat + ', ' + lng + ')');
      }, function() {
        _this.handleLocationError(true);
      });
    } else {
      this.handleLocationError(false);
    }
  }

  render() {
    console.log('Map.render()| props:', this.props);
    console.log('Map.render()| states:', this.state);

    //let map = this.state.map;
    //let infoWindow = new google.maps.InfoWindow({map: map});

    this.renderExistingNeighbourhoods();

    if(this.props.drawMode) {
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      this.closeInfoWindow();
    }  else {
      if(this.neighbourhood) {
        this.neighbourhood.setMap(null);
        this.closeInfoWindow();
      }
      if(this.props.position && this.props.position.lat && this.props.position.lng) {
        console.log('Map.render()| Has position:', this.props.position.lat, this.props.position.lng);
        this.findAndSetLocation(this.props.position.lat, this.props.position.lng, true);
      } else {
        this.findCurrentGeoLocation();
      }
    }

    return (
      <div className={classNames(this.props.className, 'Map')}>
      </div>
    );
  }
}

export default Map;
