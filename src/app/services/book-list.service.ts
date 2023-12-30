import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class BookListService {
  constructor(private http: HttpClient) {}

  getBook() {
    return this.http.get(API_URL);
  }
}
