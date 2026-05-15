import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service.js';
import { CreatePrescriptionDto } from './dto/create-prescription.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
// Nota: Necesitarás un RolesGuard para que @Roles funcione, 
// pero por ahora usemos el Guard de JWT para validar la conexión.

@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
export class PrescriptionsController {
    constructor(private readonly prescriptionsService: PrescriptionsService) {}

    @Post()
    @Roles('doctor') // Solo los doctores pueden crear recetas
    create(@Body() createPrescriptionDto: CreatePrescriptionDto, @Req() req) {
    // El 'sub' es el ID que viene en el token que ya probamos
    const userId = req.user.userId || req.user.sub;
    
    return this.prescriptionsService.create(createPrescriptionDto, userId);
    }
}
