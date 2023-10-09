/**
 *
 * test member API
 *
 */

import { PrismaService } from '@app/prisma/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import {
  generateRandomAssistant,
  generateRandomMember,
} from 'test/payload.test';
import * as request from 'supertest';
import { Assistant, User } from '@prisma/client';
import { generateDummyFileBuffer } from 'test/generate-test-dummy';

export default describe('Member API', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  /** Assistant1 - Student Council */
  const [assistant1Signup, assistant1Signin, assistant1Edit] =
    generateRandomAssistant(false);
  assistant1Signup.role = 'StudentCouncil';
  let assistant1Accesstoken: string;
  let assistant1: Assistant;

  /** Assistant2 - Laboratory Assistant */
  const [assistant2Signup, assistant2Signin, assistant2Edit] =
    generateRandomAssistant(false);
  assistant2Signup.role = 'LabAssistant';
  let assistant2Accesstoken: string;
  let assistant2: Assistant;

  /** User1 */
  const [user1Signup, user1Signin, user1Edit] = generateRandomMember(false);
  let user1Accesstoken: string;
  let user1: User;

  beforeAll(async () => {
    const testModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testModule.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
    await app.listen(0);
  });

  afterAll(async () => {
    /** Delete all of test datas */
    await prisma.deleteAll();
    /** Close Nest.js App */
    await app.close();
  });

  /** Require Signup before test */
  describe('/assistant/member & /user/member', () => {
    /** Sign Up */
    describe('/assistant/auth/signup (POST)', () => {
      it('should signup', async () => {
        /** User1 Access Token */
        const user1SignUpResult = await request(app.getHttpServer())
          .post('/user/auth/signup')
          .send(user1Signup)
          .expect(201);
        user1Accesstoken = user1SignUpResult.body.accessToken;

        /** Assistant1 Access Token */
        const assistant1SignUpResult = await request(app.getHttpServer())
          .post('/assistant/auth/signup')
          .send(assistant1Signup)
          .expect(201);
        assistant1Accesstoken = assistant1SignUpResult.body.accessToken;

        /** Assisant2 Access Token */
        const assistant2SignUpResult = await request(app.getHttpServer())
          .post('/assistant/auth/signup')
          .send(assistant2Signup)
          .expect(201);
        assistant2Accesstoken = assistant2SignUpResult.body.accessToken;

        user1 = await prisma.user.findUnique({
          where: {
            email: user1Signup.email,
          },
        });
        assistant1 = await prisma.assistant.findUnique({
          where: {
            email: assistant1Signup.email,
          },
        });
      });
    });
  });

  describe('/assistant/member (GET)', () => {
    it('should throw if unauthorized', () => {
      return request(app.getHttpServer()).get('/assistant/member').expect(401);
    });

    it('should throw if assistant not found', () => {
      return request(app.getHttpServer())
        .get('/assistant/member')
        .set('Authorization', `Bearer ${user1Accesstoken}`)
        .expect(403);
    });

    it('should get assistant information', async () => {
      const result = (
        await request(app.getHttpServer())
          .get('/assistant/member')
          .set('Authorization', `Bearer ${assistant1Accesstoken}`)
          .expect(200)
      ).body;
      expect(result.email).toBe(assistant1Signup.email);
    });
  });

  describe('/assistant/member/user/overview (GET)', () => {
    it('should throw if unauthorized', () => {
      return request(app.getHttpServer())
        .get('/assistant/member/user/overview')
        .expect(401);
    });

    it('should throw if assistant not found', () => {
      return request(app.getHttpServer())
        .get('/assistant/member/user/overview')
        .set('Authorization', `Bearer ${user1Accesstoken}`)
        .expect(403);
    });

    it('should throw if assistant have no access', () => {
      /** Student council have no access to this API */
      return request(app.getHttpServer())
        .get('/assistant/member/user/overview')
        .set('Authorization', `Bearer ${assistant1Accesstoken}`)
        .expect(403);
    });

    it('should get user overview', () => {
      return request(app.getHttpServer())
        .get('/assistant/member/user/overview')
        .set('Authorization', `Bearer ${assistant2Accesstoken}`)
        .expect(200);
    });
  });

  describe('/assistant/member/user/:uid (GET)', () => {
    it('should throw if unauthorized', () => {
      return request(app.getHttpServer())
        .get('/assistant/member/user/fake-user')
        .expect(401);
    });
    it('should throw if assistant have no access(Student Council)', () => {
      return request(app.getHttpServer())
        .get(`/assistant/member/user/${user1.id}`)
        .set('Authorization', `Bearer ${assistant1Accesstoken}`)
        .expect(403);
    });
    it('should throw if user not found', () => {
      return request(app.getHttpServer())
        .get('/assistant/member/user/fake-user-id')
        .set('Authorization', `Bearer ${assistant2Accesstoken}`)
        .expect(400);
    });
    it('should give user information', async () => {
      const result = (
        await request(app.getHttpServer())
          .get(`/assistant/member/user/${user1.id}`)
          .set('Authorization', `Bearer ${assistant2Accesstoken}`)
          .expect(200)
      ).body;
      expect(result.id).toBe(user1.id);
    });
  });

  describe('/assistant/member/ (PATCH)', () => {
    it('should throw if unauthorized', () => {
      return request(app.getHttpServer())
        .patch('/assistant/member')
        .expect(401);
    });
    it('should throw if payload not given', () => {
      return request(app.getHttpServer())
        .patch('/assistant/member')
        .set('Authorization', `Bearer ${assistant1Accesstoken}`)
        .expect(400);
    });

    it('should throw if password unmatched', async () => {
      const editAssistant1 = {
        name: assistant1Signup.name,
        password: 'wrong password',
      };

      return request(app.getHttpServer())
        .patch('/assistant/member')
        .set('Authorization', `Bearer ${assistant1Accesstoken}`)
        .send(editAssistant1)
        .expect(401);
    });
    it('should change credential without password change', async () => {
      const editAssistant1 = {
        name: assistant1Signup.name,
        password: assistant1Signup.password,
      };
      const result = await request(app.getHttpServer())
        .patch('/assistant/member')
        .set('Authorization', `Bearer ${assistant1Accesstoken}`)
        .field('name', 'assistant-name')
        .field('password', assistant1Signup.password)
        .expect(200);
      expect(result.body.id).toBe(assistant1.id);
    });

    it('check allowed extensions', async () => {
      const allowedExtension = ['jpg', 'jpeg'];
      for (const i of allowedExtension) {
        const [buffer, name] = generateDummyFileBuffer(i);
        await request(app.getHttpServer())
          .patch('/assistant/member')
          .set('Authorization', `Bearer ${assistant1Accesstoken}`)
          .attach('profile', buffer, { filename: name })
          .field('name', 'assistant-name')
          .field('password', assistant1Signup.password);
      }
    });
  });
});
