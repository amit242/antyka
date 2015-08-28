
import React, { PropTypes } from 'react';
import styles from './MapPage.less';
import withStyles from '../../decorators/withStyles';
import withAuthentication from '../../decorators/withAuthentication';
import TextBox from '../TextBox';
import Map from '../Map';
// import Link from '../../utils/Link';
// import AppActions from '../../actions/AppActions';
// import AuthService from '../../auth/AuthService';

@withAuthentication
@withStyles(styles)

class MapPage extends React.Component {
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      lat: '',
      lng: '',
      position: {
        lat: '',
        lng: ''
      },
      drawMode : false
    };
  }

  // shouldComponentUpdate(nextProps, nextStates) {
  //   // console.log('MapPage.shouldComponentUpdate()| existing props:', this.props);
  //   // console.log('MapPage.shouldComponentUpdate()| nextProps:', nextProps);
  //   console.log('MapPage.shouldComponentUpdate()| result:', this.state.position !== nextStates.position);
    
  //   console.log('MapPage.shouldComponentUpdate()| this.state:', this.state.position);
  //   console.log('MapPage.shouldComponentUpdate()| nextStates:', nextStates.position);

  //   //console.log('MapPage.shouldComponentUpdate()| context:', this.context);
  //   //return this.props.position !== nextProps.position;
  //   return true;
  // }

  findLocation(event) {
    //console.log('AMIT click:', this.state.position);
    //let pos = this.state.position;
    let lat = this.state.lat;
    let lng = this.state.lng;
    //alert(this.state.position.lat + ', ' + this.state.position.lng);
    this.setState({position:{lat: lat, lng: lng}});
  }

  findCurrentLocation(event) {
    this.setState({position:{lat: '', lng: ''}});
  }

  findLocationByAddress(event) {
    let geocoder = new google.maps.Geocoder();
    console.debug('findLocationByAddress:', this.state.address);
    let _this = this;
    geocoder.geocode( { address: this.state.address}, function(results, status) {

      if (status == google.maps.GeocoderStatus.OK) {
        console.debug('GEOCODER LOCATION: ', results[0].geometry.location, status);
        //map.setCenter(results[0].geometry.location);
        let lat = results[0].geometry.location.A;
        let lng = results[0].geometry.location.F;
        _this.setState({position:{lat: lat, lng: lng}});
        // var marker = new google.maps.Marker({
        //     map: map,
        //     position: results[0].geometry.location
        // });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  drawNeighborhood(event) {
    this.setState({drawMode: !this.state.drawMode});
  }

  _onchange(event) {
    //console.log('RegisterPage._onchange()| event:', event.target);
    let controlState = {};


    controlState[event.target.id] = event.target.value;
    //console.log('MapPage._onchange()| controlState:', controlState);
    this.setState(controlState);
  }

  render() {
    //console.log('MapPage.render()| state:', this.state);
    let title = this.props.user.name;
    this.context.onSetTitle(title);
    return (
      <div className="mappage">
        <div className="mappage-floating">
          {/*<TextBox id="lat" className="mappage-TextBox" ref="lat" value={this.state.lat} type="text" placeholder="Latitude" onChange={this._onchange.bind(this)} />
          <TextBox id="lng"className="mappage-TextBox" ref="lng" value={this.state.lng} type="text" placeholder="Longitude" onChange={this._onchange.bind(this)} />
          <input type="button" value="Find Location" onClick={this.findLocation.bind(this)} />*/}
          <input type="button" value="Find my current location" onClick={this.findCurrentLocation.bind(this)} />
          <TextBox id="address" className="RegisterPage-textbox" ref="address" value={this.state.address} type="text" placeholder="address" maxLines={3} onChange={this._onchange.bind(this)}/>
          <input type="button" value="Find my address" onClick={this.findLocationByAddress.bind(this)} />
          <input type="button" value={this.state.drawMode ? "Remove Neighborhood": "Draw Neighborhood"} onClick={this.drawNeighborhood.bind(this)} />
        </div>
        <Map position={this.state.position} drawMode={this.state.drawMode}/>
      </div>
    );
  }
}

export default MapPage;
