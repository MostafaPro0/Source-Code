import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { SpinnerService } from '../../services/spinner.service';
import { PrimengtoolsModule } from '../../primengtools/primengtools.module';
import { GetAllReviewsResonse, IReviewResponse } from '../../interfaces/ireview';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ShowreviewdetailsComponent } from '../showreviewdetails/showreviewdetails.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-getreviews',
  standalone: true,
  imports: [PrimengtoolsModule],
  templateUrl: './getreviews.component.html',
  styleUrl: './getreviews.component.css',
  providers: [DialogService]
})
export class GetreviewsComponent implements OnInit {
  numOfOnePage: number = 5; // Default page size
  allTotalItemsCount: number = 0;
  pageNum: number = 1;
  rowsPerPageOptions: any[] = [5, 8, 10];
  SearchReviewTitle: string = '';
  AllReviews?: GetAllReviewsResonse;
  constructor(private _ReviewService: ReviewService, private spinner: SpinnerService, private dialogService: DialogService, private _TranslateService: TranslateService) { }
  ngOnInit(): void {
    this.getAllReviews(this.numOfOnePage, this.pageNum, this.SearchReviewTitle, "PostDateAsc");

  }
  loadReviews(event: any) {
    this.pageNum = Math.floor(event.first / event.rows) + 1;
    this.numOfOnePage = event.rows;
    this.getAllReviews(this.numOfOnePage, this.pageNum, this.SearchReviewTitle, "PostDateAsc");
  }
  onPageSizeChange(event: any) {
    this.numOfOnePage = event.value;
    this.loadReviews({ first: 0, rows: this.numOfOnePage });
  }
  ApplySearch() {
    this.pageNum = 1;
    this.getAllReviews(this.numOfOnePage, this.pageNum, this.SearchReviewTitle, "PostDateAsc");
  }
  changePage(newPageNum: number): void {
    if (newPageNum < 1) {
      return;
    }
    this.pageNum = newPageNum;
    this.getAllReviews(this.numOfOnePage, this.pageNum, this.SearchReviewTitle, "PostDateAsc");
  }
  getAllReviews(numOfPage: number, pageIndex: number, reviewTitle: string, sortBy: string) {
    this.spinner.show();
    this._ReviewService.getAllReviews(numOfPage, pageIndex, reviewTitle, sortBy).subscribe({
      next: (response) => {
        console.log(response);
        this.AllReviews = response;
        this.allTotalItemsCount = response.count;
        this.spinner.hide();

      },
      error: (error) => {
        console.log(error);
        this.spinner.hide();
      }
    });
  }
  openReviewDetails(review: IReviewResponse) {
    const ref: DynamicDialogRef = this.dialogService.open(ShowreviewdetailsComponent, {
      data: review,  // Pass the review details to the dialog
      header: this._TranslateService.instant("MoCommon.ReviewDetails"),
      width: '85%',
      closable: true,
      closeOnEscape: true,
      rtl: this._TranslateService.instant("dir") == "rtl" ? true : false
    });
    console.log(ref);

    ref.onClose.subscribe((result) => {
      // Handle dialog close event if needed
    });
  }
}
