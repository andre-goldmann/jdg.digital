import { TestBed } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService, HelloResponse } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call hello endpoint and return response', () => {
    const mockResponse: HelloResponse = {
      message: 'Hello World from WellSync Server!',
      timestamp: '2024-01-01T00:00:00.000Z',
      status: 'success',
    };

    service.getHello().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/hello');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
