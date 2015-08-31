import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import withStyles from '../../decorators/withStyles';
import styles from './Map.less';
import TextBox from '../TextBox';
import AntykaGeometry from './AntykaGeometry';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';
import NeighbourhoodService from '../../services/NeighbourhoodService';
import NeighbourhoodStore from '../../stores/NeighbourhoodStore';
import _ from 'lodash';

@withStyles(styles)
class Map extends Component {

  static propTypes = {
    position: PropTypes.instanceOf(Object).isRequired,
    drawMode: PropTypes.bool.isRequired
  };

  static defaultProps = {
    
  };

  constructor() {
    super();
    this.neighbourhood = null;
    this.state = {
      //address: '',
      existingPolygons: null,
      error: false,
      //neighbourhood: null,
      map:null
    };
  }

  renderExistingNeighbourhoods() {
    let map = this.state.map;
    if(map) {
      console.debug('Rendering Existing Neighbourhoods...');
      _.forEach(this.state.existingPolygons, (polygon) => {
        polygon.setMap(map);
      });
    }
    
    //---------------------------------
  }

  _onNeighbourhoodStoreChange() {
    this.loadExistingPolygons();
  }

  loadExistingPolygons() {
    console.log('Map.loadExistingPolygons():');



    let existingPolygons = [];
    let encodedNeighbourhoods = NeighbourhoodStore.getNeighbourhoods();

    _.forEach(encodedNeighbourhoods, (encodedNeighbourhood) => {
      console.log('Map.loadExistingPolygons() encodedNeighbourhood:', encodedNeighbourhood, google.maps.geometry);
      let decodedPath = google.maps.geometry.encoding.decodePath(encodedNeighbourhood.encodedpolygon);
      console.log('Map.loadExistingPolygons() decodedNeighbourhood:', decodedPath);
      let poly = new google.maps.Polygon({
        paths: decodedPath,
        strokeColor: '#008888',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        zIndex: 2
      });
      
      existingPolygons.push(poly);
    });
    /*
    let triangleCoords = [
      {lat: 22.692646, lng: 88.380895},
      {lat: 22.692646, lng: 88.373897},
      {lat: 22.700649, lng: 88.373897},
      {lat: 22.700649, lng: 88.380895}
    ];

    

    let poly = new google.maps.Polygon({
      paths: triangleCoords,
      strokeColor: '#008888',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      zIndex: 2
    });
    existingPolygons.push(poly);*/

    this.setState({existingPolygons: existingPolygons}) ;
  }

  componentWillUnmount() {
    NeighbourhoodStore.removeChangeListener(this.neighbourhoodStoreListener);
  }

  componentDidMount(rootNode) {
    console.log('Map.componentDidMount()| position:', this.props.position);

    this.neighbourhoodStoreListener = this._onNeighbourhoodStoreChange.bind(this);
    NeighbourhoodStore.addChangeListener(this.neighbourhoodStoreListener);
    
    NeighbourhoodService.findNeighbourhoodsByViewport();

    let mapOptions = {
          center: {lat: -34.397, lng: 150.644},
          zoom: 15,
          zoomControl: true,
          zoomControlOptions: {
              style: google.maps.ZoomControlStyle.LARGE,
              position: google.maps.ControlPosition.RIGHT_TOP
          },
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
          fillOpacity: 0.2,
          strokeWeight: 1,
          strokeColor:'#DD2200',
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
    google.maps.event.addListener(this.drawingManager, "overlaycomplete", function(event) {
      //console.log('Overlay complete:', event);
      console.debug('Overlay complete:', event.overlay.getPath().getArray());
      let newShape = event.overlay;
      _this.drawingManager.setDrawingMode(null);
      //console.log('Overlay complete:', event.overlay.getPaths().getAt(0).getArray(), event.overlay.getPaths().getAt(0).getArray());
      /*if(event.overlay.getPath().getArray().length <= 2) {
        _this.handleMapError('This is not a neighbourhood. Remove this and try again...', newShape.getPath().getAt(0));
        return;
      }*/
      
      _this.validateShapeAndUpdate(newShape);

      console.debug('Overlay complete polygon:', newShape);
      _this.neighbourhood = newShape;

      google.maps.event.addListener(newShape, 'click', function(event) {
         console.log('overlay click:', event);
      });
      google.maps.event.addListener(newShape.getPath(), 'set_at', function(event) {
        console.debug("overlay edit set_at:", event, newShape.getPath().getArray());
         _this.validateShapeAndUpdate(newShape);
      });

      google.maps.event.addListener(newShape.getPath(), 'insert_at', function(event) {
        console.log("overlay edit insert_at:", event);
         _this.validateShapeAndUpdate(newShape);
      });

      google.maps.event.addListener(newShape.getPath(), 'remove_at', function(event) {
        console.log("overlay edit remove_at:", event);
         _this.validateShapeAndUpdate(newShape);
      });
     // setSelection(newShape);
    //});
    });
    
    this.setState({map: map, infoWindow: infoWindow});
    console.log('Map.componentDidMount end!!!');
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
    }
    this.props.onNeighbourhoodChange(changed);
  }

