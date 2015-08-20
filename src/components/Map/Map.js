import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import withStyles from '../../decorators/withStyles';
import styles from './Map.less';
import TextBox from '../TextBox';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';

@withStyles(styles)
class Map extends Component {

  static propTypes = {
    
  };

  static defaultProps = {
    maxLines: 1
  };

  constructor() {
    super();
    this.state = {
      address: '',
      error: false,
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
    let mapOptions = {
          center: {lat: -34.397, lng: 150.644},
          zoom: 15
        };
    let map = new google.maps.Map(React.findDOMNode(this), mapOptions);
    let infoWindow = new google.maps.InfoWindow({map: map});

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('We\'ve found your location.');
        map.setCenter(pos);
      }, function() {
        this.handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      this.handleLocationError(false, infoWindow, map.getCenter());
    }
    //let marker = new google.maps.Marker({position: this.mapCenterLatLng(), title: 'Hi', map: map});
    this.setState({map: map});
  }
  
  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
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
    return (
      <div className={classNames(this.props.className, 'Map')}>
      </div>
    );
  }

}

export default Map;
