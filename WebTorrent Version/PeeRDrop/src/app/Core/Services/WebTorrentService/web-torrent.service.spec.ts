import { TestBed } from '@angular/core/testing';

import { WebTorrentService } from './web-torrent.service';

describe('WebTorrentService', () => {
  let service: WebTorrentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebTorrentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
