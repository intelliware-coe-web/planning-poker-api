const {stub, assert} = require('sinon');
const MeetingService = require('./meetingService');
const ServiceComposer = require('../serviceComposer');
const fixture = require('./meetingController');

describe('Meeting Controller', () => {
    let req = {}, res = {};
    let mockServiceComposer;

    before(() => {
        mockServiceComposer = stub(ServiceComposer, 'compose');
    });

    after(() => {
        mockServiceComposer.restore();
    });

    describe('listMeetings', () => {
        let mockListMeetings;

        before(() => {
            mockListMeetings = stub(MeetingService, 'list_meetings');
        });
        after(() => {
            mockListMeetings.restore();
        });

        it('should call service composer with the list meetings service, request, and response', async () => {
            await fixture.listMeetings(req, res);
            assert.calledWith(mockServiceComposer, mockListMeetings, req, res);
        });
    });

    describe('createMeeting', () => {
        let mockCreateMeeting;

        before(() => {
            mockCreateMeeting = stub(MeetingService, 'create_meeting');
        });
        after(() => {
            mockCreateMeeting.restore();
        });

        it('should call service composer with the create meeting service, request, and response', async () => {
            await fixture.createMeeting(req, res);
            assert.calledWith(mockServiceComposer, mockCreateMeeting, req, res);
        });
    });

    describe('getMeeting', () => {
        let mockGetMeeting;

        before(() => {
            mockGetMeeting = stub(MeetingService, 'get_meeting');
        });
        after(() => {
            mockGetMeeting.restore();
        });

        it('should call service composer with the get meeting service, request, and response', async () => {
            await fixture.getMeeting(req, res);
            assert.calledWith(mockServiceComposer, mockGetMeeting, req, res);
        });
    });

    describe('deleteMeeting', () => {
        let mockDeleteMeeting;

        before(() => {
            mockDeleteMeeting = stub(MeetingService, 'delete_meeting');
        });
        after(() => {
            mockDeleteMeeting.restore();
        });

        it('should call service composer with the delete meeting service, request, and response', async () => {
            await fixture.deleteMeeting(req, res);
            assert.calledWith(mockServiceComposer, mockDeleteMeeting, req, res);
        });
    });

    describe('getCurrentStory', () => {
        let mockGetCurrentStory;

        before(() => {
            mockGetCurrentStory = stub(MeetingService, 'get_current_story');
        });
        after(() => {
            mockGetCurrentStory.restore();
        });

        it('should call service composer with the get current story service, request, and response', async () => {
            await fixture.getCurrentStory(req, res);
            assert.calledWith(mockServiceComposer, mockGetCurrentStory, req, res);
        });
    });

    describe('updateCurrentStory', () => {
        let mockUpdateCurrentStory;

        before(() => {
            mockUpdateCurrentStory = stub(MeetingService, 'update_current_story');
        });
        after(() => {
            mockUpdateCurrentStory.restore();
        });

        it('should call service composer with the update current story service, request, and response', async () => {
            await fixture.updateCurrentStory(req, res);
            assert.calledWith(mockServiceComposer, mockUpdateCurrentStory, req, res);
        });
    });

});
