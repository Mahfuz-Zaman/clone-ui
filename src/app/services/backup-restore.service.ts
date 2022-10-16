import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Collection} from '../interfaces/collection';

const API_BACKUP_RESTORE = environment.apiBaseLink + '/api/backup-restore/';


@Injectable({
  providedIn: 'root'
})
export class BackupRestoreService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * BACKUP RESTORE
   */
  backupCollection(data: { collectionName: string }) {
    return this.httpClient.post<{ message: string; success: boolean }>(API_BACKUP_RESTORE + 'collection-backup', data);
  }

  restoreCollection(data: { collectionName: string, force: boolean }) {
    return this.httpClient.post<{ message: string; success: boolean }>(API_BACKUP_RESTORE + 'collection-restore', data);
  }

  getCollectionList() {
    return this.httpClient.get<{ data: Collection[]; success: boolean }>(API_BACKUP_RESTORE + 'get-all-collections');
  }

}
