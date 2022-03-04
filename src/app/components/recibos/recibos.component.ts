import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCoreService } from "../../provider/api-core.service"
import { recibo } from '../interface/recibos';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { users } from '../interface/users';

@Component({
  selector: 'app-recibos',
  templateUrl: './recibos.component.html',
  styleUrls: ['./recibos.component.css']
})
export class RecibosComponent implements OnInit {

  constructor(private apiCore: ApiCoreService, private router: ActivatedRoute, private routerPage:Router, private modalService: NgbModal,config: NgbModalConfig) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.router.params.subscribe( params => {
      var user = localStorage.getItem('usuarioAxosnet');
      if(user != params['id']){
        this.routerPage.navigate(['/recibos', user ]);
      }else{
        this.userId = params['id']
        this.getRecibos( params['id'] );
        this.getUser(params['id']);
      }
    });
  }



  userId:string = "";
  recibos: recibo[] = [];
  headers:string[] = ["id","proveedor","moneda","monto","fecha"]



  getUser(id:string){
    this.apiCore.getUser(id)
    .subscribe( (user:users[]) => {
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: `${user[0].name}`,
      })
    })
  }

  getRecibos(id:string) {
    this.apiCore.getRecibos( id )
    .subscribe( (recibo:recibo[]) => {
      this.recibos = recibo;
      console.log(recibo)
    })

  }

  cerrarSesion(){
    window.localStorage.removeItem('usuarioAxosnet');
    this.routerPage.navigate(['/recibos']);
  }
  
  openAgregar(content:any) {
    this.obj_Agregar = {};
    this.modalService.open(content, { centered: true , size: 'xl' });
  }

  openModificar(content:any,row:recibo) {
    this.obj_Modificacion = {};
    this.obj_Modificacion = {...row};
    this.modalService.open(content, { centered: true , size: 'xl' });
  }

  openVista(content:any,row:recibo) {
    this.obj_Vista = {};
    this.obj_Vista = {...row};
    this.modalService.open(content, { centered: true , size: 'xl' });
  }

  obj_Agregar:recibo = {};
  obj_Modificacion:recibo = {};
  obj_Vista:recibo = {};

  lst_Moneda = [
    "MXN",
    "EUR",
    "USD",
    "CAD"
  ]
  

  //Agregar recibo
  postRecibo(content:any,str:recibo) {
    if(this.validacion(str)){
      str.userId = Number(this.userId)
      this.apiCore.postRecibo(str)
      .subscribe(
        (response:recibo) => {                          
          console.log(response);
        
          Swal.fire({
            icon: 'success',
            title:  `Recibo Agregado correctamente`,
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.modalService.dismissAll(content);
            this.getRecibos(this.userId)
          })
        },
        (error) => {                 
          console.log(error.error)
          Swal.fire({
            icon: 'error',
            title: `sea sucitado un error`,
            text: '',
          })
        }
      )
    }
   

  }

  //Actualizacion del recibo
  putRecibo(content:any) {
    if(this.validacion(this.obj_Modificacion)){
      this.obj_Modificacion.userId = Number(this.userId);
      this.apiCore.putRecibo(this.obj_Modificacion)
        .subscribe(
          (response:recibo) => {                          
            console.log(response);
        
            Swal.fire({
              icon: 'success',
              title:  `Sea Modificado correctamente`,
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.modalService.dismissAll(content);
              this.getRecibos(this.userId)
            })
          },
          (error) => {                 
            console.log(error.error)
            Swal.fire({
              icon: 'error',
              title: `sea sucitado un error`,
              text: '',
            })
          }
        )
    }
    

  }

  deleteRecibo(row:recibo) {
    
    this.apiCore.deleteRecibo(row.id+"")
    .subscribe((response:recibo) => {                          
        console.log(response);
        Swal.fire({
          icon: 'success',
          title:  `Recibo Eliminado correctamente`,
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.getRecibos(this.userId)
        })
      },
      (error) => {                 
        console.log(error.error)
        Swal.fire({
          icon: 'error',
          title: `sea sucitado un error`,
          text: '',
        })
      }
    )

  }


  validacion(str:recibo){
    if(str.proveedor== undefined || str.proveedor == null || str.proveedor == ''){
     this.mensajeFaltaDato('proveedor') 
     return false
    }
    if(str.moneda== undefined || str.moneda == null || str.moneda == ''){
      this.mensajeFaltaDato('moneda') 
      return false
     }
     if(str.monto== undefined || str.monto == null || isNaN(+str.monto) || str.monto <= 0){
      this.mensajeFaltaDato('monto') 
      return false
     }
     if(str.fecha== undefined || str.fecha == null || str.fecha.toString() == ''){
      this.mensajeFaltaDato('fecha') 
      return false
     }

     return true;
  }

  mensajeFaltaDato(dato:string){
    Swal.fire({
      icon: 'error',
      title: `Faltan datos`,
      text: `Falta el dato "${dato}"`,
    })
  }

}
