import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Auth } from '../../providers/auth';
import { HomePage } from '../home/home';

@Component({
  selector: 'signup-page',
  templateUrl: 'signup-page.html'
})
export class SignupPage {
  role: string;
  email: string;
  password: string;
  loading: any;

  constructor(public navCtrl: NavController, public authService: Auth, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {}

  register(){
    this.showLoader();
    let details = {
        email: this.email,
        password: this.password,
        role: this.role
    };

    this.authService.createAccount(details).then((result) => {
      this.loading.dismiss();
      console.log(result);
      let prompt = this.alertCtrl.create({
        title: 'Éxito',
        message: 'Cuenta creada correctamente',
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
      this.navCtrl.setRoot(HomePage);
    }, (err) => {
        this.loading.dismiss();
        let prompt = this.alertCtrl.create({
          title: 'Error',
          message: 'Ya existe una cuenta con ese email',
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

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Verificando...'
    });
    this.loading.present();
  }
}
