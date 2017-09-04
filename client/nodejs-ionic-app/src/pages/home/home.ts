import { Component } from "@angular/core";
import { NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Todos } from '../../providers/todos';
import { Auth } from '../../providers/auth';
import { LoginPage } from '../login-page/login-page';

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {
  todos: any;
  loading: any;

  constructor(public navCtrl: NavController, public todoService: Todos, public modalCtrl: ModalController,
    public alertCtrl: AlertController, public authService: Auth, public loadingCtrl: LoadingController) {}

  ionViewDidLoad(){
    this.todoService.getTodos().then((data) => {
          this.todos = data;
    }, (err) => {
      let prompt = this.alertCtrl.create({
        title: 'No autorizado',
        message: 'No está autorizado para realizar esa acción',
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

  addTodo(){
    let prompt = this.alertCtrl.create({
      title: 'Añadir tarea',
      message: 'Describa la tarea:',
      inputs: [
        {
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Crear',
          handler: todo => {
                if(todo){
                    this.showLoader();

                    this.todoService.createTodo(todo).then((result) => {
                        this.loading.dismiss();
                        this.todos = result;
                        let prompt = this.alertCtrl.create({
                          title: 'Tarea Creada',
                          message: 'La tarea ha sido creada correctamente',
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
                    }, (err) => {
                        this.loading.dismiss();
                        let prompt = this.alertCtrl.create({
                          title: 'No autorizado',
                          message: 'No está autorizado para realizar esa acción',
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
          }
        }
      ]
    });
    prompt.present();
  }

  deleteTodo(todo){

    this.showLoader();
    //Remove from database
    this.todoService.deleteTodo(todo._id).then((result) => {
      this.loading.dismiss();

      //Remove locally
        let index = this.todos.indexOf(todo);

        if(index > -1){
            this.todos.splice(index, 1);
        }
    }, (err) => {
      this.loading.dismiss();
      let prompt = this.alertCtrl.create({
        title: 'No autorizado',
        message: 'No está autorizado para realizar esa acción',
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

  logout(){
    this.authService.logout();
    this.navCtrl.setRoot(LoginPage);
  }
}
