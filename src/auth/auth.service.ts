import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, VerificationToken } from 'src/user/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(VerificationToken.name) private verificationTokenModel: Model<VerificationToken>,
    private mailerService: MailerService,
  ) { }

  async login(email: string, password: string) {
    const user: any = await this.userService.findByEmail(email);
    if (!user) {
      return { message: 'Invalid credentials email' };
    }
    if (!await bcrypt.compare(password, user.password)) {
      return { message: 'Invalid credentials pwd' };
    }

    const payload = { id: user._id };
    const token = await this.generateToken(payload);
    return { user, token };
  }

  async generateToken(payload: { id: string }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async create(createUserDto: CreateUserDto, profilePic?: Express.Multer.File, resume?: Express.Multer.File) {

    if (typeof createUserDto.links === 'string') {
      try {
        createUserDto.links = JSON.parse(createUserDto.links);

      } catch (error) {
        throw new BadRequestException('Links must be a valid JSON object');

      }
    }

    const createdUser = new this.userModel(createUserDto);

    if (profilePic) {
      createdUser.profilePic = profilePic.filename;
    }

    if (resume) {
      createdUser.resume = resume.filename;
    }
    const token = crypto.randomUUID();
    const verificationToken = new this.verificationTokenModel({ _userId: createdUser._id, token, createdAt: Date.now() });
    this.sendMail(createdUser.email, 'feee@ez.com', 'sybject', 'fezfzefz', verificationToken.token)
    await verificationToken.save();
    return createdUser.save();

  }


  async verify(token: string) {
    const verificationToken = await this.verificationTokenModel.findOne({ token });
    if (!verificationToken) {
      throw new NotFoundException('Invalid token');
    }

    const user = await this.userModel.findById(verificationToken._userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isVerified = true;
    await user.save();
    await this.verificationTokenModel.deleteOne({ token });

    return { message: 'User verified' };
  }

  sendMail(to: string, from: string, subject: string, text: string, token: string) {
    const templateSource = fs.readFileSync('src/mails/email-verification.template.hbs', 'utf8');
    const template = Handlebars.compile(templateSource);
    const html = template({ token });

    this.mailerService.sendMail({
      to: to,
      from: from,
      subject: subject,
      text: text,
      html: html,

    })
  }
}