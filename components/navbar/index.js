// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {updateChannelNotifyProps, favoriteChannel, unfavoriteChannel} from 'mattermost-redux/actions/channels';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {isCurrentChannelReadOnly} from 'mattermost-redux/selectors/entities/channels';

import {leaveChannel} from 'actions/views/channel';
import {
    closeRightHandSide as closeRhs,
    updateRhsState,
    showPinnedPosts,
    toggleMenu as toggleRhsMenu,
    closeMenu as closeRhsMenu,
} from 'actions/views/rhs';
import {toggle as toggleLhs, close as closeLhs} from 'actions/views/lhs';
import {getRhsState} from 'selectors/rhs';
import {RHSStates} from 'utils/constants.jsx';

import Navbar from './navbar.jsx';

function mapStateToProps(state) {
    const config = getConfig(state);
    const enableWebrtc = config.EnableWebrtc === 'true';

    const rhsState = getRhsState(state);

    return {
        isPinnedPosts: rhsState === RHSStates.PIN,
        enableWebrtc,
        isReadOnly: isCurrentChannelReadOnly(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            closeLhs,
            closeRhs,
            closeRhsMenu,
            leaveChannel,
            markFavorite: favoriteChannel,
            showPinnedPosts,
            toggleLhs,
            toggleRhsMenu,
            unmarkFavorite: unfavoriteChannel,
            updateChannelNotifyProps,
            updateRhsState,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
