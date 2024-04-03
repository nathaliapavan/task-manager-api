import { IAuthService } from '../../application/authService';
import { Request, Response } from 'express';

export default class AuthController {
  constructor(private authService: IAuthService) {}

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await this.authService.authenticate(email, password);
      if (token) {
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