  validNeighbourhoodArea(newShape) {
    let area = google.maps.geometry.spherical.computeArea(newShape.getPath());
    
    console.log('Map.validNeighbourhoodArea()| area of polygon:', area);
    if(area > 250000 || area < 1000)
    {
      let centerPos = this.findPolygonCenter(newShape.getPath());
      let pos = new google.maps.LatLng(parseFloat(centerPos[0]), parseFloat(centerPos[1]));
      console.log('Map.validNeighbourhoodArea()| center of polygon:', centerPos, pos);
      this.handleMapError('Neighbourhood area must be between 1000 and 250000 sq meters, your drawing area: ' + area + ' sq meters', centerPos);
      return false;
    }
    return true;
  }

  findIntersectsAndShowError(inputShape) {
    let geometry = new AntykaGeometry();
    console.log('findIntersectsAndShowError():' );
    let hasIntersection = false;
    _.forEach(this.state.existingPolygons, (existingPolygon) => {
      let intersection = geometry.isIntersectingPolygon(inputShape.getPath(), existingPolygon.getPath());
      if(intersection) {
        let pos = new google.maps.LatLng(parseFloat(intersection[0].x),parseFloat(intersection[0].y));
        console.debug('AMIT:', intersection, pos);
        this.handleMapError('Your neighbourhood can not overlap with existing neighbourhoods, please retry or modify this...', pos);
        hasIntersection = true;
        return;
      }
    });
    return hasIntersection;
  }
  
  findSelfIntersectsAndShowError(inputShape) {
    let geometry = new AntykaGeometry();

    let intersections = geometry.findSelfIntersects(inputShape.getPath());

    //console.log("findSelfIntersectsAndShowError() Patharray:", inputShape.getPath().getArray());
    console.log("findSelfIntersectsAndShowError() intersections:", intersections);
    

    if(intersections) {
      //offenderVertex = offenderVertex ? inputShape.getPath().getArray()[offenderVertex] : inputShape.getPath().getArray()[0];
      let pos = new google.maps.LatLng(parseFloat(intersections[0][0]),parseFloat(intersections[0][1]));
      console.debug('AMIT:', intersections, pos);
      this.handleMapError('A self interescting polygon can not be a neighbourhood, please retry or modify this...', pos);
      return true;
      //newShape.setMap(null);
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



  shouldComponentUpdate(nextProps, nextStates) {
    console.log('shouldComponentUpdate() position:', this.props.position, nextProps.position, this.props.position !== nextProps.position);
    console.log('shouldComponentUpdate() drawMode:', this.props.drawMode, nextProps.drawMode, this.props.drawMode !== nextProps.drawMode);
    console.log('shouldComponentUpdate() existingPolygons:', this.state.existingPolygons, nextStates.existingPolygons, this.state.existingPolygons !== nextStates.existingPolygons);
    //return this.props.position !== nextProps.position || this.props.drawMode !== nextProps.drawMode;
    return this.props.position !== nextProps.position || this.props.drawMode !== nextProps.drawMode || this.state.existingPolygons !== nextStates.existingPolygons;
  }

  findAndSetLocation(lat, lng, showInfo, msg) {
    let map = this.state.map;
    if(map) {
      let pos = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
      map.setCenter(pos);
      if(showInfo) {
        let infoWindow = this.state.infoWindow;//new google.maps.InfoWindow({map: map});
        infoWindow.setPosition(pos);
        if(!msg) {
          infoWindow.setContent('Location: (lat,long)=('+lat+', '+lng+')');
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
    return (map !== null && typeof map !== "undefined");
  }

  findCurrentGeoLocation() {
    //let _this = this;
    if (navigator.geolocation) { // Try HTML5 geolocation.
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        this.findAndSetLocation(lat, lng, true, 'We\'ve found your location.(lat,long)=(' + lat + ', ' + lng + ')');
      }, function() {
        this.handleLocationError(true);
      })
    } else {
      this.handleLocationError(false);
    }
  }


  render() {
    console.log('Map.render()| position:', this.props.position);
    console.log('Map.render()| states:', this.state);

    //let map = this.state.map;
    //let infoWindow = new google.maps.InfoWindow({map: map});

    this.renderExistingNeighbourhoods();

    if(this.props.drawMode) {
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      this.closeInfoWindow();
    } else {
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
