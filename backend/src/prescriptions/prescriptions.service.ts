import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePrescriptionDto } from './dto/create-prescription.dto.js';
import { randomBytes } from 'crypto';

@Injectable()
export class PrescriptionsService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreatePrescriptionDto, authorId: string) {

        // Genera un código aleatorio de 8 caracteres (ejemplo: RX-A1B2C3D4)
        const generatedCode =`RX-${randomBytes(4).toString('hex').toUpperCase()}`;

        return this.prisma.prescription.create({
            data: {
                code: generatedCode, // Usamos el código generado
                notes: dto.notes,
                status: 'pending',
                // Conexión con el médico (autor)
                author: { connect: { userId: authorId} },
                // Conexión con el paciente
                patient: { connect: { id: dto.patientId} },
                //Creación anidada de los items de la prescripción
                items: {
                    create: dto.items.map(item => ({
                        name: item.name,
                        dosage: item.dosage,
                        quantity: item.quantity,
                        instructions: item.instructions,
                    })),
                },
            },
            include: {
                items: true, // Para que la respuesta incluya los items creados de la prescripción
            },
        });
    }
}
