'use strict';

describe('Service: echonestService', function () {

  // load the service's module
  beforeEach(module('smallblackdogApp'));

  // instantiate service
  var echonestService;
  beforeEach(inject(function (_echonestService_) {
    echonestService = _echonestService_;
  }));

  it('should do something', function () {
    expect(!!echonestService).toBe(true);
  });

});
