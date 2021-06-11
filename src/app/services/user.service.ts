import { Injectable } from "@angular/core";
import { IEditUserData, userCredentials } from "./models/user.model";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})


export class UserService {

    constructor(public http: HttpClient){ }

    authenticateUser(data: userCredentials) {
        return this.http.post(environment.BASE_URL+ 'login', data);
    }

    registerUser(data: userCredentials) {
        return this.http.post(environment.BASE_URL+ 'register', data);
    }

    getUsersList(pageCount?: number) {
        const currentPageCount = pageCount ? pageCount : 1;
        return this.http.get(environment.BASE_URL+ `users?page=${currentPageCount}`);
    }

    getDelayedResponse() {
        return this.http.get(environment.BASE_URL+ `users?delay=5`);
    }

    deleteUser(userId: number) {
        return this.http.delete(environment.BASE_URL+ `users/${userId}`);
    }

    updateUser(data: IEditUserData, id: number) {
        return this.http.put(environment.BASE_URL+ `users/${id}`, data);
    }

}