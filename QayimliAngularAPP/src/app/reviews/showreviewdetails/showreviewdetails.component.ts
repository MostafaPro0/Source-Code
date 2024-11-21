import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengtoolsModule } from '../../primengtools/primengtools.module';
import { IReviewResponse } from '../../interfaces/ireview';
import { ReviewType } from '../../enums/reviewtype';
import { VoteService } from '../../services/vote.service';
import { SpinnerService } from '../../services/spinner.service';
import { MessageService } from 'primeng/api';
import { IVoteRequest } from '../../interfaces/ivote';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-showreviewdetails',
  standalone: true,
  imports: [PrimengtoolsModule],
  templateUrl: './showreviewdetails.component.html',
  styleUrl: './showreviewdetails.component.css'
})
export class ShowreviewdetailsComponent {
  addingComment: { [key: string]: string } = {};
  addingVote: { [key: string]: number } = {};
  IsLoadingSavingVote: { [key: string]: boolean } = {};
  ReviewType = ReviewType;
  reviewDetails!: IReviewResponse;
  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _VoteService: VoteService,
    private spinner: SpinnerService,
    private messageService: MessageService,
    private _TranslateService: TranslateService) { }

  ngOnInit(): void {
    this.reviewDetails = this.config.data;
    this.sortReviewDetailsByAverageRate();
    console.log(this.reviewDetails);

  }
  sortReviewDetailsByAverageRate(): void {
    if (this.reviewDetails && this.reviewDetails.reviewDetails) {
      this.reviewDetails.reviewDetails.sort((a, b) => b.averageRate - a.averageRate);
    }
  }
  close() {
    this.ref.close();
  }
  addNewVote(detailId: number) {
    if (this.addingVote[detailId] != null && this.addingVote[detailId] > 0 && this.addingComment[detailId] != null && this.addingComment[detailId] !== '') {
      this.IsLoadingSavingVote[detailId] = true;
      this.spinner.show();
      const voteRequest: IVoteRequest = {
        rate: this.addingVote[detailId],
        comment: this.addingComment[detailId],
        reviewDetailId: detailId
      };

      // Call the VoteService to submit the vote
      this._VoteService.addNewVote(voteRequest).subscribe({
        next: (response) => {
          this.reviewDetails = response;
          this.sortReviewDetailsByAverageRate(); // Sort again if needed
          this.IsLoadingSavingVote[detailId] = false;
          this.spinner.hide();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this._TranslateService.instant("MoCommon.AddingVote") });
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: this._TranslateService.instant("MoCommon.AddingVoteError") });
          this.IsLoadingSavingVote[detailId] = false;
          this.spinner.hide();
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: this._TranslateService.instant("MoCommon.NoStarChoosen") });
    }
  }
}