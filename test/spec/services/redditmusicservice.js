'use strict';

describe('Service: redditMusicService', function () {

  // load the service's module
  beforeEach(module('smallblackdogApp'));

  // instantiate service
  var redditMusicService;
  beforeEach(inject(function (_redditMusicService_) {
    redditMusicService = _redditMusicService_;
  }));

  it('should do something', function () {
    expect(!!redditMusicService).toBe(true);
  });

});
