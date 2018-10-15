// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {leaveChannel as leaveChannelRedux, unfavoriteChannel} from 'mattermost-redux/actions/channels';
import {getDefaultChannel} from 'mattermost-redux/selectors/entities/channels';
import {getCurrentRelativeTeamUrl} from 'mattermost-redux/selectors/entities/teams';
import {getMyPreferences} from 'mattermost-redux/selectors/entities/preferences';
import {isFavoriteChannel} from 'mattermost-redux/utils/channel_utils';

import {ActionTypes} from 'utils/constants.jsx';
import {isMobile} from 'utils/utils.jsx';

export function checkAndSetMobileView() {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.UPDATE_MOBILE_VIEW,
            data: isMobile(),
        });
    };
}

export function leaveChannel(channelId) {
    return async (dispatch, getState) => {
        const state = getState();
        const defaultChannel = getDefaultChannel(state);
        const myPreferences = getMyPreferences(state);

        if (isFavoriteChannel(myPreferences, channelId)) {
            dispatch(unfavoriteChannel(channelId));
        }

        const {error} = await dispatch(leaveChannelRedux(channelId));
        if (error) {
            return {error};
        }

        return {
            data: {
                defaultChannelUrl: `${getCurrentRelativeTeamUrl(state)}/channels/${defaultChannel.name}`,
            },
        };
    };
}
