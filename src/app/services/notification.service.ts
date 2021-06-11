import { Injectable } from "@angular/core";
import * as toaster from 'toastr';

@Injectable({
    providedIn: 'root'
})

export class NotificationService {

    constructor() {
        toaster.options.positionClass = "toast-bottom-right";
    }

    notifySucess(message: string) {
        toaster.success(message);
    }

    notifyError(message: string) {
        toaster.error(message);
    }

}