import { UploadAllowedInterceptor } from './is-upload-allowed.interceptor';

describe('IsUploadAllowedInterceptor', () => {
  it('should be defined', () => {
    expect(new UploadAllowedInterceptor()).toBeDefined();
  });
});
