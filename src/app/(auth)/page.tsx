import { auth } from '$libs/auth';

import { SignOut } from './_components/sign-out';

export default async function Dashboard() {
  const session = await auth();

  return (
    <div>
      {JSON.stringify(session)}
      <SignOut />
    </div>
  );
}
