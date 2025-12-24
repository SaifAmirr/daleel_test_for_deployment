import { RegisterUserDTO } from "../dtos/register-user-dto";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { LoginUserDTO } from "../dtos/login-user-dto";
import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthenticationService {

    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async register(registerDTO: RegisterUserDTO){
        console.log('Registering user:', registerDTO);
        
        const newUser = this.userRepository.create({
            id: uuidv4(),
            email: registerDTO.email,
            fullName: registerDTO.fullName,
            nationalId: registerDTO.nationalId,
            mobile: registerDTO.mobile,
            dateOfBirth: this.extractDateOfBirthFromNationalId(registerDTO.nationalId),
            supabaseUid: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            isSubscribed: false,
        });
        const saved = await this.userRepository.save(newUser);

        return {
            message: 'User registered successfully',
            user: saved,
        };
    }

    async login(loginDTO: LoginUserDTO){
        // For local dev, just return user data if email exists
        // In production, use proper JWT or session-based auth
        return {
            message: 'Login successful',
            email: loginDTO.email,
        };
        
    }
    
    extractDateOfBirthFromNationalId(nationalId: string): Date {
        if (!/^\d{14}$/.test(nationalId)) {
            throw new Error('Invalid Egyptian National ID format.');
        }

        const centuryCode = nationalId[0];
        const year = parseInt(nationalId.substring(1, 3), 10);
        const month = parseInt(nationalId.substring(3, 5), 10);
        const day = parseInt(nationalId.substring(5, 7), 10);

        let fullYear: number;
        if (centuryCode === '2') {
            fullYear = 1900 + year;
        } else if (centuryCode === '3') {
            fullYear = 2000 + year;
        } else {
            throw new Error('Invalid century code in national ID.');
        }

        // Create date directly (month is 0-indexed in Date constructor)
        return new Date(fullYear, month - 1, day);
    }

}