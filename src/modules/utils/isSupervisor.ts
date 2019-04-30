import { MyContext } from '../../types/MyContext';
import { UserDepartment } from '../../entity/UserDepartment';

// Check if user is admin or supervisor of specified department.
export const isSupervisor = async (
  { req }: MyContext,
  deptId: string
): Promise<boolean> => {
  const { userId, isAdmin } = req.session!;

  if (isAdmin) {
    return true;
  }

  const userDept = await UserDepartment.findOne({
    userId,
    deptId,
    supervisor: true,
  });

  if (userDept) {
    return true;
  }

  return false;
};
