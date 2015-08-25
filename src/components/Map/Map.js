import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import withStyles from '../../decorators/withStyles';
import styles from './Map.less';
import TextBox from '../TextBox';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';

@withStyles(styles)
class Map extends Component {

  static propTypes = {
    position: PropTypes.instanceOf(Object).isRequired
  };

  static defaultProps = {
    
  };

  constructor() {
    super();
    this.state = {
      //address: '',
      error: false,
      xx: true,
      map:null
    };
  }

  _onchange(event) {
    //console.log('RegisterPage._onchange()| event:', event.target);
    let controlState = {};
    controlState[event.target.id] = event.target.value;
    //console.log('RegisterPage._onchange()| controlState:', controlState);
    this.setState(controlState);
  }

  componentDidMount(rootNode) {
    console.log('Map.componentDidMount()| position:', this.props.position);
    let mapOptions = {
          center: {lat: -34.397, lng: 150.644},
          zoom: 15
        };
    let map = new google.maps.Map(React.findDOMNode(this), mapOptions);
    let infoWindow = new google.maps.InfoWindow({map: map});

    let drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        /*markerOptions: {icon: 'images/beachflag.png'},
        circleOptions: {
          fillColor: '#ffff00',
          fillOpacity: 1,
          strokeWeight: 5,
          clickable: false,
          editable: true,
          zIndex: 1
        },*/
        drawingModes: [
          //google.maps.drawing.OverlayType.MARKER,
          //google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON
          //google.maps.drawing.OverlayType.POLYLINE,
          //google.maps.drawing.OverlayType.RECTANGLE
        ]
      }
    });
    drawingManager.setMap(map);
    
    //let marker = new google.maps.Marker({position: this.mapCenterLatLng(), title: 'Hi', map: map});
    this.setState({map: map, infoWindow: infoWindow});
  }
  
  handleLocationError(browserHasGeolocation) {
    let map = this.state.map;
    let infoWindow = this.state.infoWindow;//new google.maps.InfoWindow({map: map});
    infoWindow.setPosition(map.getCenter());
    infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  }



  shouldComponentUpdate(nextProps, nextStates) {
    // console.log('Map.shouldComponentUpdate()| existing props:', this.props.position);
    // console.log('Map.shouldComponentUpdate()| nextProps:', nextProps.position);
    // console.log('Map.shouldComponentUpdate()| result:', this.props.position !== nextProps.position);
    
    // console.log('Map.shouldComponentUpdate()| this.state:', this.state.position);
    // console.log('Map.shouldComponentUpdate()| nextStates:', nextStates.position);
    // console.log('Map.shouldComponentUpdate()| context:', this.context);
    //return this.props.position !== nextProps.position;
    return this.props.position !== nextProps.position;
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

  isInfoWindowOpen(infoWindow){
    let map = infoWindow.getMap();
    return (map !== null && typeof map !== "undefined");
  }

  findCurrentGeoLocation() {
    //let _this = this;
    if (navigator.geolocation) { // Try HTML5 geolocation.
      navigator.geolocation.getCurrentPosition((position)=>{
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        this.findAndSetLocation(lat, lng, true, 'We\'ve found your location.(lat,long)=('+lat+', '+lng+')')
      }, function() {
        this.handleLocationError(true);
      })
    } else {
      this.handleLocationError(false);
    }
  }


  render() {
    // AIzaSyAUsqkMf9FRbzgW03mXu-OZORZLNyvRyZM
    // if(canUseDOM) {
    //   console.log('Map.render()|:', this.getDOMNode());
    //     map = new google.maps.Map(this.getDOMNode(),  {
    //       center: {lat: -34.397, lng: 150.644},
    //       zoom: 8
    //     });
    // }
    console.log('Map.render()| position:', this.props.position);
    console.log('Map.render()| states:', this.state);

    //let map = this.state.map;
    //let infoWindow = new google.maps.InfoWindow({map: map});
    if(this.props.position && this.props.position.lat && this.props.position.lng) {
      console.log('Map.render()| Has position:', this.props.position.lat, this.props.position.lng);
      this.findAndSetLocation(this.props.position.lat, this.props.position.lng, true);
    } else {
      this.findCurrentGeoLocation();
    }

    return (
      <div className={classNames(this.props.className, 'Map')}>
      </div>
    );
  }

}

export default Map;
