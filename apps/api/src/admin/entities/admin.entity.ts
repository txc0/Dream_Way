import { ChildEntity } from 'typeorm';
import { User } from 'src/common/enities/user.entity';

@ChildEntity('admin')
export class Admin extends User {
  
}
