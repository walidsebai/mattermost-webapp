
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {createSelector} from 'reselect';
import {getJoinableTeams, getTeamMemberships} from 'mattermost-redux/selectors/entities/teams';

export const moreTeamsToJoin = createSelector(
    getJoinableTeams,
    getTeamMemberships,
    (joinableTeams, myTeamMembers) => {
        for (const id in joinableTeams) {
            if (!joinableTeams.hasOwnProperty(id)) {
                continue;
            }
            if (!myTeamMembers[id]) {
                return true;
            }
        }

        return false;
    }
);