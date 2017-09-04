import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Auth } from '../../providers/auth';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup-page/signup-page';

@Component({
  selector: 'login-page',
  templateUrl: 'login-page.html'
})
export class LoginPage {
    email: string;
    password: string;
    loading: any;

    constructor(public alertCtrl: AlertController,public navCtrl: NavController, public authService: Auth, public loadingCtrl: LoadingController) {}

    ionViewDidLoad() {
        this.showLoader();
        //Check if already authenticated
        this.authService.checkAuthentication().then((res) => {
            console.log("Autorizado");
            this.loading.dismiss();
            this.navCtrl.setRoot(HomePage);
        }, (err) => {
            console.log("No autorizado");
            this.loading.dismiss();
        });
    }

    login(){
        this.showLoader();
        let credentials = {
            email: this.email,
            password: this.password
        };
        this.authService.login(credentials).then((result) => {
            this.loading.dismiss();
            //console.log(result);
            this.navCtrl.setRoot(HomePage);
        }, (err) => {
            this.loading.dismiss();
            let prompt = this.alertCtrl.create({
              title: 'Error',
              message: 'Email o contraseña incorrectos',
              buttons: [
                {
                  text: 'Vale',
                  handler: todo => {
                    this.loading.dismiss();
                  }
                }
              ]
            });
            prompt.present();
        });
    }

    launchSignup(){
        this.navCtrl.push(SignupPage);
    }

    showLoader(){
        this.loading = this.loadingCtrl.create({
            content: 'Verificando...'
        });
        this.loading.present();
    }
}
