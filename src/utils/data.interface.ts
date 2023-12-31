export interface DataInterface {
  author: string;
  birthPlace: string;
  birthday: string;
  books: Array<BookInterface>;
}

export interface BookInterface {
  PublishDate: string;
  imageUrl: string;
  purchaseLink: string;
  title: string;
  Id: number;
}
