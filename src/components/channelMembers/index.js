//@flow
import React, { Component } from 'react';
import { UserListItem } from '../listItems';
import { Button } from '../buttons';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
import { LoadingCard } from '../loading';
import { NullCard } from '../upsell';
import { getChannelMembersQuery } from '../../api/channel';
import { FetchMoreButton } from '../threadFeed/style';
import {
  StyledCard,
  ListHeader,
  LargeListHeading,
  ListContainer,
  ListFooter,
} from '../listItems/style';

const ErrorState = () =>
  <NullCard
    bg="error"
    heading={`Whoops!`}
    copy={`Something went wrong on our end... Mind reloading?`}
  >
    <Button icon="view-reload" onClick={() => window.location.reload(true)}>
      Reload
    </Button>
  </NullCard>;

class ChannelMembers extends Component {
  render() {
    const { data: { error, channel, networkStatus, fetchMore } } = this.props;
    const members =
      channel &&
      channel.memberConnection &&
      channel.memberConnection.edges.map(member => member.node);
    const totalCount = channel && channel.metaData && channel.metaData.members;

    if (networkStatus === 1) {
      return <LoadingCard />;
    } else if (error) {
      return <ErrorState />;
    } else {
      return (
        <StyledCard>
          <ListHeader>
            <LargeListHeading>
              {totalCount} Members
            </LargeListHeading>
          </ListHeader>

          <ListContainer>
            {members &&
              members.map(user => {
                return (
                  <section key={user.id}>
                    <UserListItem user={user} />
                  </section>
                );
              })}
          </ListContainer>

          {channel.memberConnection.pageInfo.hasNextPage &&
            <ListFooter>
              <FetchMoreButton
                color={'brand.default'}
                loading={networkStatus === 3}
                onClick={() => fetchMore()}
              >
                Load more
              </FetchMoreButton>
            </ListFooter>}
        </StyledCard>
      );
    }
  }
}

export default compose(getChannelMembersQuery, pure)(ChannelMembers);