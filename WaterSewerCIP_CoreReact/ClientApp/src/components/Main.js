// Based on ESRI's esri-react-boot template​

// React
import React, { Component } from 'react';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as mapActions } from '../redux/reducers/map';
import { actions as authActions } from '../redux/reducers/auth';

import {StoreContext} from './StoreContext';

// Components
import Navbar from 'react-bootstrap/Navbar';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import TopNavBrand from 'calcite-react/TopNav/TopNavBrand';
import TopNavTitle from 'calcite-react/TopNav/TopNavTitle';

import Map from './esri/map/Map';
import LoadScreen from './LoadScreen';
import UserAccount from './UserAccount';
import logo from '../styles/images/Logo.svg';
import FilterComponent from './Filters';
import AttributesPanel from './AttributesPanel';

// Styled Components
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 100%;
  height: 100%;
  text-align: center;
`;

const MapWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
  z-index: 0;
  overflow: hidden;
`;

const Logo = styled(TopNavBrand)`
  justify-content: center;
  & img {
    width="30"
    height="50"
        className="align-top"
  },
  background-color: $light-blue;
`;



// Class
class Main extends Component {
  signIn = () => {
    this.props.checkAuth('https://www.arcgis.com');
  }

  signOut = () => {
    this.props.logout();
  }

  render() {
    return (
      <Container className="bg-light m-0 p-0">
        <LoadScreen isLoading={this.props.mapLoaded} />
        <Row className="bg-light m-0 mb-n1 p-0">
          <Col lg={3} className="bg-light m-0 mt-1 p-0 mx-auto">
            <Navbar expand="lg" bg="light" variant="dark" className="bg-light m-0 mt-2 p-0">
              <Logo  className="bg-light m-0 p-0 mx-auto" href="#" src={logo} />
              <TopNavTitle  className="bg-light m-0 p-0 mx-auto" href="#">Water Sewer CIP</TopNavTitle>
            </Navbar>
          </Col>

          <Col lg={true} className="bg-light m-0 mt-2 p-0 mx-auto" >
            <FilterComponent/>
          </Col>

          <Col lg={2} className="bg-light m-0 p-0 mx-auto">
            <Navbar expand="lg" className="bg-light m-0 mt-0 p-0">
              <Navbar.Collapse id="basic-navbar-nav">
                <UserAccount  
                  user={this.props.auth.user}
                  portal={this.props.auth.user ? this.props.auth.user.portal : null}
                  loggedIn={this.props.auth.loggedIn}
                  signIn={this.signIn}
                  signOut={this.signOut}>
                </UserAccount>
              </Navbar.Collapse>
            </Navbar>
          </Col>
        </Row>
        {this.props.attributesComponent && <AttributesPanel/>}
        <MapWrapper>
          <Map onMapLoaded={this.props.mapLoaded} onSetFeatures={this.props.setFeatures} onSetFilters={this.props.setFilter}
            mapConfig={this.props.config.mapConfig}
            is3DScene={false}
          />
        </MapWrapper>
      </Container>
    )
  }
}
//
const mapStateToProps = state => ({
  map: state.map,
  auth: state.auth,
  config: state.config,
  attributesComponent: state.map.attributesComponent
})

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    ...mapActions,
    ...authActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext})(Main)
