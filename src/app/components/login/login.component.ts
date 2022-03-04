import { Component, OnInit } from '@angular/core';
import { ApiCoreService } from '../../provider/api-core.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { users } from '../interface/users';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private apiCore: ApiCoreService,
    private router: Router,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  obj_Agregar: users = {};

  ngOnInit(): void {
    var user = localStorage.getItem('usuarioAxosnet');
    if (user != null) {
      this.router.navigate(['/recibos', user]);
    }
  }

  LoginIn(password: string, email: string) {
    let str = { password, email };
    this.apiCore.putLogin(str).subscribe(
      (response: users) => {
        console.log(response);

        Swal.fire({
          icon: 'success',
          title: `Loggin successfully`,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          localStorage.setItem('usuarioAxosnet', response?.id + '');
          this.router.navigate(['/recibos', response?.id]);
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: `${error.error}`,
          text: '',
        });
      }
    );
  }

  openAgregar(content: any) {
    this.obj_Agregar = {};
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  agregarUsuario(content: any, str: users) {
    if (this.validacion(str)) {
      this.apiCore.postUser(str).subscribe(
        (response) => {
          console.log(response);
          Swal.fire({
            icon: 'success',
            title: 'Usuario Creado Exitosamente',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.modalService.dismissAll(content);
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: `${error.error}`,
            text: '',
          });
        }
      );
    }
  }

  validacion(str: users) {
    if (str.name == undefined || str.name == null || str.name == '') {
      this.mensajeFaltaDato('nombre');
      return false;
    }
    if (str.email == undefined || str.email == null || str.email == '') {
      this.mensajeFaltaDato('email');
      return false;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str.email))) {
      Swal.fire({
        icon: 'error',
        title: 'Email invalido',
        text: 'Direccion de Email invalido',
      });
      return false;
    }
    if (
      str.password == undefined ||
      str.password == null ||
      str.password == ''
    ) {
      this.mensajeFaltaDato('password');
      return false;
    }
    

    return true;
  }

  mensajeFaltaDato(dato: string) {
    Swal.fire({
      icon: 'error',
      title: `Falta un dato`,
      text: `Falta el dato del ${dato}`,
    });
  }
}
