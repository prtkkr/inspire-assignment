import { Component, OnInit } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookListService } from 'src/app/services/book-list.service';
import { BookInterface, DataInterface } from 'src/utils/data.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent implements OnInit {
  data!: DataInterface;
  addForm!: FormGroup;
  headerBtnText: string = 'Add Book';
  isFormVisible: boolean = false;
  isEdit: boolean = false;
  sortBy: boolean = false;
  errorMessage!: string;

  constructor(
    private bookListService: BookListService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAuthorData();
    this.renderAddForm();
  }

  getAuthorData() {
    this.bookListService
      .getBook()
      .pipe(
        map((result: any) => {
          result.data.books.map((x: BookInterface, index: number) => {
            x.Id = index + 1;
          });
          return result.data;
        }),
        catchError(this.handleError)
      )
      .subscribe((res) => {
        this.data = res;
        this.sortByName();
      });
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = `${error.status} - ${error.statusText}. Please refresh the page.`;
    alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  renderAddForm() {
    this.addForm = this.formBuilder.group({
      title: ['', Validators.required],
      imageUrl: ['', Validators.required],
      purchaseLink: ['', Validators.required],
      PublishDate: ['', Validators.required],
      Id: [''],
    });
  }

  // To Validate Book Title in Form
  validateTitle() {
    const title = this.addForm.get('title');
    if (title?.touched && !title.valid) {
      if (title?.errors?.['required']) return 'This field is required';
    }
    return null;
  }

  // To Validate Publishing Year
  validateYear() {
    const year = this.addForm.get('PublishDate');
    if (year?.touched || year?.dirty) {
      if (year?.errors?.['required'] && !year.valid)
        return 'This field is required';
      if (year?.value > new Date().getFullYear() || year?.value < 1000)
        return 'Please enter a valid year.';
    }
    return null;
  }

  // To Validate Book Image Url
  validateImageUrl() {
    const image = this.addForm.get('imageUrl');
    if (image?.touched && !image.valid) {
      if (image?.errors?.['required']) return 'This field is required';
    }
    return null;
  }

  // To Validate Purchase Link
  validateUrl() {
    const link = this.addForm.get('purchaseLink');
    if (link?.touched && !link.valid) {
      if (link?.errors?.['required']) return 'This field is required';
    }
    return null;
  }

  onAddNewBook() {
    this.isFormVisible = !this.isFormVisible;
    this.setButtonText();
    this.addForm.reset();
  }

  onSubmit() {
    if (this.addForm.valid) {
      // remove any white spaces
      const { title, imageUrl, purchaseLink } = this.addForm.value;
      this.addForm.controls['title'].setValue(title.trim());
      this.addForm.controls['imageUrl'].setValue(imageUrl.trim());
      this.addForm.controls['purchaseLink'].setValue(purchaseLink.trim());

      if (!this.isEdit) {
        // Add Value to the Books Array
        this.addForm.controls['Id'].setValue(this.data.books.length + 1);
        this.data.books.push(this.addForm.value);
        this.sortBy ? this.sortByDate : this.sortByName();
        this.onAddNewBook();
      } else {
        // Update Books Array with Updated Data
        const { Id } = this.addForm.value;
        let index = this.data.books.findIndex((x) => x.Id == Id);
        this.data.books[index] = this.addForm.value;
        this.isEdit = false;
        this.onAddNewBook();
      }
    } else {
      this.addForm.markAllAsTouched();
    }
  }

  deleteBook(title: string) {
    let bookIndex = this.data.books.map((x) => x.title).indexOf(title);
    this.data.books.splice(bookIndex, 1);
  }

  editBook(el: HTMLElement, bookData: BookInterface) {
    el.scrollIntoView();
    // Open Book Form and Reset any Value
    this.isFormVisible = true;
    this.isEdit = true;
    this.setButtonText();
    this.addForm.patchValue(bookData);
  }

  setButtonText() {
    this.headerBtnText = this.isFormVisible ? 'Hide Form' : 'Add Book';
  }

  onSortToggle(value: boolean) {
    value ? this.sortByDate() : this.sortByName();
  }

  sortByName() {
    this.data.books.sort((a, b) => {
      let at = a.title.toLowerCase(),
        bt = b.title.toLowerCase();
      if (at < bt) {
        return -1;
      }
      if (at > bt) {
        return 1;
      }
      return 0;
    });
  }

  sortByDate() {
    this.data.books.sort((a, b) => {
      let ad = a.PublishDate,
        bd = b.PublishDate;
      if (ad < bd) {
        return -1;
      }
      if (ad > bd) {
        return 1;
      }
      return 0;
    });
  }
}
