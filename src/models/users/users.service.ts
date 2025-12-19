import { Injectable } from '@nestjs/common';

export type User = {
  userId: number;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users = [
    { userId: 1, username: 'philip', password: 'changeme' },
    { userId: 2, username: 'john', password: 'changeme2' },
    { userId: 3, username: 'jane', password: 'changeme3' },
  ];

  findOne(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }
}
