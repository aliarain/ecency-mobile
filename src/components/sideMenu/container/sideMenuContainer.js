import React, { Component } from 'react';
import { connect } from 'react-redux';

// Actions
import { getUserData } from '../../../realm/realm';
import { switchAccount } from '../../../providers/steem/auth';
import { updateCurrentAccount } from '../../../redux/actions/accountAction';
import { openPinCodeModal } from '../../../redux/actions/applicationActions';

// Constanst
import { default as ROUTES } from '../../../constants/routeNames';

// Component
import { SideMenuView } from '..';

const DEFAULT_IMAGE = require('../../../assets/esteem.png');

/*
  *               Props Name                              Description
  *@props -->     props name navigation                   coming from react-navigation
  *
  */

class SideMenuContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
    };
  }

  // Component Life Cycle Functions

  componentWillMount() {
    const accounts = [];

    getUserData().then((userData) => {
      userData.forEach((element) => {
        accounts.push({
          name: `@${element.username}`,
          image: element.avatar ? { uri: element.avatar } : DEFAULT_IMAGE,
        });
      });
      accounts.push({
        name: 'Add Account',
        route: ROUTES.SCREENS.LOGIN,
        icon: 'plus-square-o',
      });
      this.setState({ accounts });
    });
  }

  // Component Functions

  _navigateToRoute = (route = null) => {
    const { navigation } = this.props;
    if (route) {
      navigation.navigate(route);
    }
  };

  _switchAccount = (username = null) => {
    const { dispatch } = this.props;

    username = username.slice(1);
    switchAccount(username).then((accountData) => {
      dispatch(updateCurrentAccount(accountData));
      dispatch(openPinCodeModal());
    });
  };

  render() {
    const { currentAccount, isLoggedIn } = this.props;
    const { accounts } = this.state;

    return (
      <SideMenuView
        navigateToRoute={this._navigateToRoute}
        isLoggedIn={isLoggedIn}
        userAvatar={null}
        accounts={accounts}
        currentAccount={currentAccount}
        switchAccount={this._switchAccount}
      />
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.application.isLoggedIn || false,
  currentAccount: state.account.currentAccount || {},
});

export default connect(mapStateToProps)(SideMenuContainer);
