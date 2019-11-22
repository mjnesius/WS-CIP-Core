// Copyright 2019 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.​

/**
 * This is an example component used to showcase authentication
 * @type {Class}
 */

// React
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {StoreContext} from './StoreContext';

// Components
import TopNavActionsList from 'calcite-react/TopNav/TopNavActionsList';
import ArcgisAccount from 'calcite-react/ArcgisAccount';
import ArcgisAccountMenuItem from 'calcite-react/ArcgisAccount/ArcgisAccountMenuItem';
import Button from 'calcite-react/Button';

// Class
class UserAccount extends Component {
  render() {
    const signedInActionsComponent = this.props.user ? (
      <TopNavActionsList style={{ padding: 0 }}>
        <ArcgisAccount
          user={this.props.user}
          portal={this.props.portal}
          onRequestSwitchAccount={() => console.log('switch account clicked')}
          onRequestSignOut={this.props.signOut}
          hideSwitchAccount={true}
        >
          <ArcgisAccountMenuItem
            onClick={() => window.location.href = (this.props.config.portalUrl + '/home/user.html')}
          >
            Profile & Settings
          </ArcgisAccountMenuItem>
          <ArcgisAccountMenuItem
            onClick={() => window.location.href = (this.props.config.portalUrl + '/home/index.html')}
          >
            TLCGIS Home
          </ArcgisAccountMenuItem>
          <ArcgisAccountMenuItem
            onClick={() => window.location.href = (this.props.config.portalUrl + '/home/group.html?id=5bc520989e654bb7a092a62baacbae18#overview')}
          >
            ArcGIS Online Water-Sewer Group
          </ArcgisAccountMenuItem>
        </ArcgisAccount>
      </TopNavActionsList>
    ) : null;

    const signedOutActionsComponent = (
      <TopNavActionsList>
        <Button
          clear
          onClick={this.props.signIn}
        >
          Sign In
        </Button>
      </TopNavActionsList>
    );

    let outputComponent = this.props.loggedIn ?
      signedInActionsComponent :
      signedOutActionsComponent;

    return (
      <div>{outputComponent}</div>
    )
  }
}

const mapStateToProps = state => ({
  config: state.config
});

//export default UserAccount;
export default connect(mapStateToProps, null, null, {context:StoreContext})(UserAccount)
