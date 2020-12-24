import Constants from '../helper/constants';
import TurmsClient from '../../src/turms-client';
import TurmsStatusCode from '../../src/model/turms-status-code'
import {im} from '../../src/model/proto-bundle';
import UserStatus = im.turms.proto.UserStatus;
import ResponseAction = im.turms.proto.ResponseAction;

let turmsClient: TurmsClient;
let userStatus = UserStatus.AWAY;
let relationshipGroupIndex;

beforeAll(() => {
    turmsClient = new TurmsClient(Constants.WS_URL);
});

afterAll(async () => {
    if (turmsClient.driver.isConnected()) {
        await turmsClient.driver.disconnect();
    }
});

describe('Constructor', () => {
    it('constructor_shouldReturnNotNullGroupServiceInstance', () => {
        expect(turmsClient.userService).toBeTruthy();
    })
});

describe('Login', () => {
    it('login_shouldSucceed', async () => {
        const result = await turmsClient.userService.login('1', '123');
        expect(result).toBeFalsy();
    });
    it('relogin_shouldSucceed', async () => {
        await turmsClient.userService.logout();
        const result = await turmsClient.userService.relogin();
        expect(result).toBeFalsy();
    })
});

describe('Create', () => {
    it('createRelationship_shouldSucceed', async () => {
        try {
            const result = await turmsClient.userService.createRelationship('10', true);
            expect(result).toBeFalsy();
        } catch (e) {
            expect(e.code).toEqual(TurmsStatusCode.CREATE_EXISTING_RELATIONSHIP);
        }
    });
    it('createFriendRelationship_shouldSucceed', async () => {
        try {
            const result = await turmsClient.userService.createFriendRelationship('10');
            expect(result).toBeFalsy();
        } catch (e) {
            expect(e.code).toEqual(TurmsStatusCode.CREATE_EXISTING_RELATIONSHIP);
        }
    });
    it('createBlacklistedUserRelationship_shouldSucceed', async () => {
        try {
            const result = await turmsClient.userService.createBlacklistedUserRelationship('10');
            expect(result).toBeFalsy();
        } catch (e) {
            expect(e.code).toEqual(TurmsStatusCode.CREATE_EXISTING_RELATIONSHIP);
        }
    });
    it('sendFriendRequest_shouldReturnFriendRequestId', async () => {
        try {
            const friendRequestId = await turmsClient.userService.sendFriendRequest('11', 'content');
            expect(friendRequestId).toBeTruthy();
        } catch (e) {
            expect(e.code).toEqual(TurmsStatusCode.CREATE_EXISTING_FRIEND_REQUEST);
        }
    });
    it('createRelationshipGroup_shouldReturnRelationshipGroupIndex', async () => {
        try {
            relationshipGroupIndex = await turmsClient.userService.createRelationshipGroup('newGroup');
            expect(relationshipGroupIndex).toBeTruthy();
        } catch (e) {
            expect(e.code).toEqual(TurmsStatusCode.CREATE_EXISTING_FRIEND_REQUEST);
        }
    });
});

describe('Update', () => {
    it('updateUserOnlineStatus_shouldSucceed', async () => {
        const result = await turmsClient.userService.updateUserOnlineStatus(userStatus);
        expect(result).toBeFalsy();
    });
    it('updatePassword_shouldSucceed', async () => {
        const result = await turmsClient.userService.updatePassword('123');
        expect(result).toBeFalsy();
    });
    it('updateProfile_shouldSucceed', async () => {
        const result = await turmsClient.userService.updateProfile('123', '123');
        expect(result).toBeFalsy();
    });
    it('updateRelationship_shouldSucceed', async () => {
        const result = await turmsClient.userService.updateRelationship('10', null, 1);
        expect(result).toBeFalsy();
    });
    it('replyFriendRequest_shouldSucceed', async () => {
        const result = await turmsClient.userService.replyFriendRequest('10', ResponseAction.ACCEPT, 'reason');
        expect(result).toBeFalsy();
    });
    it('updateRelationshipGroup_shouldSucceed', async () => {
        const result = await turmsClient.userService.updateRelationshipGroup(relationshipGroupIndex, 'newGroupName');
        expect(result).toBeFalsy();
    });
    it('moveRelatedUserToGroup_shouldSucceed', async () => {
        let result = await turmsClient.userService.moveRelatedUserToGroup('2', 1);
        expect(result).toBeFalsy();
        result = await turmsClient.userService.moveRelatedUserToGroup('2', 0);
        expect(result).toBeFalsy();
    });
    it('updateLocation_shouldSucceed', async () => {
        const result = await turmsClient.userService.updateLocation(2, 2);
        expect(result).toBeFalsy();
    });
});

describe('Query', () => {
    it('queryUserProfile_shouldReturnUserInfoWithVersion', async () => {
        const result = await turmsClient.userService.queryUserProfile('1');
        expect(result).toBeTruthy();
    });
    it('queryUsersNearby_shouldReturnUserIdsOrSessionIds', async () => {
        const userIds = await turmsClient.userService.queryUserIdsNearby(1, 1);
        const sessionIds = await turmsClient.userService.queryUserSessionIdsNearby(1, 1);
        expect(userIds || sessionIds).toBeTruthy();
    });
    it('queryUserInfosNearby_shouldReturnUsersInfos', async () => {
        const result = await turmsClient.userService.queryUserInfosNearby(1, 1);
        expect(result).toBeTruthy();
    });
    it('queryUserOnlineStatusesRequest_shouldUsersOnlineStatus', async () => {
        const result = await turmsClient.userService.queryUserOnlineStatusesRequest(['1']);
        expect(result[0].userStatus).toEqual(userStatus);
    });
    it('queryRelationships_shouldReturnUserRelationshipsWithVersion', async () => {
        const result = await turmsClient.userService.queryRelationships(['2']);
        expect(result).toBeTruthy();
    });
    it('queryRelatedUserIds_shouldReturnRelatedUserIds', async () => {
        const result = await turmsClient.userService.queryRelatedUserIds();
        expect(result).toBeTruthy();
    });
    it('queryFriends_shouldReturnFriendRelationships', async () => {
        const result = await turmsClient.userService.queryFriends();
        expect(result).toBeTruthy();
    });
    it('queryBlacklistedUsers_shouldReturnBlacklist', async () => {
        const result = await turmsClient.userService.queryBlacklistedUsers();
        expect(result).toBeTruthy();
    });
    // TODO: Extend the query friend request
    // it('queryFriendRequests_shouldReturnFriendRequests', async () => {
    //     const result = await turmsClient.userService.queryFriendRequests();
    //     expect(result).toBeTruthy();
    // });
    it('queryRelationshipGroups_shouldReturnRelationshipGroups', async () => {
        const result = await turmsClient.userService.queryRelationshipGroups();
        expect(result).toBeTruthy();
    });
});

describe('Delete', () => {
    it('deleteRelationship_shouldSucceed', async () => {
        const result = await turmsClient.userService.deleteRelationship('10');
        expect(result).toBeFalsy();
    });
    it('deleteRelationship_shouldSucceed', async () => {
        const result = await turmsClient.userService.deleteRelationshipGroups(relationshipGroupIndex);
        expect(result).toBeFalsy();
    })
});

describe('Logout', () => {
    it('logout_shouldSucceed', async () => {
        const result = await turmsClient.userService.logout();
        expect(result).toBeFalsy();
    });
});