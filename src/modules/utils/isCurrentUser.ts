import { MyContext } from '../../types/MyContext';
import { User } from '../../entity/User';

// ? Make middleware function?
export const isCurrentUser = ({ req }: MyContext, user: User): boolean => {
  // Throw error if user is logged in user. Logged in users cannot edit
  // their own admin status.
  if (user.id === req.session!.userId) {
    return true;
  }

  return false;
};
