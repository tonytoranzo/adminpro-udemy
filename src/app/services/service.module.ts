import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { SettingsService, SharedService, SidebarService, UsuarioService, HospitalService,
         MedicoService, SubirArchivoService, LoginGuard, AdminGuard, VerificaTokenGuard } from './service.index';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService,
    SharedService,
    SidebarService,
    UsuarioService,
    HospitalService,
    MedicoService,
    SubirArchivoService,
    ModalUploadService,
    LoginGuard,
    AdminGuard,
    VerificaTokenGuard
  ]
})
export class ServiceModule { }
