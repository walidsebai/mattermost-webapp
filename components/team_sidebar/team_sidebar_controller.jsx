// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import $ from 'jquery';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import Permissions from 'mattermost-redux/constants/permissions';
import classNames from 'classnames';

import {filterAndSortTeamsByDisplayName} from 'utils/team_utils.jsx';

import * as Utils from 'utils/utils.jsx';

import SystemPermissionGate from 'components/permissions_gates/system_permission_gate';
import Pluggable from 'plugins/pluggable';

import TeamButton from './components/team_button.jsx';

export default class TeamSidebar extends React.Component {
    static propTypes = {
        teams: PropTypes.arrayOf(Object).isRequired,
        currentTeamId: PropTypes.string.isRequired,
        moreTeams: PropTypes.bool.isRequired,
        isOpen: PropTypes.bool.isRequired,
        experimentalPrimaryTeam: PropTypes.string,
        enableTeamCreation: PropTypes.bool.isRequired,
        actions: PropTypes.shape({
            getTeams: PropTypes.func.isRequired,
        }).isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            isMobile: Utils.isMobile(),
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.props.actions.getTeams(0, 200);
        this.setStyles();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.state.isMobile) {
            $('.team-wrapper').perfectScrollbar();
        }

        // reset the scrollbar upon switching teams
        if (this.state.currentTeam !== prevState.currentTeam) {
            this.refs.container.scrollTop = 0;
            if (!this.state.isMobile) {
                $('.team-wrapper').perfectScrollbar('update');
            }
        }

        if (this.props.teams !== prevProps.teams) {
            this.setStyles();
        }
    }

    handleResize = () => {
        this.setState({isMobile: Utils.isMobile()});
        this.setStyles();
    }

    setStyles = () => {
        const root = document.querySelector('#root');

        if (this.shouldShow()) {
            root.classList.add('multi-teams');
        } else {
            root.classList.remove('multi-teams');
        }
    }

    shouldShow = () => {
        return this.props.teams && this.props.teams.length > 1;
    }

    render() {
        if (!this.shouldShow()) {
            return null;
        }

        const myTeams = this.props.teams;
        const moreTeams = this.props.moreTeams;

        const teams = filterAndSortTeamsByDisplayName(myTeams).
            map((team) => {
                return (
                    <TeamButton
                        key={'switch_team_' + team.name}
                        url={`/${team.name}`}
                        tip={team.display_name}
                        active={team.id === this.props.currentTeamId}
                        isMobile={this.state.isMobile}
                        displayName={team.display_name}
                        unread={team.unread}
                        mentions={team.mentions}
                        teamIconUrl={Utils.imageURLForTeam(team)}
                    />
                );
            });

        if (moreTeams && !this.props.experimentalPrimaryTeam) {
            teams.push(
                <TeamButton
                    btnClass='team-btn__add'
                    key='more_teams'
                    url='/select_team'
                    isMobile={this.state.isMobile}
                    tip={
                        <FormattedMessage
                            id='team_sidebar.join'
                            defaultMessage='Other teams you can join.'
                        />
                    }
                    content={'+'}
                />
            );
        } else {
            teams.push(
                <SystemPermissionGate
                    permissions={[Permissions.CREATE_TEAM]}
                    key='more_teams'
                >
                    <TeamButton
                        btnClass='team-btn__add'
                        url='/create_team'
                        isMobile={this.state.isMobile}
                        tip={
                            <FormattedMessage
                                id='navbar_dropdown.create'
                                defaultMessage='Create a New Team'
                            />
                        }
                        content={'+'}
                    />
                </SystemPermissionGate>
            );
        }

        teams.push(
            <div
                key='team-sidebar-bottom-plugin'
                className='team-sidebar-bottom-plugin'
            >
                <Pluggable pluggableName='BottomTeamSidebar'/>
            </div>
        );

        return (
            <div className={classNames('team-sidebar', {'move--right': this.props.isOpen})}>
                <div className='team-wrapper'>
                    {teams}
                </div>
            </div>
        );
    }
}
