// User : Auth

import { AssistantSignInDto } from '@app/authentication/assistant/dto/sign-in.dto';
import { AssistantSignUpDto } from '@app/authentication/assistant/dto/sign-up.dto';
import { MemberSignInDto } from '@app/authentication/member/dto/sign-in.dto';
import { MemberSignUpDto } from '@app/authentication/member/dto/sign-up.dto';

export const TestUserSignUpDto: MemberSignUpDto = {
  name: 'test',
  nickname: 'test',
  password: 'test1234!',
  email: 'test@naver.com',
  groupId: '1234',
  role: 'Student',
};

export const User1SignUpDto: MemberSignUpDto = {
  name: 'hoplin',
  nickname: 'nickname',
  password: 'password1234!',
  email: 'jhoplin7259@gmail.com',
  groupId: 'B889047',
  role: 'Student',
};

export const User1SignInDto: MemberSignInDto = {
  email: 'jhoplin7259@gmail.com',
  password: 'password1234!',
};

export const TestAssistantSignUpDto: AssistantSignUpDto = {
  name: 'testassistant',
  password: 'password',
  email: 'test@test.kr',
  role: 'LabAssistant',
};

export const Assistant1SingUpDto: AssistantSignUpDto = {
  name: 'assistant1',
  password: 'password',
  email: 'assist@hongik.ac.kr',
  role: 'OfficeAssistant',
};

export const Assistant1SignInDto: AssistantSignInDto = {
  email: 'assist@hongik.ac.kr',
  password: 'password',
};
