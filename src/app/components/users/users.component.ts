import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import {
  IEditUserResponse,
  IEditUserSuccessResponse,
  IGetUserListSuccessRespose,
  IUsers
} from 'src/app/services/models/user.model';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'avatar', 'first_name', 'last_name', 'email', 'action'];
  dataSource: IUsers[] = [];
  totalResults: number = 0;
  pageSize: number = 0;
  backupListData = [];
  private subscription$ = true;
  private readonly subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private toaster: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.getUserDetails(1);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    /* Unsubscribing the observables */
    this.subscription$ = false;
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  getUserDetails(index: number) {
    const getUserSubscriber: Subscription = this.userService.getUsersList(index).pipe(takeWhile(()=>this.subscription$))
    .subscribe(
      (res: IGetUserListSuccessRespose) => {
        this.dataSource = res.data;
        this.backupListData = res.data;
        this.totalResults = res.total;
        this.pageSize = res.per_page;
      },
      (err) => {
        this.toaster.notifyError('Error on fetching the user details');
      }
    );

    this.subscriptions.push(getUserSubscriber);


  }

  onPageChange(event: any) {
    this.getUserDetails(event.pageIndex + 1);
  }

  /* Filtering the data manually on the front end */
  filterData(text: string) {
    if (text && text.length) {
      let filteredList = [];
      this.backupListData.map((data) => {
        if (data.first_name.toLowerCase().indexOf(text.toLowerCase()) > -1 || data.last_name.toLowerCase().indexOf(text.toLowerCase()) > -1) {
          filteredList.push(data);
        }
      });
      this.dataSource = filteredList;
    } else {
      this.dataSource = this.backupListData;
    }
  }

  logoutHandler() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  deleteHandler(id: number) {
    const isDeleteConfirmed = this.dialog.open(DeleteDialogComponent, { disableClose: true });
    isDeleteConfirmed.afterClosed().subscribe((deleteData: boolean) => {
      if (deleteData) {
        const deleteSubscriber: Subscription =this.userService.deleteUser(id).pipe(takeWhile(()=>this.subscription$)).subscribe(
          (res) => {
            this.toaster.notifySucess('User deleted successfully');
          },
          (err) => {
            this.toaster.notifySucess('Unable to Delete User');
          }
        );
        this.subscriptions.push(deleteSubscriber);
      }
    });
  }

  editHandler(name: string, id: number) {
    const editDialog = this.dialog.open(EditUserComponent, {
      disableClose: true,
      data: { name: name }
    });
    editDialog.afterClosed().subscribe((editData: IEditUserResponse) => {
      if (editData.edited) {
       const  updateUserSubscriber: Subscription =  this.userService.updateUser(editData.data, id).pipe(takeWhile(()=>this.subscription$)).subscribe(
          (res: IEditUserSuccessResponse) => {
            this.toaster.notifySucess('User details updated');
          },
          (err) => {
            this.toaster.notifyError('User details update failed');
          }
        );

        this.subscriptions.push(updateUserSubscriber);
      }
    });
  }

  delayHandler() {
    const delayedSubscriber: Subscription = this.userService.getDelayedResponse().pipe(takeWhile(()=>this.subscription$)).subscribe(
      (res: IGetUserListSuccessRespose) => {
        this.dataSource = res.data;
        this.backupListData = res.data;
        this.totalResults = res.total;
        this.pageSize = res.per_page;
      },
      (err) => {
        this.toaster.notifyError('Error on fetching the delayed details');
      }
    );

    this.subscriptions.push(delayedSubscriber);

  }
}
