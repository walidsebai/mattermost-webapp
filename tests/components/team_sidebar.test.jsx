// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import assert from 'assert';

import deepFreezeAndThrowOnMutation from 'mattermost-redux/utils/deep_freeze';

import {moreTeamsToJoin} from 'components/team_sidebar/selectors';

describe('components/TeamSidebar.selectors', () => {
    const team1 = {name: 'team1', delete_at: 0};
    const team2 = {name: 'team2', allow_open_invite: true, delete_at: 0};

    describe('moreTeamsToJoin', () => {
        test('should be teams to join', () => {
            const testState = deepFreezeAndThrowOnMutation({
                entities: {
                    teams: {
                        teams: {team1, team2},
                        myMembers: {team1: {team_id: 'team1'}},
                    },
                },
            });

            assert.deepEqual(moreTeamsToJoin(testState), true);
        });

        test('should be no teams to join', () => {
            const testState = deepFreezeAndThrowOnMutation({
                entities: {
                    teams: {
                        teams: {team1, team2},
                        myMembers: {team1: {team_id: 'team1'}, team2: {team_id: 'team2'}},
                    },
                },
            });

            assert.deepEqual(moreTeamsToJoin(testState), false);
        });
    });
});
