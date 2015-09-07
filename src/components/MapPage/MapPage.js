 
import React, { PropTypes } from 'react';
import styles from './MapPage.less';
import classNames from 'classnames';
import withStyles from '../../decorators/withStyles';
import withAuthentication from '../../decorators/withAuthentication';
import TextBox from '../TextBox';
import Map from '../Map';
import NeighbourhoodService from '../../services/NeighbourhoodService';
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
      searchLocation: null,
      lat: '',
      lng: '',
      position: null,
      neighbourhood: null,
      googleMapLoaded: false,
      drawMode : false
    };
  }

  componentDidMount(rootNode) {
    console.log('MapPage.componentDidMount()| googleMapLoaded:', googleMapLoaded, this.props.user.address);
    this.checkIfGoogleMapLoaded();
    if(this.props.user && this.props.user.address) {
      //this.setState({address: this.props.user.address});
      //this.findLocationByAddress();
    }
  }

  checkIfGoogleMapLoaded() {
    console.log('MapPage.componentDidMount()| checkIfGoogleMapLoaded:', googleMapLoaded);
    if(!googleMapLoaded) { // check if google map was loaded
        setTimeout(this.checkIfGoogleMapLoaded.bind(this), 50);//wait 50 millisecnds then recheck
        return;
    }
    this.setState({googleMapLoaded: true});
  }

  findLocation(event) {
    //console.log('AMIT click:', this.state.position);
    //let pos = this.state.position;
    let lat = this.state.lat;
    let lng = this.state.lng;
    //alert(this.state.position.lat + ', ' + this.state.position.lng);
    this.setState({position:{lat: lat, lng: lng}});
  }

  findCurrentLocation(event) {
    if(this.state.position === null) { // TODO: this is bit hackey way to find current location on each click, need to find a better way
      this.setState({position: {lat: null, lng: null}});
    } else {
      this.setState({position: null});
    }
  }

  findLocationByUserAddress(event) {
    console.debug('findLocationByUserAddress:', this.props.user.address);
    let _this = this;
    if(this.props.user.neighbourhood) {
      NeighbourhoodService.searchNeighbourhoodById(this.props.user.neighbourhood, (neighbourhood)=> {
        console.log('MapPage.findLocationByUserAddress()| success callback:', neighbourhood)
        _this.setState({position : neighbourhood.neighbourhoodCenter});
      });

    } else {
      this.findLocation(this.props.user.address);
    }
  }

  findSearchedLocation(event) {
    console.debug('findSearchedLocation:', this.state.searchLocation);
    this.findLocation(this.state.searchLocation);
  }

  findLocation(location) {
    let geocoder = new google.maps.Geocoder();
    let _this = this;
    geocoder.geocode( { address: location}, function(results, status) {

      if (status == google.maps.GeocoderStatus.OK) {
        console.debug('GEOCODER LOCATION: ', results[0].geometry.location, status);
        //map.setCenter(results[0].geometry.location);
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();
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

  drawNeighbourhood(event) {
    this.setState({drawMode: true});
    //if(this.state.drawMode) {
      this.setState({neighbourhood: null});
    //}
  }


  selectNeighbourhood(event) {

  }

  discardDrawing(event) {
    console.log('MapPage.discardDrawing()|', this.state.neighbourhood);
    this.setState({drawMode: false, neighbourhood: null});
    /*if(this.state.drawMode) {
      this.setState({neighbourhood: null});
    }*/
  }

  saveNeighbourhood(event) {
    console.log('saveNeighbourhood()|', this.state.neighbourhood);
    NeighbourhoodService.saveNeighbourhood({encodedpolygon: this.state.neighbourhood.encodedpolygon, neighbourhoodCenter: this.state.neighbourhood.neighbourhoodCenter}, this.props.user._id, (error) => {
      alert(error);
    });
  }

  onNeighbourhoodChange(event) {
    console.log('MapPage.onNeighbourhoodChange()|', this.state.neighbourhood, arguments[0]);
    if(this.state.drawMode) {
      this.setState({neighbourhood: arguments[0]});
    }
  }


  toggleMapMenu(event) {
    this.setState({menu: !this.state.menu});
  }

  _onchange(event) {
    //console.log('RegisterPage._onchange()| event:', event.target);
    let controlState = {};


    controlState[event.target.id] = event.target.value;
    //console.log('MapPage._onchange()| controlState:', controlState);
    this.setState(controlState);
  }

  searchTextboxKeyPress(event) {
    if(event.which === 13) {
      this.findSearchedLocation(event);
    }

  }

  render() {
    console.debug('MapPage.render()| state:', this.state);
    console.debug('MapPage.render()| props:', this.props);
    //let title = this.props.user.name;
    this.context.onSetTitle('Map');
    let addressToolTip;
    if(this.props.user.neighbourhood) {
      addressToolTip = 'Go to my neighbourhood';
    } else {
     addressToolTip = 'Go to my address: "' + this.props.user.address + '"';
   }
    return (
      <div className="mappage">
        <div className="mappage-floating nowrap">
          <span className="mappage-floating-icon">
            <img className={classNames('icon-medium menu', this.state.menu ? 'selected' : '')} src={require('./map-menu.svg')} alt="Menu" title="Menu" onClick={this.toggleMapMenu.bind(this)}/>
          </span>
          <img className="icon-medium mappage-floating-icon search" src={require('./search.svg')} alt="Search" title="Search" onClick={this.findSearchedLocation.bind(this)} />
          <img className="icon-medium mappage-floating-icon map-pin" src={require('./map-pin.png')} alt="Find Current location" title="Find Current location" onClick={this.findCurrentLocation.bind(this)} />
          <img className="icon-medium mappage-floating-icon location" src={require('./postal-address.png')} alt={addressToolTip} title={addressToolTip} onClick={this.findLocationByUserAddress.bind(this)} />
          <TextBox className="mappage-floating-searchbox" id="searchLocation" ref="searchLocation" value={this.state.searchedLocation} type="text" placeholder="Search Location" onChange={this._onchange.bind(this)} onKeyDown={this.searchTextboxKeyPress.bind(this)} />
          {this.state.menu && <div>
            {/*<TextBox id="lat" className="mappage-TextBox" ref="lat" value={this.state.lat} type="text" placeholder="Latitude" onChange={this._onchange.bind(this)} />
            <TextBox id="lng"className="mappage-TextBox" ref="lng" value={this.state.lng} type="text" placeholder="Longitude" onChange={this._onchange.bind(this)} />
            <input type="button" value="Find Location" onClick={this.findLocation.bind(this)} />*/}
            {this.state.drawMode ? <div>
              <input type="button" value="Save Neighbourhood" disabled={!(this.state.neighbourhood && this.state.neighbourhood.isValid)} onClick={this.saveNeighbourhood.bind(this)} />
              <input type="button" value="Discard" onClick={this.discardDrawing.bind(this)} />
            </div> : this.props.user.neighbourhood ? <div>
              <input type="button" value="Update Neighbourhood" onClick={this.drawNeighbourhood.bind(this)} />
              <input type="button" value="Leave Neighbourhood" onClick={this.selectNeighbourhood.bind(this)} />
            </div> : <div>
              <input type="button" value="Draw Neighbourhood" onClick={this.drawNeighbourhood.bind(this)} />
              <input type="button" value="Choose Neighbourhood" onClick={this.selectNeighbourhood.bind(this)} />
            </div>}
          </div>}
        </div>
        {this.state.neighbourhood && !this.state.neighbourhood.isValid && <span className="mappage-floating bottom error">{this.state.neighbourhood.errorMsg}</span>}
        {this.state.googleMapLoaded && <Map {...this.props} position={this.state.position} drawMode={this.state.drawMode} onNeighbourhoodChange={this.onNeighbourhoodChange.bind(this)}/>}
      </div>
    );
  }
}

export default MapPage;
