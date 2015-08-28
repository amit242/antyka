import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import withStyles from '../../decorators/withStyles';
import styles from './Map.less';
import TextBox from '../TextBox';
import AntykaGeometry from './AntykaGeometry';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';

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
    this.existingPolygons = this.loadExistingPolygons();
    this.state = {
      //address: '',
      error: false,
      xx: true,
      neighborhood: null,
      map:null
    };
  }

  loadExistingNeighborhoods(map) {
    console.debug('Loading Existing Neighborhoods...');
    //-------test polygon
    // Define the LatLng coordinates for the polygon's path.
    
    /*var triangleCoords = [
    {lat: 25.774, lng: -80.190},
    {lat: 18.466, lng: -66.118},
    {lat: 32.321, lng: -64.757},
    {lat: 25.774, lng: -80.190}
  ];*/

    // Construct the polygon.
    
    //let map = this.state.map;
    this.existingPolygons.setMap(map);
    //---------------------------------
  }

  loadExistingPolygons() {
    let triangleCoords = [
      {lat: 22.572646, lng: 88.36389500000001},
      {lat: 22.582647, lng: 88.373896},
      {lat: 22.592649, lng: 88.363897},
      {lat: 22.582546, lng: 88.383895}
    ];

    let test = new google.maps.Polygon({
      paths: triangleCoords,
      strokeColor: '#008888',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      zIndex: 2
    });

    return test;
  }

  componentDidMount(rootNode) {
    console.log('Map.componentDidMount()| position:', this.props.position);
    let mapOptions = {
          center: {lat: -34.397, lng: 150.644},
          zoom: 15
        };
    let map = new google.maps.Map(React.findDOMNode(this), mapOptions);
    let infoWindow = new google.maps.InfoWindow({map: map});

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
      if(event.overlay.getPath().getArray().length <= 2) {
        _this.handleMapError('This is not a neighborhood. Remove this and try again...', event.overlay.getPath().getAt(0));
        return;
      }
      

      if(!_this.findSelfIntersectsAndShowError(newShape)) {
        _this.findIntersectsAndShowError(newShape);
      }

      

      _this.setState({neighborhood: newShape});

      console.debug('Overlay complete polygon:', newShape);
      

      google.maps.event.addListener(newShape, 'click', function(event) {
         console.log('overlay click:', event);
      });
      google.maps.event.addListener(newShape.getPath(), 'set_at', function(event) {
          console.debug("overlay edit set_at:", event, newShape.getPath().getArray());
          if(!_this.findSelfIntersectsAndShowError(newShape)) {
            _this.findIntersectsAndShowError(newShape);
          }
      });

      google.maps.event.addListener(newShape.getPath(), 'insert_at', function(event) {
          console.log("overlay edit insert_at:", event);
          if(!_this.findSelfIntersectsAndShowError(newShape)) {
            _this.findIntersectsAndShowError(newShape);
          }
      });

      google.maps.event.addListener(newShape.getPath(), 'remove_at', function(event) {
          console.log("overlay edit remove_at:", event);
      });
     // setSelection(newShape);
    //});
    });
    
    this.setState({map: map, infoWindow: infoWindow});
    this.loadExistingNeighborhoods(map);
  }

  findIntersectsAndShowError(inputShape) {
    let geometry = new AntykaGeometry();
    console.log('findIntersectsAndShowError():' )
    let intersection = geometry.isIntersectingPolygon(inputShape.getPath(), this.existingPolygons.getPath());
    if(intersection) {
      let pos = new google.maps.LatLng(parseFloat(intersection[0].x),parseFloat(intersection[0].y));
      console.debug('AMIT:', intersection, pos);
      this.handleMapError('Your neighborhood can not overlap with existing neighborhoods, please retry or modify this...', pos);
      return true;
    }
    return false;
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
      this.handleMapError('A self interescting polygon can not be a neighborhood, please retry or modify this...', pos);
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
    //return this.props.position !== nextProps.position || this.props.drawMode !== nextProps.drawMode;
    return this.props.position !== nextProps.position || this.props.drawMode !== nextProps.drawMode;
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


    if(this.props.drawMode) {
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      this.closeInfoWindow();
    } else {
      if(this.state.neighborhood) {
        this.state.neighborhood.setMap(null);
        this.closeInfoWindow();
      } else {
          if(this.props.position && this.props.position.lat && this.props.position.lng) {
            console.log('Map.render()| Has position:', this.props.position.lat, this.props.position.lng);
            this.findAndSetLocation(this.props.position.lat, this.props.position.lng, true);
          } else {
            this.findCurrentGeoLocation();
          }
      }
    }

    return (
      <div className={classNames(this.props.className, 'Map')}>
      </div>
    );
  }
}

export default Map;
