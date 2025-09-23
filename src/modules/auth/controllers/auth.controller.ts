import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async signup(req: Request, res: Response) {
    const dto: SignupDto = req.body;
    const result = await this.authService.signup(dto, req);
    return res.status(201).json(result);
  }

  async login(req: Request, res: Response) {
    const dto: LoginDto = req.body;
    const result = await this.authService.login(dto, req);
    return res.status(200).json(result);
  }

  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const result = await this.authService.refresh(refreshToken, req);
    return res.status(200).json(result);
  }

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const result = await this.authService.logout(refreshToken, req);
    return res.status(200).json(result);
  }

  async forgotPassword(req: Request, res: Response) {
    const dto = req.body;
    const result = await this.authService.forgotPassword(dto, req);
    return res.status(200).json(result);
  }

  async resetPassword(req: Request, res: Response) {
    const dto = req.body;
    const result = await this.authService.resetPassword(dto, req);
    return res.status(200).json(result);
  }

  async resendVerification(req: Request, res: Response) {
    const dto = req.body;
    const result = await this.authService.resendVerification(dto, req);
    return res.status(200).json(result);
  }

  // Outros métodos: refresh, forgotPassword, resetPassword, resendVerification, etc.
}
