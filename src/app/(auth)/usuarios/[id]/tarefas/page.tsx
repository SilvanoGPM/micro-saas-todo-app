import {
  DefaultPage,
  DefaultPageHeader,
  DefaultPageSection,
  DefaultPageTitle,
} from '$components/dashboard/page';
import { TodosTable } from '$components/dashboard/todos/table';
import { getCurrentUser } from '$libs/auth/get-current-user';
import { getFirstString } from '$utils/strings';

import { getUserDetails } from './actions';

export default async function UserTodosPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  const userDetails = await getUserDetails(params.id);

  return (
    <DefaultPage>
      <DefaultPageHeader>
        <DefaultPageTitle>
          Tarefas de{' '}
          {getFirstString(userDetails.name || userDetails.email || params.id)}
        </DefaultPageTitle>
      </DefaultPageHeader>

      <DefaultPageSection>
        <TodosTable
          user={user}
          todosDetails={{
            userId: params.id,
            userStripePriceId: userDetails.stripePriceId,
          }}
        />
      </DefaultPageSection>
    </DefaultPage>
  );
}
